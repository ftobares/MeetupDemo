const { Pool } = require('pg')
const logger = require('@config/logger.config');

logger.info('Creating PostgresSQL Pool Instance')
const poolDB = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'agregarPassword',
  port: 5432,
  max: 20
})

module.exports = poolDB;