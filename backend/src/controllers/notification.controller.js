const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [notifications, [{ count }]] = await Promise.all([
      db('notifications')
        .where({ user_id: userId })
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('notifications').where({ user_id: userId }).count('*'),
    ]);

    return ApiResponse.success(res, {
      page,
      limit,
      total: Number(count || 0),
      notifications,
    });
  } catch (error) {
    return next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const notification = await db('notifications')
      .where({ id, user_id: userId })
      .first();

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404);
    }

    const [updatedNotification] = await db('notifications')
      .where({ id })
      .update({ is_read: true }, '*');

    return ApiResponse.success(res, updatedNotification);
  } catch (error) {
    return next(error);
  }
};

const registerFcmToken = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { fcm_token: fcmToken } = req.body;

    if (!fcmToken) {
      return ApiResponse.error(res, 'fcm_token is required', 400);
    }

    const [updatedUser] = await db('users')
      .where({ id: userId })
      .update(
        {
          fcm_token: fcmToken,
          updated_at: db.fn.now(),
        },
        ['id', 'fcm_token']
      );

    return ApiResponse.success(res, updatedUser);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  registerFcmToken,
};
