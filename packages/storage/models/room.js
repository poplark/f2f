module.exports = function(sequelize, types) {
  const Room = sequelize.define('Room', {
    id: {
      type: types.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: types.STRING(50),
      allowNull: true,
    },
    password: {
      type: types.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val);
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 4) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    },
    isOpen: {
      type: types.BOOLEAN(),
    },
    startAt: {
      type: types.DATE(),
    },
    duration: {
      type: types.NUMBER,
    }
  });
  Room.associate = (models) => {
    Room.belongsTo(models.Permission, {
      foreignKey: 'permission'
    });
  }
  return Room;
}
