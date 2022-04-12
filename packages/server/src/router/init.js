const md5 = require('md5');
const { logger } = require('../../config');

module.exports = function(router) {
  router.get('/permission', async (ctx) => {
    const { Permission } = ctx.orm;
    const permissions = await Permission.findAll();
    if (permissions.length > 0) {
      ctx.body = permissions;
      return;
    }
    const p1 = new Permission({
      RTCOperation: 'pull',
    });
    const p2 = new Permission({
      RTCOperation: 'push',
    });
    await p1.save();
    await p2.save();
    ctx.body = [p1, p2];
  });
  router.get('/role', async (ctx) => {
    const orm = ctx.orm;
    const { Permission, Role } = orm;
    const roles = await Role.findAll();
    if (roles.length > 0) {
      ctx.body = roles;
      return;
    }
    const p1 = await Permission.findOne({ where: { RTCOperation: 'pull' }});

    const p2 = await Permission.findOne({ where: { RTCOperation: 'push' }});


    const role1 = new Role({
      RTCRole: 'audience',
      permission: p1.id,
    });
    const role2 = new Role({
      RTCRole: 'speaker',
      permission: p2.id
    });
    await role1.save();
    await role2.save();

    ctx.body = [ role1, role2 ];
  });
  router.get('/adduser', async (ctx) => {
    logger.debug('ctx:: ', Object.keys(ctx));
    logger.debug('params:: ', ctx.query);
    const { username } = ctx.query;
    logger.debug('username:: ', username);
    const { Role, User } = ctx.orm;
    if (username) {
      const user = await User.findOne({where:{username}});
      logger.debug('user:: ', user);
      if (user) {
        ctx.body = user;
        return;
      }
    }
    const role = await Role.findOne({where: {RTCRole: 'speaker'}});
    const user = new User({
      username: username || `test-${Date.now()}`,
      password: md5(`123456`),
      role: role.id,
    });
    await user.save();
    ctx.body = user;
  });
}
