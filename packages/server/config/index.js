const { logger } = require('./logger');

const PORT = 3001;

const config = {
  port: PORT,
  logger,
}

module.exports = config;
