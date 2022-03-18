module.exports = function(sequelize, types) {
  const Role = sequelize.define('Role', {
    id: {
      autoIncrement: true,
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    // RTC 角色类型
    // audience - pull
    // speaker - push
    RTCRole: {
      type: types.STRING(50),
      allowNull: false,
      defaultValue: "speaker",
    },
    // 外键
    permission: {
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'permission',
        key: 'id'
      }
    }
  }, {
    tableName: 'role'
  });
  // 下面类似不会执行，啥Jer
  // Role.associate = (models) => {
  //   Role.belongsTo(models.Permission, {
  //     foreignKey: 'permission'
  //   });
  // }
  return Role;
}
