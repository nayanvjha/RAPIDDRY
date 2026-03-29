const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const { sendPushNotification, ORDER_STATUS_MESSAGES } = require('../services/notification.service');

const DELIVERY_EARNING = 45;
const DELIVERY_UPDATE_ALLOWED = ['arrived', 'completed'];

const getAgentByUserId = async (userId) => {
  return db('agents').where({ user_id: userId }).first();
};

const toggleAvailability = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { is_online: isOnline } = req.body;

    if (typeof isOnline !== 'boolean') {
      return ApiResponse.error(res, 'is_online must be a boolean', 400);
    }

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const [updatedAgent] = await db('agents')
      .where({ id: agent.id })
      .update(
        {
          is_online: isOnline,
          updated_at: db.fn.now(),
        },
        '*'
      );

    return ApiResponse.success(res, updatedAgent);
  } catch (error) {
    return next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return ApiResponse.error(res, 'lat and lng are required', 400);
    }

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    await db('agents').where({ id: agent.id }).update({
      current_lat: lat,
      current_lng: lng,
      updated_at: db.fn.now(),
    });

    return ApiResponse.success(res, {
      success: true,
      message: 'Location updated',
    });
  } catch (error) {
    return next(error);
  }
};

const getAssignedOrders = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const deliveries = await db('deliveries as d')
      .leftJoin('orders as o', 'o.id', 'd.order_id')
      .leftJoin('users as u', 'u.id', 'o.customer_id')
      .leftJoin('addresses as a', 'a.id', 'o.address_id')
      .leftJoin('order_items as oi', 'oi.order_id', 'o.id')
      .select(
        'd.id as delivery_id',
        'd.order_id',
        'd.type as delivery_type',
        'd.status as delivery_status',
        'd.started_at',
        'o.order_number',
        'o.status as order_status',
        'o.total',
        'u.name as customer_name',
        'u.phone as customer_phone',
        'a.full_address',
        'a.landmark'
      )
      .count('oi.id as items_count')
      .where('d.agent_id', agent.id)
      .whereNot('d.status', 'completed')
      .groupBy(
        'd.id',
        'o.id',
        'u.id',
        'a.id'
      )
      .orderBy('d.created_at', 'desc');

    return ApiResponse.success(res, deliveries);
  } catch (error) {
    return next(error);
  }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const delivery = await db('deliveries').where({ id }).first();

    if (!delivery) {
      return ApiResponse.error(res, 'Delivery not found', 404);
    }

    if (delivery.agent_id !== agent.id) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    const [updatedDelivery] = await db('deliveries')
      .where({ id })
      .update(
        {
          status: 'accepted',
          started_at: db.fn.now(),
        },
        '*'
      );

    const orderStatus = delivery.type === 'pickup' ? 'agent_assigned' : 'out_for_delivery';

    const [updatedOrder] = await db('orders')
      .where({ id: delivery.order_id })
      .update(
        {
          status: orderStatus,
          updated_at: db.fn.now(),
        },
        '*'
      );

    const messageTemplate = ORDER_STATUS_MESSAGES[orderStatus];

    if (messageTemplate) {
      await sendPushNotification(
        updatedOrder.customer_id,
        messageTemplate.title,
        messageTemplate.body.replace('{order_number}', updatedOrder.order_number),
        {
          order_id: updatedOrder.id,
          status: orderStatus,
          order_number: updatedOrder.order_number,
        }
      );
    }

    return ApiResponse.success(res, updatedDelivery);
  } catch (error) {
    return next(error);
  }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!DELIVERY_UPDATE_ALLOWED.includes(status)) {
      return ApiResponse.error(res, 'Invalid delivery status. Allowed: arrived, completed', 400);
    }

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const delivery = await db('deliveries').where({ id }).first();

    if (!delivery) {
      return ApiResponse.error(res, 'Delivery not found', 404);
    }

    if (delivery.agent_id !== agent.id) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    const updates = {
      status,
    };

    if (status === 'completed') {
      updates.completed_at = db.fn.now();
    }

    const [updatedDelivery] = await db('deliveries').where({ id }).update(updates, '*');

    if (status === 'completed' && delivery.type === 'pickup') {
      const [updatedOrder] = await db('orders')
        .where({ id: delivery.order_id })
        .update(
          {
            status: 'picked_up',
            updated_at: db.fn.now(),
          },
          '*'
        );

      const messageTemplate = ORDER_STATUS_MESSAGES.picked_up;
      await sendPushNotification(
        updatedOrder.customer_id,
        messageTemplate.title,
        messageTemplate.body.replace('{order_number}', updatedOrder.order_number),
        {
          order_id: updatedOrder.id,
          status: 'picked_up',
          order_number: updatedOrder.order_number,
        }
      );
    }

    if (status === 'completed' && delivery.type === 'drop') {
      const [updatedOrder] = await db('orders')
        .where({ id: delivery.order_id })
        .update(
          {
            status: 'delivered',
            updated_at: db.fn.now(),
          },
          '*'
        );

      await db('agents').where({ id: agent.id }).increment('total_deliveries', 1);

      const messageTemplate = ORDER_STATUS_MESSAGES.delivered;
      await sendPushNotification(
        updatedOrder.customer_id,
        messageTemplate.title,
        messageTemplate.body.replace('{order_number}', updatedOrder.order_number),
        {
          order_id: updatedOrder.id,
          status: 'delivered',
          order_number: updatedOrder.order_number,
        }
      );
    }

    return ApiResponse.success(res, updatedDelivery);
  } catch (error) {
    return next(error);
  }
};

