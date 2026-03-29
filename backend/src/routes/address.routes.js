const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefault,
} = require('../controllers/address.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAddresses);
router.post('/', createAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefault);

module.exports = router;
