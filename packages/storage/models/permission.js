module.exports = function(sequelize, types) {
  return sequelize.define('Permission', {
    id: {
      autoIncrement: true,
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    // RTC 用户操作类型
    // 'pull', 'push'
    RTCOperation: {
      type: types.STRING(50),
      allowNull: false,
      defaultValue: "pull",
    },
  }, {
    tableName: 'permission'
  });
}
