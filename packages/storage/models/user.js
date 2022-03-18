const md5 =  require('md5');
const config = require('../config')();

module.exports = function(sequelize, types) {
  const User = sequelize.define('User', {
    id: {
      type: types.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    username: {
      type: types.STRING(50),
      allowNull: true,
    },
    password_hash: types.STRING,
    password: {
      type: types.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val);
        this.setDataValue('password_hash', md5(val+md5(config.salt)));
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 7) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    },
    active: {
      type: types.BOOLEAN(),
    },
    // todo - phone, email, address, sex, createdAt, lastLogin
  });
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'role'
    });
  }
  return User;
}
