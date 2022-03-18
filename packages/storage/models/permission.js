module.exports = function(sequelize, types) {
  return sequelize.define('Permission', {
    id: {
      type: types.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    // RTC 用户操作类型
    RTCOperation: {
      type: types.ENUM({
        values: ['pull', 'push']
      }),
    },
    // RTC 房间媒体类型
    RTCMedia: {
      type: types.ENUM({
        values: ['audio', 'video']
      }),
    }
  }, {
    tableName: 'permission'
  });
}
