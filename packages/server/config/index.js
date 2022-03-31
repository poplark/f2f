const { logger } = require('./logger');

const PORT = 3001;

const jwtConfig = {
  accessToken: {
    // maxAge: 24 * 60 * 60, // second
    maxAge: 10, // second
    keys: {
      private: 'wh06re9Ou',
    }
  },
  refreshToken: {
    // maxAge: 30 * 24 * 60 * 60, // second
    maxAge: 60, // second
    keys: {
      private: 'wh6t6reyOu',
    }
  }
}

const config = {
  port: PORT,
  logger,
  jwtConfig,
}

module.exports = config;
