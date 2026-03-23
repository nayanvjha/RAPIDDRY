const express = require('express');

const { testDatabaseConnection } = require('../config/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/db', async (req, res) => {
  try {
    await testDatabaseConnection();
    res.json({ status: 'connected' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
