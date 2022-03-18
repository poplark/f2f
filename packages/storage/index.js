const config = require('./config')();

const orm = require('koa-orm')(config);

module.exports = orm;
