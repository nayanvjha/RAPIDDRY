const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

/*
Registered API Routes (prefix: /api/v1)

Health
- GET /health
- GET /health/db

Services
- GET /services
- GET /services/:id/items

Auth
- POST /auth/verify-token
- GET /auth/me
- PATCH /auth/me

Addresses
- GET /addresses
- POST /addresses
- PATCH /addresses/:id
- DELETE /addresses/:id
- PATCH /addresses/:id/default

Orders
- POST /orders
- GET /orders
- GET /orders/:id
- PATCH /orders/:id/status
- POST /orders/:id/cancel

Coupons
- POST /coupons/validate

Payments
- POST /payments/create-order
- POST /payments/verify
- POST /payments/webhook

Notifications
- GET /notifications
- PATCH /notifications/:id/read
- POST /notifications/register-token

Agent
- PATCH /agent/availability
- PATCH /agent/location
- GET /agent/orders
- PATCH /agent/orders/:id/accept
- PATCH /agent/orders/:id/status
- POST /agent/orders/:id/verify-items
- GET /agent/earnings

Partner
- GET /partner/orders
- GET /partner/orders/:id
- PATCH /partner/orders/:id/status
- PATCH /partner/orders/:id/items/:itemId
- POST /partner/orders/:id/flag
- GET /partner/stats

Admin
- GET /admin/dashboard
- GET /admin/orders
- GET /admin/orders/:id
- PATCH /admin/orders/:id/assign
- GET /admin/agents
- POST /admin/agents
- PATCH /admin/agents/:id/suspend
- GET /admin/customers
- GET /admin/partners
- POST /admin/coupons
- GET /admin/coupons
- PUT /admin/services/:id
- GET /admin/analytics
*/

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const healthRoutes = require('./routes/health.routes');
const serviceRoutes = require('./routes/service.routes');
const authRoutes = require('./routes/auth.routes');
const addressRoutes = require('./routes/address.routes');
const orderRoutes = require('./routes/order.routes');
const couponRoutes = require('./routes/coupon.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const agentRoutes = require('./routes/agent.routes');
const partnerRoutes = require('./routes/partner.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api/v1';
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.PARTNER_URL,
].filter(Boolean);
const ALLOW_ALL_ORIGINS =
  process.env.NODE_ENV === 'staging' || process.env.CORS_ALLOW_ALL === 'true';

app.use(
  cors({
    origin: ALLOW_ALL_ORIGINS ? '*' : ALLOWED_ORIGINS,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/services`, serviceRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/addresses`, addressRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/coupons`, couponRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/agent`, agentRoutes);
app.use(`${API_PREFIX}/partner`, partnerRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Rapidry API running on port ${PORT}`);
});

module.exports = app;
