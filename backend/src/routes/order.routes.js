const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createOrder,
	getOrders,
	getOrderById,
	updateOrderStatus,
	cancelOrder,
} = require('../controllers/order.controller');

const router = express.Router();

router.patch('/:id/status', updateOrderStatus);

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

module.exports = router;
