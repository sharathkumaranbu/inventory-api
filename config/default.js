/*
 * Default configuration file
 */

module.exports = {
  HOST: process.env.HOST || 'http://localhost:3535',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3535,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/inventory'
}
