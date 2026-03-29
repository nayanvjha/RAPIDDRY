const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');
const {
  getPartnerOrders,
  getPartnerOrderDetail,
  updatePartnerOrderStatus,
  updateItemStatus,
  flagDamagedItem,
  getPartnerStats,
} = require('../controllers/partner.controller');

const router = express.Router();

router.use(authMiddleware, roleGuard('partner', 'admin'));

router.get('/orders', getPartnerOrders);
router.get('/orders/:id', getPartnerOrderDetail);
router.patch('/orders/:id/status', updatePartnerOrderStatus);
router.patch('/orders/:id/items/:itemId', updateItemStatus);
router.post('/orders/:id/flag', flagDamagedItem);
router.get('/stats', getPartnerStats);

module.exports = router;
