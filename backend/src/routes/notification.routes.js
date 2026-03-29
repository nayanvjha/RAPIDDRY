const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
  getNotifications,
  markAsRead,
  registerFcmToken,
} = require('../controllers/notification.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.post('/register-token', registerFcmToken);

module.exports = router;
