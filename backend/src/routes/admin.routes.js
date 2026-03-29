const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');
const {
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
  updateServicePricing,
  getAnalytics,
} = require('../controllers/admin.controller');

const router = express.Router();

router.use(authMiddleware, roleGuard('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetail);
router.patch('/orders/:id/assign', assignAgent);
router.get('/agents', getAllAgents);
router.post('/agents', createAgent);
router.patch('/agents/:id/suspend', suspendAgent);
router.get('/customers', getAllCustomers);
router.get('/partners', getAllPartners);
router.post('/coupons', createCoupon);
router.get('/coupons', getAllCoupons);
router.put('/services/:id', updateServicePricing);
router.get('/analytics', getAnalytics);

module.exports = router;
