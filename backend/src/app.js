require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const healthRoutes = require('./routes/health.routes');
const serviceRoutes = require('./routes/service.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api/v1';

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/services`, serviceRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Rapidry API running on port ${PORT}`);
});

module.exports = app;
