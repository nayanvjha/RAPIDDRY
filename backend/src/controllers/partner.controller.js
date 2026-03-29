const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const { sendPushNotification } = require('../services/notification.service');

const PARTNER_STATUS_FLOW = ['received', 'processing', 'ready'];

const getPartnerByUserId = async (userId) => {
  return db('partners').where({ user_id: userId }).first();
};

const getCurrentPartnerStage = (orderStatus) => {
  if (orderStatus === 'ready') {
    return 'ready';
  }

  if (orderStatus === 'processing') {
    return 'processing';
  }

  return 'received';
};

const notifyAdmins = async (title, body, data = {}) => {
  const admins = await db('users').select('id').where({ role: 'admin', is_active: true });

  for (const adminUser of admins) {
    await sendPushNotification(adminUser.id, title, body, data);
  }
};

const getPartnerOrders = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const statusFilter = req.query.status;

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const ordersQuery = db('orders as o')
      .leftJoin('users as u', 'u.id', 'o.customer_id')
      .leftJoin('addresses as a', 'a.id', 'o.address_id')
      .select(
        'o.id',
        'o.order_number',
        'o.status',
        'o.pickup_date',
        'o.pickup_slot',
        'o.total',
        'o.created_at',
        'u.name as customer_name',
        'u.phone as customer_phone',
        'a.full_address',
        'a.landmark'
      )
      .where('o.partner_id', partner.id)
      .orderBy('o.created_at', 'desc');

    if (statusFilter) {
      ordersQuery.andWhere('o.status', statusFilter);
    }

    const orders = await ordersQuery;

    if (orders.length === 0) {
      return ApiResponse.success(res, []);
    }

    const orderIds = orders.map((order) => order.id);

    const items = await db('order_items as oi')
      .leftJoin('service_items as si', 'si.id', 'oi.service_item_id')
      .select(
        'oi.id',
        'oi.order_id',
        'oi.quantity',
        'oi.is_processed',
        'oi.processing_status',
        'si.name as item_name'
      )
      .whereIn('oi.order_id', orderIds)
      .orderBy('oi.id', 'asc');

    const itemsByOrderId = items.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }

      acc[item.order_id].push(item);
      return acc;
    }, {});

    const response = orders.map((order) => ({
      ...order,
      items: itemsByOrderId[order.id] || [],
      item_count: (itemsByOrderId[order.id] || []).length,
    }));

    return ApiResponse.success(res, response);
  } catch (error) {
    return next(error);
  }
};

const getPartnerOrderDetail = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const order = await db('orders as o')
      .leftJoin('users as u', 'u.id', 'o.customer_id')
      .leftJoin('addresses as a', 'a.id', 'o.address_id')
      .select(
        'o.*',
        'u.name as customer_name',
        'u.phone as customer_phone',
        'a.full_address',
        'a.landmark'
      )
      .where({ 'o.id': id, 'o.partner_id': partner.id })
      .first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const items = await db('order_items as oi')
      .leftJoin('service_items as si', 'si.id', 'oi.service_item_id')
      .select(
        'oi.id',
        'oi.order_id',
        'oi.service_item_id',
        'si.name as item_name',
        'oi.quantity',
        'oi.unit_price',
        'oi.total_price',
        'oi.is_processed',
        'oi.processing_status',
        'oi.damage_notes',
        'oi.damage_photo_url'
      )
      .where('oi.order_id', order.id)
      .orderBy('oi.id', 'asc');

    return ApiResponse.success(res, {
      ...order,
      items,
    });
  } catch (error) {
    return next(error);
  }
};

const updatePartnerOrderStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!PARTNER_STATUS_FLOW.includes(status)) {
      return ApiResponse.error(res, 'Invalid status. Allowed: received, processing, ready', 400);
    }

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const order = await db('orders').where({ id, partner_id: partner.id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const currentStage = getCurrentPartnerStage(order.status);
    const currentIndex = PARTNER_STATUS_FLOW.indexOf(currentStage);
    const requestedIndex = PARTNER_STATUS_FLOW.indexOf(status);

    if (requestedIndex < currentIndex || requestedIndex > currentIndex + 1) {
      return ApiResponse.error(res, 'Invalid partner status transition', 400);
    }

    const nextOrderStatus = status === 'ready' ? 'ready' : 'processing';

    const [updatedOrder] = await db('orders')
      .where({ id: order.id })
      .update(
        {
          status: nextOrderStatus,
          updated_at: db.fn.now(),
        },
        '*'
      );

    if (status === 'ready') {
      await notifyAdmins(
        'Order Ready For Dispatch',
        `Partner marked order ${updatedOrder.order_number} as ready`,
        {
          order_id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          status: updatedOrder.status,
        }
      );
    }

    return ApiResponse.success(res, updatedOrder);
  } catch (error) {
    return next(error);
  }
};

const updateItemStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id, itemId } = req.params;

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const order = await db('orders').where({ id, partner_id: partner.id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const item = await db('order_items').where({ id: itemId, order_id: id }).first();

    if (!item) {
      return ApiResponse.error(res, 'Order item not found', 404);
    }

    const [updatedItem] = await db('order_items')
      .where({ id: item.id })
      .update(
        {
          is_processed: true,
          processing_status: 'processed',
        },
        '*'
      );

    return ApiResponse.success(res, updatedItem);
  } catch (error) {
    return next(error);
  }
};

const flagDamagedItem = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { order_item_id: orderItemId, notes, photo_url: photoUrl } = req.body;

    if (!orderItemId || !notes) {
      return ApiResponse.error(res, 'order_item_id and notes are required', 400);
    }

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const order = await db('orders').where({ id, partner_id: partner.id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const item = await db('order_items').where({ id: orderItemId, order_id: order.id }).first();

    if (!item) {
      return ApiResponse.error(res, 'Order item not found', 404);
    }

    await db('order_items').where({ id: item.id }).update({
      damage_notes: notes,
      damage_photo_url: photoUrl || null,
      processing_status: 'damaged',
      is_processed: false,
    });

    await notifyAdmins(
      'Damaged Item Flagged',
      `Partner flagged damaged item for order ${order.order_number}`,
      {
        order_id: order.id,
        order_number: order.order_number,
        order_item_id: item.id,
      }
    );

    return ApiResponse.success(res, {
      success: true,
      message: 'Damaged item flagged successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getPartnerStats = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const partner = await getPartnerByUserId(userId);

    if (!partner) {
      return ApiResponse.error(res, 'Partner profile not found', 404);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const orders = await db('orders')
      .where({ partner_id: partner.id })
      .andWhere('created_at', '>=', todayStart)
      .select('status');

    const stats = {
      pending: 0,
      processing: 0,
      ready: 0,
    };

    for (const order of orders) {
      if (order.status === 'processing') {
        stats.processing += 1;
      } else if (order.status === 'ready') {
        stats.ready += 1;
      } else {
        stats.pending += 1;
      }
    }

    return ApiResponse.success(res, stats);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPartnerOrders,
  getPartnerOrderDetail,
  updatePartnerOrderStatus,
  updateItemStatus,
  flagDamagedItem,
  getPartnerStats,
};
