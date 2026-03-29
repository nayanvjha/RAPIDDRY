const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const { createOrderSchema } = require('../validators/order.validator');
const { computeCouponDiscount, getInvalidCouponReason } = require('./coupon.controller');
const { sendPushNotification, ORDER_STATUS_MESSAGES } = require('../services/notification.service');

const DELIVERY_FEE = 30;
const ORDER_STATUS_FLOW = [
  'placed',
  'agent_assigned',
  'picked_up',
  'processing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const ORDER_STATUS_RANK = ORDER_STATUS_FLOW.reduce((acc, status, index) => {
  acc[status] = index;
  return acc;
}, {});

const toMoney = (value) => Number(Number(value).toFixed(2));

const getNextOrderNumber = async (trx) => {
  const lastOrder = await trx('orders').select('order_number').orderBy('created_at', 'desc').first();

  if (!lastOrder?.order_number) {
    return 'RD-1001';
  }

  const parts = String(lastOrder.order_number).split('-');
  const lastNumber = Number(parts[1] || 1000);
  const nextNumber = Number.isNaN(lastNumber) ? 1001 : lastNumber + 1;

  return `RD-${String(nextNumber).padStart(4, '0')}`;
};

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { error, value } = createOrderSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return ApiResponse.error(res, error.details[0].message, 400);
    }

    const address = await db('addresses')
      .where({ id: value.address_id, user_id: userId })
      .first();

    if (!address) {
      return ApiResponse.error(res, 'Address not found', 404);
    }

    const serviceItemIds = value.items.map((item) => item.service_item_id);
    const serviceItems = await db('service_items').whereIn('id', serviceItemIds);
    const serviceItemMap = serviceItems.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const orderItemsToInsert = [];
    let subtotal = 0;

    for (const item of value.items) {
      const serviceItem = serviceItemMap[item.service_item_id];

      if (!serviceItem) {
        return ApiResponse.error(res, `Service item not found: ${item.service_item_id}`, 404);
      }

      const unitPrice = toMoney(serviceItem.price);
      const totalPrice = toMoney(unitPrice * item.quantity);

      subtotal += totalPrice;

      orderItemsToInsert.push({
        service_item_id: item.service_item_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      });
    }

    subtotal = toMoney(subtotal);

    let appliedCoupon = null;
    let discount = 0;

    if (value.coupon_code) {
      const coupon = await db('coupons')
        .whereRaw('LOWER(code) = ?', [value.coupon_code.toLowerCase()])
        .first();

      const reason = getInvalidCouponReason(coupon, subtotal);

      if (reason) {
        return ApiResponse.error(res, reason, 400);
      }

      appliedCoupon = coupon;
      discount = computeCouponDiscount(coupon, subtotal);
    }

    const deliveryFee = DELIVERY_FEE;
    const total = toMoney(subtotal + deliveryFee - discount);

    const createdOrderData = await db.transaction(async (trx) => {
      const orderNumber = await getNextOrderNumber(trx);

      const [order] = await trx('orders')
        .insert({
          order_number: orderNumber,
          customer_id: userId,
          address_id: value.address_id,
          total,
          delivery_fee: deliveryFee,
          discount,
          payment_method: value.payment_method,
          payment_status: 'pending',
          pickup_date: value.pickup_date,
          pickup_slot: value.pickup_slot,
          special_instructions: value.special_instructions || null,
        })
        .returning('*');

      const itemsPayload = orderItemsToInsert.map((item) => ({
        order_id: order.id,
        ...item,
      }));

      const insertedItems = await trx('order_items').insert(itemsPayload).returning('*');

      if (appliedCoupon) {
        await trx('coupons').where({ id: appliedCoupon.id }).increment('used_count', 1);
      }

      return {
        order,
        items: insertedItems,
      };
    });

    return ApiResponse.success(
      res,
      {
        ...createdOrderData.order,
        items: createdOrderData.items,
      },
      201
    );
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const orders = await db('orders as o')
      .select('o.*')
      .select(
        db('order_items')
          .count('*')
          .whereRaw('order_items.order_id = o.id')
          .as('item_count')
      )
      .where('o.customer_id', userId)
      .orderBy('o.created_at', 'desc');

    return ApiResponse.success(res, orders);
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const order = await db('orders').where({ id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    if (order.customer_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    const [address, items] = await Promise.all([
      db('addresses')
        .select('id', 'label', 'full_address', 'landmark', 'lat', 'lng', 'is_default')
        .where({ id: order.address_id })
        .first(),
      db('order_items as oi')
        .leftJoin('service_items as si', 'si.id', 'oi.service_item_id')
        .select(
          'oi.id',
          'oi.order_id',
          'oi.service_item_id',
          'oi.quantity',
          'oi.unit_price',
          'oi.total_price',
          'si.name as service_item_name',
          'si.price as service_item_current_price'
        )
        .where('oi.order_id', order.id)
        .orderBy('oi.id', 'asc'),
    ]);

    return ApiResponse.success(res, {
      ...order,
      address,
      items,
    });
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUS_FLOW.includes(status)) {
      return ApiResponse.error(res, 'Invalid status value', 400);
    }

    const order = await db('orders').where({ id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const currentRank = ORDER_STATUS_RANK[order.status];
    const nextRank = ORDER_STATUS_RANK[status];

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return ApiResponse.error(res, `Cannot change status from ${order.status}`, 400);
    }

    if (nextRank < currentRank) {
      return ApiResponse.error(res, 'Invalid status transition', 400);
    }

    const [updatedOrder] = await db('orders')
      .where({ id })
      .update(
        {
          status,
          updated_at: db.fn.now(),
        },
        '*'
      );

    const messageTemplate = ORDER_STATUS_MESSAGES[status];

    if (messageTemplate) {
      await sendPushNotification(
        updatedOrder.customer_id,
        messageTemplate.title,
        messageTemplate.body.replace('{order_number}', updatedOrder.order_number),
        {
          order_id: updatedOrder.id,
          status,
          order_number: updatedOrder.order_number,
        }
      );
    }

    return ApiResponse.success(res, updatedOrder);
  } catch (error) {
    return next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const order = await db('orders').where({ id }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    if (order.customer_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    if (order.status !== 'placed') {
      return ApiResponse.error(res, 'Order can only be cancelled before pickup', 400);
    }

    const [updatedOrder] = await db('orders')
      .where({ id })
      .update(
        {
          status: 'cancelled',
          payment_status: order.payment_status === 'paid' ? 'refunded' : order.payment_status,
          updated_at: db.fn.now(),
        },
        '*'
      );

    if (order.payment_status === 'paid') {
      await db('payments')
        .where({ order_id: id })
        .update({
          status: 'refunded',
          updated_at: db.fn.now(),
        });
    }

    const messageTemplate = ORDER_STATUS_MESSAGES.cancelled;
    await sendPushNotification(
      updatedOrder.customer_id,
      messageTemplate.title,
      messageTemplate.body.replace('{order_number}', updatedOrder.order_number),
      {
        order_id: updatedOrder.id,
        status: 'cancelled',
        order_number: updatedOrder.order_number,
      }
    );

    return ApiResponse.success(res, updatedOrder);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
