const path = require('path');

const common = {
  name: 'f2f',
  database: 'f2f',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 30000,
  },
  timezone: '+08:00',
}

const pre = Object.assign({
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
}, common) ;
const prod = Object.assign({
  host: 'xxx.xxx.xxx.xxx',
  port: 3306,
  username: 'root',
  password: 'root',
}, common) ;

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    return prod;
  } else {
    return pre;
  }
};
