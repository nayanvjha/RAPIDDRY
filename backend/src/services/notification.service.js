const admin = require('../config/firebase');
const { db } = require('../config/database');

const ORDER_STATUS_MESSAGES = {
  placed: {
    title: 'Order Confirmed! 🎉',
    body: 'Your order {order_number} has been placed',
  },
  agent_assigned: {
    title: 'Agent Assigned 🛵',
    body: 'Agent is on the way for pickup',
  },
  picked_up: {
    title: 'Clothes Picked Up 👕',
    body: 'Your clothes have been picked up',
  },
  processing: {
    title: 'Processing 🧺',
    body: 'Your clothes are being cleaned',
  },
  ready: {
    title: 'Almost Done ✨',
    body: 'Your clothes are ready for delivery',
  },
  out_for_delivery: {
    title: 'Out for Delivery 🚀',
    body: 'Your clean clothes are on the way',
  },
  delivered: {
    title: 'Delivered! ✅',
    body: 'Your clothes have been delivered',
  },
  cancelled: {
    title: 'Order Cancelled ❌',
    body: 'Your order has been cancelled',
  },
};

const stringifyData = (data = {}) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = String(value);
    return acc;
  }, {});
};

const sendPushNotification = async (userId, title, body, data = {}) => {
  const user = await db('users').select('id', 'fcm_token').where({ id: userId }).first();

  const orderId = data.order_id || null;

  const [notification] = await db('notifications')
    .insert({
      user_id: userId,
      title,
      body,
      type: 'order_update',
      order_id: orderId,
      is_read: false,
    })
    .returning('*');

  if (user?.fcm_token) {
    try {
      await admin.messaging().send({
        token: user.fcm_token,
        notification: {
          title,
          body,
        },
        data: stringifyData(data),
      });
    } catch (error) {
      console.error('Failed to send FCM push notification:', error.message);
    }
  }

  return notification;
};

module.exports = {
  sendPushNotification,
  ORDER_STATUS_MESSAGES,
};
