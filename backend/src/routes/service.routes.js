const express = require('express');
const {
	getAllServices,
	getServiceItems,
} = require('../controllers/service.controller');

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id/items', getServiceItems);

module.exports = router;
