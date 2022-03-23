module.exports = function(sequelize, DataTypes) {
  require('./permission')(sequelize, DataTypes);
  require('./role')(sequelize, DataTypes);
  require('./user')(sequelize, DataTypes);
  require('./room')(sequelize, DataTypes);
}
