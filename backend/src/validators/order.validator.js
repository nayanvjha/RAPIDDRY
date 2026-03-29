const Joi = require('joi');

const orderItemSchema = Joi.object({
  service_item_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const createOrderSchema = Joi.object({
  address_id: Joi.string().uuid().required(),
  pickup_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  pickup_slot: Joi.string().trim().required(),
  special_instructions: Joi.string().trim().optional().allow(null, ''),
  payment_method: Joi.string().valid('upi', 'card', 'cod', 'wallet').required(),
  coupon_code: Joi.string().trim().optional().allow(null, ''),
  items: Joi.array().items(orderItemSchema).min(1).required(),
});

module.exports = {
  createOrderSchema,
};
