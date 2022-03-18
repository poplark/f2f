const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const orm = require('@f2f/storage');
const { port } = require('../config');
const router = require('./router');

const app = new Koa(cors());
app.use(bodyParser());
app.use(cors());
app.use(orm.middleware);

// app.use(async (ctx, next) => {
//   // const { User } = ctx.orm('user');
//   // const { Product } = ctx.orm('product');
//   // const { userId } = ctx.params;

//   // const user = await User.findByPk(userId);
//   // const products = await Product.findAll({
//   //   where: { userId }
//   // });
//   // ctx.body = { user, products };
//   const raws = await ctx.orm().sql.select().from('user');
//   ctx.body = raws;
// });

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`应用已经启动，http://localhost:${port}`);
});
