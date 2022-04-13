const md5 =  require('md5');
const config = require('../config')();

module.exports = function(sequelize, types) {
  const User = sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: types.STRING(255),
      allowNull: false,
      unique: true,
    },
    salt: {
      type: types.STRING(8),
      defaultValue: function() {
        return Math.random().toString(36).slice(-8);
      }
    },
    password_hash: types.STRING(255),
    password: {
      type: types.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val);
        this.setDataValue('password_hash', md5(val+md5(this.getDataValue('salt'))));
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 6) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    },
    active: {
      type: types.BOOLEAN,
      defaultValue: true,
    },
    // 外键
    role: {
      type: types.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    }
    // todo - phone, email, address, sex, createdAt, lastLogin
  }, {
    tableName: 'user'
  });
  // 下面类似不会执行，啥Jer
  // User.associate = (models) => {
  //   User.belongsTo(models.Role, {
  //     foreignKey: 'role'
  //   });
  // }
  return User;
}
