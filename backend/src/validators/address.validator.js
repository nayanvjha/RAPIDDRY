const Joi = require('joi');

const createAddressSchema = Joi.object({
  label: Joi.string().valid('home', 'work', 'other').required(),
  full_address: Joi.string().trim().required(),
  landmark: Joi.string().trim().optional().allow(null, ''),
  lat: Joi.number().optional().allow(null),
  lng: Joi.number().optional().allow(null),
  is_default: Joi.boolean().optional(),
});

const updateAddressSchema = Joi.object({
  label: Joi.string().valid('home', 'work', 'other').optional(),
  full_address: Joi.string().trim().optional(),
  landmark: Joi.string().trim().optional().allow(null, ''),
  lat: Joi.number().optional().allow(null),
  lng: Joi.number().optional().allow(null),
  is_default: Joi.boolean().optional(),
});

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
