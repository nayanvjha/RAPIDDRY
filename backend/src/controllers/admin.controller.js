const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const { sendPushNotification } = require('../services/notification.service');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const VALID_ORDER_STATUSES = [
  'placed',
  'agent_assigned',
  'picked_up',
  'at_partner',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const normalizePagination = (query) => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const applyOrderFilters = (queryBuilder, filters) => {
  const { status, dateFrom, dateTo, search } = filters;

  if (status) {
    queryBuilder.andWhere('o.status', status);
  }

  if (dateFrom) {
    queryBuilder.andWhere('o.created_at', '>=', new Date(dateFrom));
  }

  if (dateTo) {
    const endDate = new Date(dateTo);
    endDate.setHours(23, 59, 59, 999);
    queryBuilder.andWhere('o.created_at', '<=', endDate);
  }

  if (search) {
    const needle = `%${String(search).trim().toLowerCase()}%`;
    queryBuilder.andWhere((subQuery) => {
      subQuery
        .whereRaw('LOWER(o.order_number) LIKE ?', [needle])
        .orWhereRaw('LOWER(cu.name) LIKE ?', [needle])
        .orWhereRaw('LOWER(cu.phone) LIKE ?', [needle]);
    });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      [{ count: ordersTodayCount }],
      [{ revenue_today: revenueToday }],
      [{ count: activeAgentsCount }],
      [{ count: pendingPickupsCount }],
    ] = await Promise.all([
      db('orders').where('created_at', '>=', startOfDay).count('*'),
      db('orders')
        .where('created_at', '>=', startOfDay)
        .andWhere('payment_status', 'paid')
        .sum('total as revenue_today'),
      db('agents').where({ is_online: true }).count('*'),
      db('orders').where({ status: 'placed' }).count('*'),
    ]);

    return ApiResponse.success(res, {
      orders_today: Number(ordersTodayCount || 0),
      revenue_today: Number(revenueToday || 0),
      active_agents: Number(activeAgentsCount || 0),
      pending_pickups: Number(pendingPickupsCount || 0),
    });
  } catch (error) {
    return next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = normalizePagination(req.query);
    const filters = {
      status: req.query.status,
      dateFrom: req.query.date_from,
      dateTo: req.query.date_to,
      search: req.query.search,
    };

    const ordersQuery = db('orders as o')
      .leftJoin('users as cu', 'cu.id', 'o.customer_id')
      .leftJoin('order_items as oi', 'oi.order_id', 'o.id')
      .leftJoin('deliveries as d', function joinDelivery() {
        this.on('d.order_id', '=', 'o.id').andOn('d.type', '=', db.raw('?', ['pickup']));
      })
      .leftJoin('agents as ag', 'ag.id', 'd.agent_id')
      .leftJoin('users as au', 'au.id', 'ag.user_id')
      .select(
        'o.id',
        'o.order_number',
        'o.status',
        'o.total',
        'o.payment_status',
        'o.created_at',
        'cu.name as customer_name',
        'cu.phone as customer_phone'
      )
      .count('oi.id as item_count')
      .max('au.name as agent_name')
      .groupBy('o.id', 'cu.id')
      .orderBy('o.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    applyOrderFilters(ordersQuery, filters);

    const totalQuery = db('orders as o')
      .leftJoin('users as cu', 'cu.id', 'o.customer_id')
      .countDistinct('o.id as total');

    applyOrderFilters(totalQuery, filters);

    const [orders, [{ total }]] = await Promise.all([ordersQuery, totalQuery]);

    return ApiResponse.success(res, {
      orders,
      total: Number(total || 0),
      page,
      limit,
    });
  } catch (error) {
    return next(error);
  }
};

const getOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await db('orders').where({ id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const [customer, address, items, payment, deliveries, notifications] = await Promise.all([
      db('users')
        .select('id', 'name', 'phone', 'email', 'role')
        .where({ id: order.customer_id })
        .first(),
      db('addresses').where({ id: order.address_id }).first(),
      db('order_items as oi')
        .leftJoin('service_items as si', 'si.id', 'oi.service_item_id')
        .select(
          'oi.*',
          'si.name as service_name',
          'si.price as service_current_price'
        )
        .where('oi.order_id', order.id)
        .orderBy('oi.id', 'asc'),
      db('payments').where({ order_id: order.id }).orderBy('created_at', 'desc').first(),
      db('deliveries as d')
        .leftJoin('agents as ag', 'ag.id', 'd.agent_id')
        .leftJoin('users as au', 'au.id', 'ag.user_id')
        .select(
          'd.*',
          'au.name as agent_name',
          'au.phone as agent_phone'
        )
        .where('d.order_id', order.id)
        .orderBy('d.created_at', 'asc'),
      db('notifications')
        .where({ order_id: order.id })
        .orderBy('created_at', 'desc'),
    ]);

    return ApiResponse.success(res, {
      ...order,
      customer,
      address,
      items,
      payment,
      deliveries,
      notifications,
    });
  } catch (error) {
    return next(error);
  }
};

const assignAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agent_id: agentId } = req.body;

    if (!agentId) {
      return ApiResponse.error(res, 'agent_id is required', 400);
    }

    const [order, agent] = await Promise.all([
      db('orders').where({ id }).first(),
      db('agents as a')
        .leftJoin('users as u', 'u.id', 'a.user_id')
        .select('a.*', 'u.name as user_name', 'u.id as assigned_user_id')
        .where('a.id', agentId)
        .first(),
    ]);

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    if (!agent) {
      return ApiResponse.error(res, 'Agent not found', 404);
    }

    if (!agent.is_online) {
      return ApiResponse.error(res, 'Agent is offline', 400);
    }

    const updatedOrder = await db.transaction(async (trx) => {
      const existingDelivery = await trx('deliveries')
        .where({ order_id: order.id, type: 'pickup' })
        .whereNot('status', 'completed')
        .first();

      if (existingDelivery) {
        await trx('deliveries').where({ id: existingDelivery.id }).update({
          agent_id: agent.id,
          status: 'assigned',
        });
      } else {
        await trx('deliveries').insert({
          order_id: order.id,
          agent_id: agent.id,
          type: 'pickup',
          status: 'assigned',
        });
      }

      const [nextOrder] = await trx('orders')
        .where({ id: order.id })
        .update(
          {
            status: 'agent_assigned',
            updated_at: trx.fn.now(),
          },
          '*'
        );

      return nextOrder;
    });

    await Promise.all([
      sendPushNotification(
        agent.user_id,
        'New pickup assigned',
        `You have a new pickup assigned for order ${order.order_number}`,
        {
          order_id: order.id,
          order_number: order.order_number,
          type: 'pickup_assignment',
        }
      ),
      sendPushNotification(
        order.customer_id,
        'Agent assigned to your order',
        `Agent has been assigned for order ${order.order_number}`,
        {
          order_id: order.id,
          order_number: order.order_number,
          status: 'agent_assigned',
        }
      ),
    ]);

    return ApiResponse.success(res, updatedOrder);
  } catch (error) {
    return next(error);
  }
};

