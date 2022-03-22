const md5 = require('md5');
const { Op } = require('sequelize');

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
    attributes: ClientRequestAttributes,
    where: {
      [Op.or]: [{id: account}, {username: account}]
    }
  });
  return user;
}

async function isValidPassword(user, password) {
  const passwd = md5(password + md5(salt));
  return user.password_hash === passwd;
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
