module.exports = function(sequelize, types) {
  return sequelize.define('Permission', {
    id: {
      type: types.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    permission: {
      type: types.ENUM({
        values: ['pull', 'push']
      }),
    },
  }, {
    tableName: 'permission'
  });
}
