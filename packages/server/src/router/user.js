const { decode } = require('js-base64');
const {
  extractUserInfo,
  findUserByUserName,
  findUserById,
  isValidPassword,
  findUserByAccount,
  createUser,
  generateJWT,
  getJWTInfo,
} = require('../controller/user');
const { findRole } = require('../controller/role');
const { logger } = require('../../config');

module.exports = function(router) {
  // need auth
  router.get('/user', async (ctx) => {
    const { authorization } = ctx.request.headers;
    logger.info('user:: ', authorization);
    const accessToken = authorization.split(' ')[1];
    const infoCode = accessToken.split('.')[1];
    const info = JSON.parse(decode(infoCode));
    logger.debug('user info:: ', info);
    const { username } = info || ctx.query;
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
  router.post('/logout', async (ctx) => {
    logger.debug('post data:: ', data);
    ctx.body = data;
  });
  // todo - 防止同IP疯狂注册
  router.post('/register', async (ctx) => {
    logger.debug('register header::: ', Object.keys(ctx.request.headers));
    logger.debug('register::: ', ctx.request.body);
    const { username, password } = ctx.request.body;
    logger.info('register data:: ', username, password);

    let user = await findUserByUserName(ctx, username);
    if (user) {
      ctx.status = 400;
      ctx.body = `user ${username} is already exists`;
      return;
    }

    const role = await findRole(ctx, 'audience');

    user = await createUser(ctx, username, password, role);

    ctx.body = extractUserInfo(user);
  });
  router.post('/token', async (ctx) => {
    logger.debug('headers::: ', Object.keys(ctx.request.headers));
    // const { authorization } = ctx.request.headers;
    const { username, password } = ctx.request.body;
    const user = await findUserByAccount(ctx, username);
    logger.info('token:: ', username, password, user);

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
    // const { authorization } = ctx.request.headers;
    const { refreshToken } = ctx.request.body;
    logger.info('refreshToken::: ', refreshToken);
    let info;
    try {
      info = getJWTInfo(refreshToken);
    } catch (err) {
      ctx.status = 401;
      ctx.body = err;
      return;
    }
    logger.debug('info::: ', info);

    const user = await findUserById(ctx, info.id);
    if (user && user.active) {
      ctx.body = generateJWT(user);
    } else {
      ctx.status = 403;
    }
  });
}
