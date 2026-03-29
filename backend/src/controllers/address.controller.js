const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const { createAddressSchema, updateAddressSchema } = require('../validators/address.validator');

const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const addresses = await db('addresses')
      .where({ user_id: userId })
      .orderBy('is_default', 'desc')
      .orderBy('created_at', 'desc');

    return ApiResponse.success(res, addresses);
  } catch (error) {
    return next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { error, value } = createAddressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return ApiResponse.error(res, error.details[0].message, 400);
    }

    const createdAddress = await db.transaction(async (trx) => {
      if (value.is_default) {
        await trx('addresses').where({ user_id: userId }).update({
          is_default: false,
          updated_at: trx.fn.now(),
        });
      }

      const [address] = await trx('addresses')
        .insert({
          user_id: userId,
          ...value,
        })
        .returning('*');

      return address;
    });

    return ApiResponse.success(res, createdAddress, 201);
  } catch (error) {
    return next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const { error, value } = updateAddressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return ApiResponse.error(res, error.details[0].message, 400);
    }

    const existingAddress = await db('addresses').where({ id }).first();

    if (!existingAddress) {
      return ApiResponse.error(res, 'Address not found', 404);
    }

    if (existingAddress.user_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    const updatedAddress = await db.transaction(async (trx) => {
      if (value.is_default) {
        await trx('addresses').where({ user_id: userId }).update({
          is_default: false,
          updated_at: trx.fn.now(),
        });
      }

      const [address] = await trx('addresses')
        .where({ id })
        .update(
          {
            ...value,
            updated_at: trx.fn.now(),
          },
          '*'
        );

      return address;
    });

    return ApiResponse.success(res, updatedAddress);
  } catch (error) {
    return next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existingAddress = await db('addresses').where({ id }).first();

    if (!existingAddress) {
      return ApiResponse.error(res, 'Address not found', 404);
    }

    if (existingAddress.user_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    await db('addresses').where({ id }).del();

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const setDefault = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existingAddress = await db('addresses').where({ id }).first();

    if (!existingAddress) {
      return ApiResponse.error(res, 'Address not found', 404);
    }

    if (existingAddress.user_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    const defaultAddress = await db.transaction(async (trx) => {
      await trx('addresses').where({ user_id: userId }).update({
        is_default: false,
        updated_at: trx.fn.now(),
      });

      const [address] = await trx('addresses')
        .where({ id })
        .update(
          {
            is_default: true,
            updated_at: trx.fn.now(),
          },
          '*'
        );

      return address;
    });

    return ApiResponse.success(res, defaultAddress);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefault,
};
