const { decode } = require('js-base64');
const { logger } = require('../../config');

module.exports = function(ctx, next) {
  const { authorization } = ctx.request.headers;
  ctx.userInfo = {};
  if (authorization) {
    const accessToken = authorization.split(' ')[1];
    const infoCode = accessToken.split('.')[1];
    try {
      const info = JSON.parse(decode(infoCode));
      ctx.userInfo.id = info.id;
      ctx.userInfo.username = info.username;
    } catch (err) {
      logger.warn(`parse authorization ${authorization} failed `, err);
    }
  }
  return next();
}
