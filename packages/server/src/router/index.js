const Router = require('@koa/router');
const init = require('./init');

const router = new Router();

init(router);

module.exports = router;
