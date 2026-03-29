const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');
const {
  toggleAvailability,
  updateLocation,
  getAssignedOrders,
  acceptDelivery,
  updateDeliveryStatus,
  verifyItems,
  getEarnings,
} = require('../controllers/agent.controller');

const router = express.Router();

router.use(authMiddleware, roleGuard('agent', 'admin'));

router.patch('/availability', toggleAvailability);
router.patch('/location', updateLocation);
router.get('/orders', getAssignedOrders);
router.patch('/orders/:id/accept', acceptDelivery);
router.patch('/orders/:id/status', updateDeliveryStatus);
router.post('/orders/:id/verify-items', verifyItems);
router.get('/earnings', getEarnings);

module.exports = router;
