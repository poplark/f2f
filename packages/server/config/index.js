const { logger } = require('./logger');

const PORT = 3001;

const jwtConfig = {
  maxAge: 24 * 60 * 60, // second
  keys: {
    private: 'wh0areyou',
  }
}

const config = {
  port: PORT,
  logger,
  jwtConfig,
}

module.exports = config;
