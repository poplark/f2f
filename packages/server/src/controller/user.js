const md5 = require('md5');
const { Op } = require('sequelize');
const { logger } = require('../../config');

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

module.exports = {
  findUserById,
  findUserByUserName,
  findUserByAccount,
  isValidPassword,
}
