const md5 = require('md5');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config');

const ClientRequestAttributes = [
  'id', 'username', 'active', 'role'
];
const ManagerRequestAttributes = [
  'salt', 'password_hash'
].concat(ClientRequestAttributes);

async function findUserById(ctx, id) {
  const { User } = ctx.orm();
  const user = await User.findOne({
    attributes: ClientRequestAttributes,
    where: {id}
  });
  return user;
}

async function findUserByUserName(ctx, username) {
  const { User } = ctx.orm();
  const user = await User.findOne({
    attributes: ClientRequestAttributes,
    where: {username}
  });
  return user;
}

/**
 * find user by Id or Username
 * @param {*} ctx 
 * @param {*} account 
 * @returns 
 * todo - by cellphone or username
 */
async function findUserByAccount(ctx, account) {
  if (!account) return;
  const { User } = ctx.orm();
  const user = await User.findOne({
    attributes: ManagerRequestAttributes,
    where: {
      [Op.or]: [{id: account}, {username: account}]
    }
  });
  return user;
}

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
  return jwt.sign(_user, jwtConfig.keys.private, {
    expiresIn: jwtConfig.maxAge
  });
}

function getJWTInfo(token) {
  if (!token) throw new Error('invalid token');
  return jwt.verify(token, jwtConfig.keys.private);
}

module.exports = {
  findUserById,
  findUserByUserName,
  findUserByAccount,
  isValidPassword,
  generateJWT,
  getJWTInfo,
}
