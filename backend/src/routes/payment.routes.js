const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
} = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-order', authMiddleware, createRazorpayOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
