const { db } = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');

const computeCouponDiscount = (coupon, orderTotal) => {
  const total = Number(orderTotal);

  if (coupon.discount_type === 'percent') {
    let discount = (total * Number(coupon.discount_value)) / 100;

    if (coupon.max_discount !== null && coupon.max_discount !== undefined) {
      discount = Math.min(discount, Number(coupon.max_discount));
    }

    return Number(discount.toFixed(2));
  }

  return Number(Number(coupon.discount_value).toFixed(2));
};

const getInvalidCouponReason = (coupon, orderTotal) => {
  if (!coupon) {
    return 'Coupon not found';
  }

  if (!coupon.is_active) {
    return 'Coupon is inactive';
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return 'Coupon has expired';
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return 'Coupon usage limit reached';
  }

  if (Number(orderTotal) < Number(coupon.min_order || 0)) {
    return 'Minimum order amount not met';
  }

  return null;
};

const validateCoupon = async (req, res, next) => {
  try {
    const { code, order_total: orderTotal } = req.body;

    if (!code || orderTotal === undefined || orderTotal === null) {
      return ApiResponse.error(res, 'code and order_total are required', 400);
    }

    const coupon = await db('coupons')
      .whereRaw('LOWER(code) = ?', [String(code).toLowerCase()])
      .first();

    const reason = getInvalidCouponReason(coupon, orderTotal);

    if (reason) {
      return ApiResponse.success(res, {
        valid: false,
        reason,
      });
    }

    const discountAmount = computeCouponDiscount(coupon, orderTotal);

    return ApiResponse.success(res, {
      valid: true,
      discount_amount: discountAmount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order: coupon.min_order,
        max_discount: coupon.max_discount,
        usage_limit: coupon.usage_limit,
        used_count: coupon.used_count,
        expires_at: coupon.expires_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateCoupon,
  computeCouponDiscount,
  getInvalidCouponReason,
};
