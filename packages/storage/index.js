const Sequelize = require('sequelize');
const config = require('./config')();
const defineModels = require('./models');

module.exports = function() {
  const sequelize = new Sequelize(config);
  defineModels(sequelize, Sequelize.DataTypes);

  return function(ctx, next) {
    if (ctx.orm) {
      return next();
    }
    ctx.orm = function () {
      return sequelize.models;
    }
    return next();
  }
}