const verifyItems = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { items, photo_url: photoUrl } = req.body;

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const delivery = await db('deliveries').where({ id }).first();

    if (!delivery) {
      return ApiResponse.error(res, 'Delivery not found', 404);
    }

    if (delivery.agent_id !== agent.id) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    console.log('Delivery item verification:', {
      delivery_id: id,
      agent_id: agent.id,
      items: items || [],
      photo_url: photoUrl || null,
      verified_at: new Date().toISOString(),
    });

    return ApiResponse.success(res, {
      success: true,
      message: 'Items verification received',
    });
  } catch (error) {
    return next(error);
  }
};

const getEarnings = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const period = String(req.query.period || 'today').toLowerCase();

    if (!['today', 'week', 'month'].includes(period)) {
      return ApiResponse.error(res, 'Invalid period. Allowed: today, week, month', 400);
    }

    const agent = await getAgentByUserId(userId);

    if (!agent) {
      return ApiResponse.error(res, 'Agent profile not found', 404);
    }

    const now = new Date();
    const startDate = new Date(now);

    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    }

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    }

    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const completedDeliveries = await db('deliveries')
      .where({ agent_id: agent.id, status: 'completed' })
      .andWhere('completed_at', '>=', startDate)
      .select('id', 'completed_at');

    const breakdownRows = await db('deliveries')
      .select(db.raw('DATE(completed_at) as day'))
      .count('* as delivery_count')
      .where({ agent_id: agent.id, status: 'completed' })
      .andWhere('completed_at', '>=', startDate)
      .groupByRaw('DATE(completed_at)')
      .orderBy('day', 'asc');

    const breakdownByDay = breakdownRows.map((row) => {
      const deliveryCount = Number(row.delivery_count || 0);

      return {
        day: row.day,
        delivery_count: deliveryCount,
        earnings: deliveryCount * DELIVERY_EARNING,
      };
    });

    const deliveryCount = completedDeliveries.length;
    const totalEarnings = deliveryCount * DELIVERY_EARNING;

    return ApiResponse.success(res, {
      period,
      total_earnings: totalEarnings,
      delivery_count: deliveryCount,
      breakdown_by_day: breakdownByDay,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  toggleAvailability,
  updateLocation,
  getAssignedOrders,
  acceptDelivery,
  updateDeliveryStatus,
  verifyItems,
  getEarnings,
};
