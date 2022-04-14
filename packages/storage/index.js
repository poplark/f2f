const Sequelize = require('sequelize');
const config = require('./config')();
const defineModels = require('./models');

module.exports = function() {
  const sequelize = new Sequelize(config);
  defineModels(sequelize, Sequelize.DataTypes);

  return function(ctx, next) {
    ctx.orm = sequelize.models;
    return next();
  }
}

require('./controllers/room')(module.exports);
require('./controllers/permission')(module.exports);
require('./controllers/role')(module.exports);
require('./controllers/user')(module.exports);
