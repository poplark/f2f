const Router = require('@koa/router');
const init = require('./init');

const router = new Router();

// 在 Router 上使用中间件，来 嵌套路由
const initRouter = new Router({
  prefix: '/init-test'
});

init(initRouter);

router.use(initRouter.routes());

module.exports = router;
