const Router = require('@koa/router');
const init = require('./init');
const user = require('./user');

const rootRouter = new Router();

/***** init *****/
// 在 Router 上使用中间件，来 嵌套路由
const initRouter = new Router({
  prefix: '/init-test'
});

init(initRouter);

rootRouter.use(initRouter.routes());

/***** user *****/
user(rootRouter);

module.exports = rootRouter;
