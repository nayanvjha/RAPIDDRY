const crypto = require('crypto');
const { db } = require('../config/database');
const razorpay = require('../config/razorpay');
const ApiResponse = require('../utils/ApiResponse');

const getWebhookSecret = () => process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpay || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return ApiResponse.error(res, 'Razorpay is not configured', 500);
    }

    const userId = req.user?.userId;
    const { order_id: orderId } = req.body;

    if (!orderId) {
      return ApiResponse.error(res, 'order_id is required', 400);
    }

    const order = await db('orders').where({ id: orderId }).first();

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    if (order.customer_id !== userId) {
      return ApiResponse.error(res, 'Forbidden', 403);
    }

    if (order.payment_status !== 'pending') {
      return ApiResponse.error(res, 'Order payment is already processed', 400);
    }

    const amountInPaise = Math.round(Number(order.total) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.order_number,
    });

    await db('payments').insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: Number(order.total),
      currency: 'INR',
      status: 'created',
      method: order.payment_method,
    });

    return ApiResponse.success(res, {
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return ApiResponse.error(res, 'Razorpay is not configured', 500);
    }

    const { razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return ApiResponse.error(
        res,
        'razorpay_order_id, razorpay_payment_id and razorpay_signature are required',
        400
      );
    }

    const payment = await db('payments')
      .where({ razorpay_order_id: razorpayOrderId })
      .orderBy('created_at', 'desc')
      .first();

    if (!payment) {
      return ApiResponse.error(res, 'Payment record not found', 404);
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await db('payments').where({ id: payment.id }).update({
        status: 'failed',
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        updated_at: db.fn.now(),
      });

      return ApiResponse.error(res, 'Invalid payment signature', 400);
    }

    await db.transaction(async (trx) => {
      await trx('payments').where({ id: payment.id }).update({
        status: 'captured',
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        updated_at: trx.fn.now(),
      });

      await trx('orders').where({ id: payment.order_id }).update({
        payment_status: 'paid',
        updated_at: trx.fn.now(),
      });
    });

    return ApiResponse.success(res, {
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = getWebhookSecret();

    if (!signature || !webhookSecret) {
      return res.status(200).json({ status: 'ok' });
    }

    const payload = req.rawBody || JSON.stringify(req.body);

    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

    if (expectedSignature !== signature) {
      return res.status(200).json({ status: 'ok' });
    }

    const event = req.body;
    const eventType = event?.event;
    const paymentEntity = event?.payload?.payment?.entity;

    if (!paymentEntity?.order_id) {
      return res.status(200).json({ status: 'ok' });
    }

    const payment = await db('payments')
      .where({ razorpay_order_id: paymentEntity.order_id })
      .orderBy('created_at', 'desc')
      .first();

    if (!payment) {
      return res.status(200).json({ status: 'ok' });
    }

    if (eventType === 'payment.captured') {
      await db.transaction(async (trx) => {
        await trx('payments').where({ id: payment.id }).update({
          status: 'captured',
          razorpay_payment_id: paymentEntity.id || payment.razorpay_payment_id,
          method: paymentEntity.method || payment.method,
          updated_at: trx.fn.now(),
        });

        await trx('orders').where({ id: payment.order_id }).update({
          payment_status: 'paid',
          updated_at: trx.fn.now(),
        });
      });
    }

    if (eventType === 'payment.failed') {
      await db.transaction(async (trx) => {
        await trx('payments').where({ id: payment.id }).update({
          status: 'failed',
          razorpay_payment_id: paymentEntity.id || payment.razorpay_payment_id,
          method: paymentEntity.method || payment.method,
          updated_at: trx.fn.now(),
        });

        await trx('orders').where({ id: payment.order_id }).update({
          payment_status: 'failed',
          updated_at: trx.fn.now(),
        });
      });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(200).json({ status: 'ok' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
};
