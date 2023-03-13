const Sequelize = require('sequelize');
const config = require('./config')();

const sequelize = new Sequelize(
  config.database, // 'DATABASE_NAME',
  config.username, // 'DATABASE_USER_NAME',
  config.password, { // 'DATABASE_PASSWORD', {

      // Explicitly specifying
      // mysql database
      dialect: config.dialect, // 'mysql',

      // By default host is 'localhost'
      host: config.host, // 'localhost'
  }
);

sequelize
  .authenticate()
  .then(() => {
    require('./models/permission')(sequelize, Sequelize.DataTypes);
    require('./models/role')(sequelize, Sequelize.DataTypes);
    require('./models/user')(sequelize, Sequelize.DataTypes);
    require('./models/room')(sequelize, Sequelize.DataTypes);

    // Create all the table defined using
    // sequelize in Database

    if (process.env.NODE_ENV === 'production') {

    // Sync all models that are not
    // already in the database
    sequelize.sync();

    } else {

    // Force sync all models
    // It will drop the table first
    // and re-create it afterwards
    sequelize.sync();
    // sequelize.sync({force:true});

    }
  })
  .catch((err) => {
    console.error('连接数据库失败，请确保数据库已经创建并开启服务，错误信息：', err);
  });
