const Sequelize = require('sequelize');
const config = require('./config')();
const defineModels = require('./models');

module.exports = function() {
  return function(ctx, next) {
    if (ctx.orm) {
      return next();
    }
    const sequelize = new Sequelize(config);
    defineModels(sequelize, Sequelize.DataTypes);

    ctx.orm = function () {
      return sequelize.models;
    }
    return next();
  }
}
