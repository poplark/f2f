const Router = require('@koa/router');
const init = require('./init');
const user = require('./user');
const room = require('./room');

const rootRouter = new Router();

/***** init *****/
// 在 Router 上使用中间件，来 嵌套路由
const initRouter = new Router({
  prefix: '/init-test'
});
init(initRouter);
rootRouter.use(initRouter.routes());

/***** api *****/
// 在 Router 上使用中间件，来 嵌套路由
const apiRouter = new Router({
  prefix: '/api'
});
// api - user
user(apiRouter);
// api - room
room(apiRouter);
rootRouter.use(apiRouter.routes());

module.exports = rootRouter;
