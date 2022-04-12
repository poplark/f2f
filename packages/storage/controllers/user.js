const { Op } = require('sequelize');

const ClientRequestAttributes = [
  'id', 'username', 'active', 'role'
];
const ManagerRequestAttributes = [
  'salt', 'password_hash'
].concat(ClientRequestAttributes);

module.exports = function(_exports) {
  function extractUserInfo(user) {
    let res = {};
    for (let key of ClientRequestAttributes) {
      res[key] = user.getDataValue(key);
    }
    return res;
  }

  async function findUserById(orm, id) {
    const { User } = orm;
    const user = await User.findOne({
      attributes: ClientRequestAttributes,
      where: {id}
    });
    return user;
  }

  async function findUserByUserName(orm, username) {
    const { User } = orm;
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
  async function findUserByAccount(orm, account) {
    if (!account) return;
    const { User } = orm;
    const user = await User.findOne({
      attributes: ManagerRequestAttributes,
      where: {
        [Op.or]: [{id: account}, {username: account}]
      }
    });
    return user;
  }

  async function createUser(orm, username, password, roleInfo) {
    const { User } = orm;
    const user = new User({
      username: username,
      password: password,
      role: roleInfo.id,
    });

    await user.save();

    return user;
  }

  _exports.extractUserInfo = extractUserInfo;
  _exports.findUserById = findUserById;
  _exports.findUserByUserName = findUserByUserName;
  _exports.findUserByAccount = findUserByAccount;
  _exports.createUser = createUser;
}
