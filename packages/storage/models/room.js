module.exports = function(sequelize, types) {
  const Room = sequelize.define('Room', {
    id: {
      autoIncrement: true,
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: types.STRING(50),
      allowNull: true,
    },
    password: {
      type: types.STRING(50),
      allowNull: true,
    },
    isOpen: {
      type: types.BOOLEAN(),
      defaultValue: true,
    },
    startAt: {
      type: types.DATE(),
    },
    duration: {
      type: types.INTEGER.UNSIGNED,
      defaultValue: 3600,
    },
    // RTC 房间媒体类型
    // 'audio', 'video'
    type: {
      type: types.STRING(50),
      allowNull: false,
      defaultValue: "video",
    }
  }, {
    tableName: 'room'
  });
  return Room;
}
