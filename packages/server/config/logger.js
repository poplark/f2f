const { configure, getLogger } = require('log4js');

configure({
  appenders: {
    out: { type: 'console', layout: { type: 'coloured' } },
    app: { type: 'dateFile', filename: 'f2f.log' }
  },
  categories: {
    dev: { appenders: ['out'], level: 'debug' },
    default: { appenders: ['app'], level: 'info' },
    prod: { appenders: ['app'], level: 'warn' }
  }
});

let logger;
if (process.env.NODE_ENV !== 'production') {
  logger = getLogger('dev');
} else {
  logger = getLogger('prod');
}

module.exports = {
  logger,
}
