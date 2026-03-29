const knex = require('knex');
const knexConfig = require('../../knexfile');

const nodeEnv = process.env.NODE_ENV || 'development';
const environment = nodeEnv === 'production' || nodeEnv === 'staging' ? 'production' : 'development';
const config = knexConfig[environment];

const db = knex(config);

const testDatabaseConnection = async () => {
  const result = await db.raw('SELECT NOW()');
  return result.rows?.[0] || null;
};

module.exports = {
  db,
  testDatabaseConnection,
};
