const { logger } = require('./logger');

const PORT = 3001;

const jwtConfig = {
  // maxAge: 24 * 60 * 60, // second
  maxAge: 10, // second
  keys: {
    // private: 'shhhhh',
    private: 'whatareyou',
  }
}

const config = {
  port: PORT,
  logger,
  jwtConfig,
}

module.exports = config;
