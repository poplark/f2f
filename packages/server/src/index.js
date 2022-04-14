const { createServer } = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const orm = require('@f2f/storage');
const im = require('@f2f/im-server');
const { port, logger, jwtConfig } = require('../config');
const router = require('./router');
const UserMiddleware = require('./middleware/user');

const app = new Koa();
const server = createServer(app.callback());
im(server);
app.use(bodyParser());
app.use(cors());
app.use(jwt({ secret: jwtConfig.accessToken.keys.private }).unless({
  path: [/\/(register|token|refreshToken|init-test)/]
}));
app.use(orm());
app.use(UserMiddleware);

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

server.listen(port, () => {
  logger.info(`应用已经启动，http://localhost:${port}`);
});
