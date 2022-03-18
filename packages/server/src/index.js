const Koa = require('koa');
const Router = require('@koa/router')
const cors = require('@koa/cors');
const orm = require('@f2f/storage');
const { port } = require('../config');

const app = new Koa(cors());
app.use(cors());

app.use(orm.middleware);
app.use(async (ctx, next) => {
  // const { User } = ctx.orm('user');
  // const { Product } = ctx.orm('product');
  // const { userId } = ctx.params;
  
  // const user = await User.findByPk(userId);
  // const products = await Product.findAll({
  //   where: { userId }
  // });
  // ctx.body = { user, products };
  const raws = await ctx.orm().sql.select().from('user');
  ctx.body = raws;
});
/*
const router = new Router();

router.get('/adduser', async (ctx, next) => {
});

app.use(router.routes()).use(router.allowedMethods());
*/

app.listen(port, () => {
  console.log(`应用已经启动，http://localhost:${port}`);
});
