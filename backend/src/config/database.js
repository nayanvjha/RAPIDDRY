const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
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
