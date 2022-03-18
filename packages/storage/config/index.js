const path = require('path');

const common = {
  name: 'f2f',
  modelPath: path.join(__dirname, '../models'),
  database: 'f2f',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 30000,
  }
}

const pre = Object.assign({
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  salt: 'pre-env',
}, common) ;
const prod = Object.assign({
  host: 'xxx.xxx.xxx.xxx',
  port: 3306,
  username: 'root',
  password: 'root',
  salt: 'prod-env',
}, common) ;

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    return prod;
  } else {
    return pre;
  }
};
