const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config');
const { logger } = require('../../config');

function isValidPassword(user, password) {
  if (!user) return false;
  const salt = user.getDataValue('salt');
  const res = user.getDataValue('password_hash') === md5(password + md5(salt));
  return res;
}

// todo
// async function findUserByCellphone(ctx, phone) {
// }

function generateJWT(user) {
  const _user = {
    id: user.id,
    username: user.username,
  }
  return {
    accessToken: jwt.sign(_user, jwtConfig.accessToken.keys.private, {
      expiresIn: jwtConfig.accessToken.maxAge
    }),
    refreshToken: jwt.sign(_user, jwtConfig.refreshToken.keys.private, {
      expiresIn: jwtConfig.refreshToken.maxAge
    })
  }
}

function getJWTInfo(token) {
  return jwt.verify(token, jwtConfig.refreshToken.keys.private);
}

module.exports = {
  isValidPassword,
  generateJWT,
  getJWTInfo,
}