const getAllAgents = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const agents = await db('agents as a')
      .leftJoin('users as u', 'u.id', 'a.user_id')
      .select(
        'a.id',
        'a.user_id',
        'u.name',
        'u.phone',
        'u.email',
        'u.is_active',
        'a.is_online',
        'a.zone',
        'a.rating',
        'a.total_deliveries'
      )
      .select(
        db('deliveries')
          .count('*')
          .whereRaw('deliveries.agent_id = a.id')
          .andWhere('deliveries.status', 'completed')
          .andWhere('deliveries.completed_at', '>=', startOfDay)
          .as('today_delivery_count')
      )
      .orderBy('u.name', 'asc');

    return ApiResponse.success(res, agents);
  } catch (error) {
    return next(error);
  }
};

const createAgent = async (req, res, next) => {
  try {
    const { name, phone, email, zone } = req.body;

    if (!name || !phone) {
      return ApiResponse.error(res, 'name and phone are required', 400);
    }

    const created = await db.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          firebase_uid: `agent-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          name,
          phone,
          email: email || null,
          role: 'agent',
          is_active: true,
        })
        .returning('*');

      const [agent] = await trx('agents')
        .insert({
          user_id: user.id,
          zone: zone || null,
          is_online: false,
          rating: 5.0,
          total_deliveries: 0,
        })
        .returning('*');

      return {
        ...agent,
        user,
      };
    });

    return ApiResponse.success(res, created, 201);
  } catch (error) {
    return next(error);
  }
};

const suspendAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agent = await db('agents').where({ id }).first();

    if (!agent) {
      return ApiResponse.error(res, 'Agent not found', 404);
    }

    await db.transaction(async (trx) => {
      await trx('users').where({ id: agent.user_id }).update({
        is_active: false,
        updated_at: trx.fn.now(),
      });

      await trx('agents').where({ id: agent.id }).update({
        is_online: false,
        updated_at: trx.fn.now(),
      });
    });

    return ApiResponse.success(res, {
      success: true,
      message: 'Agent suspended successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const { page, limit, offset } = normalizePagination(req.query);
    const search = req.query.search;

    const customersQuery = db('users as u')
      .select(
        'u.id',
        'u.name',
        'u.phone',
        'u.email',
        'u.is_active',
        'u.created_at'
      )
      .select(
        db('orders')
          .count('*')
          .whereRaw('orders.customer_id = u.id')
          .as('order_count')
      )
      .select(
        db('orders')
          .sum('total')
          .whereRaw('orders.customer_id = u.id')
          .andWhere('orders.payment_status', 'paid')
          .as('total_spent')
      )
      .where('u.role', 'customer')
      .orderBy('u.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (search) {
      const needle = `%${String(search).trim().toLowerCase()}%`;
      customersQuery.andWhere((q) => {
        q.whereRaw('LOWER(u.name) LIKE ?', [needle]).orWhereRaw('LOWER(u.phone) LIKE ?', [needle]);
      });
    }

    const totalQuery = db('users as u').where('u.role', 'customer').count('* as total');

    if (search) {
      const needle = `%${String(search).trim().toLowerCase()}%`;
      totalQuery.andWhere((q) => {
        q.whereRaw('LOWER(u.name) LIKE ?', [needle]).orWhereRaw('LOWER(u.phone) LIKE ?', [needle]);
      });
    }

    const [customers, [{ total }]] = await Promise.all([customersQuery, totalQuery]);

    return ApiResponse.success(res, {
      customers,
      total: Number(total || 0),
      page,
      limit,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllPartners = async (req, res, next) => {
  try {
    const partners = await db('partners as p')
      .leftJoin('users as u', 'u.id', 'p.user_id')
      .leftJoin('orders as o', 'o.partner_id', 'p.id')
      .select(
        'p.id',
        'p.name',
        'p.phone',
        'p.email',
        'p.zone',
        'p.is_active',
        'u.id as user_id',
        'u.name as user_name',
        'u.phone as user_phone',
        'u.is_active as user_is_active'
      )
      .count('o.id as order_count')
      .sum('o.total as order_value_total')
      .groupBy('p.id', 'u.id')
      .orderBy('p.created_at', 'desc');

    return ApiResponse.success(res, partners);
  } catch (error) {
    return next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discount_type: discountType,
      discount_value: discountValue,
      min_order: minOrder = 0,
      max_discount: maxDiscount = null,
      expires_at: expiresAt = null,
      usage_limit: usageLimit = null,
      is_active: isActive = true,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || discountValue === null) {
      return ApiResponse.error(res, 'code, discount_type and discount_value are required', 400);
    }

    if (!['flat', 'percent'].includes(discountType)) {
      return ApiResponse.error(res, 'discount_type must be flat or percent', 400);
    }

    const couponCode = String(code).trim().toUpperCase();

    const [coupon] = await db('coupons')
      .insert({
        code: couponCode,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order: Number(minOrder || 0),
        max_discount: maxDiscount !== null ? Number(maxDiscount) : null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
        usage_limit: usageLimit !== null ? Number(usageLimit) : null,
        used_count: 0,
        is_active: Boolean(isActive),
      })
      .returning('*');

    return ApiResponse.success(res, coupon, 201);
  } catch (error) {
    return next(error);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await db('coupons')
      .select('*')
      .select(
        db.raw(
          `CASE
            WHEN usage_limit IS NULL OR usage_limit = 0 THEN NULL
            ELSE ROUND((used_count::decimal / usage_limit::decimal) * 100, 2)
          END AS usage_percent`
        )
      )
      .orderBy('created_at', 'desc');

    return ApiResponse.success(res, coupons);
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      return ApiResponse.error(
        res,
        `status must be one of: ${VALID_ORDER_STATUSES.join(', ')}`,
        400
      );
    }

    const [order] = await db('orders')
      .where({ id })
      .update(
        {
          status,
          updated_at: db.fn.now(),
        },
        '*'
      );

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    return ApiResponse.success(res, order);
  } catch (error) {
    return next(error);
  }
};

const getAllServicesAdmin = async (req, res, next) => {
  try {
    const serviceItems = await db('service_items as si')
      .join('services as s', 's.id', 'si.service_id')
      .select(
        'si.id',
        'si.name',
        'si.price',
        'si.unit',
        'si.is_active',
        'si.service_id',
        's.name as service_name'
      )
      .orderBy('s.display_order', 'asc')
      .orderBy('si.display_order', 'asc');

    return ApiResponse.success(res, serviceItems);
  } catch (error) {
    return next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount_type: discountType,
      discount_value: discountValue,
      min_order: minOrder,
      max_discount: maxDiscount,
      expires_at: expiresAt,
      usage_limit: usageLimit,
      is_active: isActive,
    } = req.body;

    const updatePayload = {};

    if (code !== undefined) {
      updatePayload.code = String(code).trim().toUpperCase();
    }

    if (discountType !== undefined) {
      if (!['flat', 'percent'].includes(discountType)) {
        return ApiResponse.error(res, 'discount_type must be flat or percent', 400);
      }
      updatePayload.discount_type = discountType;
    }

    if (discountValue !== undefined) {
      updatePayload.discount_value = Number(discountValue);
    }

    if (minOrder !== undefined) {
      updatePayload.min_order = Number(minOrder);
    }

    if (maxDiscount !== undefined) {
      updatePayload.max_discount = maxDiscount === null ? null : Number(maxDiscount);
    }

    if (expiresAt !== undefined) {
      updatePayload.expires_at = expiresAt ? new Date(expiresAt) : null;
    }

    if (usageLimit !== undefined) {
      updatePayload.usage_limit = usageLimit === null ? null : Number(usageLimit);
    }

    if (isActive !== undefined) {
      updatePayload.is_active = Boolean(isActive);
    }

    if (Object.keys(updatePayload).length === 0) {
      return ApiResponse.error(
        res,
        'At least one updatable field is required',
        400
      );
    }

    updatePayload.updated_at = db.fn.now();

    const [coupon] = await db('coupons')
      .where({ id })
      .update(updatePayload, '*');

    if (!coupon) {
      return ApiResponse.error(res, 'Coupon not found', 404);
    }

    return ApiResponse.success(res, coupon);
  } catch (error) {
    return next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCount = await db('coupons').where({ id }).del();

    if (!deletedCount) {
      return ApiResponse.error(res, 'Coupon not found', 404);
    }

    return res.json({
      success: true,
      message: 'Coupon deleted',
    });
  } catch (error) {
    return next(error);
  }
};

const updateServicePricing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (price === undefined || price === null || Number(price) < 0) {
      return ApiResponse.error(res, 'Valid price is required', 400);
    }

    const [updatedItem] = await db('service_items')
      .where({ id })
      .update(
        {
          price: Number(price),
        },
        '*'
      );

    if (!updatedItem) {
      return ApiResponse.error(res, 'Service item not found', 404);
    }

    return ApiResponse.success(res, updatedItem);
  } catch (error) {
    return next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const [revenueRows, orderRows] = await Promise.all([
      db('orders')
        .select(db.raw('DATE(created_at) as day'))
        .sum('total as revenue')
        .where('created_at', '>=', startDate)
        .andWhere('payment_status', 'paid')
        .groupByRaw('DATE(created_at)'),
      db('orders')
        .select(db.raw('DATE(created_at) as day'))
        .count('* as orders')
        .where('created_at', '>=', startDate)
        .groupByRaw('DATE(created_at)'),
    ]);

    const revenueMap = revenueRows.reduce((acc, row) => {
      acc[String(row.day)] = Number(row.revenue || 0);
      return acc;
    }, {});

    const orderMap = orderRows.reduce((acc, row) => {
      acc[String(row.day)] = Number(row.orders || 0);
      return acc;
    }, {});

    const labels = [];
    const revenue = [];
    const orders = [];

    for (let i = 0; i < 7; i += 1) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dayKey = day.toISOString().slice(0, 10);
      const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' });

      labels.push(dayLabel);
      revenue.push(revenueMap[dayKey] || 0);
      orders.push(orderMap[dayKey] || 0);
    }

    return ApiResponse.success(res, {
      labels,
      revenue,
      orders,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  getOrderDetail,
  assignAgent,
  getAllAgents,
  createAgent,
  suspendAgent,
  getAllCustomers,
  getAllPartners,
  createCoupon,
  getAllCoupons,
  updateOrderStatus,
  getAllServicesAdmin,
  updateCoupon,
  deleteCoupon,
  updateServicePricing,
  getAnalytics,
};
