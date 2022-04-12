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

    ctx.orm = sequelize.models;
    return next();
  }
}

require('./controllers/room')(module.exports);
require('./controllers/role')(module.exports);
require('./controllers/user')(module.exports);
