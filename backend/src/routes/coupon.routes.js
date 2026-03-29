const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCoupon } = require('../controllers/coupon.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/validate', validateCoupon);

module.exports = router;
