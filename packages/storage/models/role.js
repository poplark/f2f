module.exports = function(sequelize, types) {
  const Role = sequelize.define('Role', {
    id: {
      type: types.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    // RTC 角色类型
    // audience - pull
    // speaker - push
    RTCRole: {
      type: types.ENUM({
        values: ['audience', 'speaker']
      })
    },
  }, {
    tableName: 'role'
  });
  Role.associate = (models) => {
    Role.belongsTo(models.Permission, {
      foreignKey: 'permission'
    });
  }
  return Role;
}
