const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');

const getAllServices = async (req, res, next) => {
  try {
    const services = await db('services')
      .where({ is_active: true })
      .orderBy('display_order', 'asc');

    return ApiResponse.success(res, services);
  } catch (error) {
    return next(error);
  }
};

const getServiceItems = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await db('services')
      .select('id', 'name')
      .where({ id })
      .first();

    if (!service) {
      return ApiResponse.error(res, 'Service not found', 404);
    }

    const items = await db('service_items')
      .where({ service_id: id, is_active: true })
      .orderBy('display_order', 'asc');

    return ApiResponse.success(res, {
      service,
      items,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceItems,
};
