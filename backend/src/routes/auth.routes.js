const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
	verifyToken,
	getMe,
	updateProfile,
	adminLogin,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/verify-token', verifyToken);
router.post('/admin-login', adminLogin);
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateProfile);

module.exports = router;
