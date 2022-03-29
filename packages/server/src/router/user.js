const {
  findUserByUserName,
  findUserById,
  isValidPassword,
  findUserByAccount,
  generateJWT,
  getJWTInfo,
} = require('../controller/user');
const { logger } = require('../../config');

module.exports = function(router) {
  // need auth
  router.get('/user', async (ctx) => {
    const { username } = ctx.query;
    const user = await findUserByUserName(ctx, username);
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  router.get('/user/:id', async (ctx) => {
    const { id } = ctx.params;
    const user = await findUserById(ctx, id);
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  // todo JWT
  router.post('/login', async (ctx) => {
    const data = ctx.request.body;
    const { account, passwd } = data;

    const user = await findUserByAccount(ctx, account);

    logger.debug('login:: ', account, passwd, user);
    logger.debug('session:: ', ctx.session);

    if (isValidPassword(user, passwd)) {
      if (user.active) {
        ctx.session.userName = user.username;
        ctx.body = '登录成功';
      } else {
        ctx.status = 401;
      }
    } else {
      ctx.status = 403;
    }
  });
  router.post('/logout', async (ctx) => {
    logger.debug('post data:: ', data);
    ctx.body = data;
  });
  router.post('/register', async (ctx, next) => {
    const data = ctx.request.body;
    logger.debug('post data:: ', data);
    ctx.body = data;
  });
  router.post('/token', async (ctx) => {
    logger.debug('headers::: ', Object.keys(ctx.request.headers));
    // const { Authorization } = ctx.request.headers;
    const { username, password } = ctx.request.body;

    const user = await findUserByAccount(ctx, username);

    logger.debug('token:: ', username, password, user);

    if (isValidPassword(user, password)) {
      if (user.active) {
        ctx.body = generateJWT(user);
      } else {
        ctx.status = 401;
      }
    } else {
      ctx.status = 403;
    }
  });
  router.post('/refreshToken', async (ctx) => {
    const { authorization } = ctx.request.headers;
    logger.debug('authorization::: ', authorization);
    const info = getJWTInfo(authorization.split(' ')[1]);
    logger.debug('info::: ', info);

    const user = await findUserById(ctx, info.id);
    if (user && user.active) {
      ctx.body = generateJWT(user);
    } else {
      ctx.status = 403;
    }
  });
}
