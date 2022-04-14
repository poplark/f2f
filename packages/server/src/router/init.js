const md5 = require('md5');
const { logger } = require('../../config');
const {
  findPermissions,
  createPermission,
  findRoles,
  findRole,
  createUser,
  findUserByUserName,
} = require('@f2f/storage');

module.exports = function(router) {
  router.get('/permission', async (ctx) => {
    const permissions = await findPermissions(ctx.orm);
    if (permissions.length > 0) {
      ctx.body = permissions;
      return;
    }
    const p1 = await createPermission(ctx.orm, 'pull');
    const p2 = await createPermission(ctx.orm, 'push');
    ctx.body = [p1, p2];
  });
  router.get('/role', async (ctx) => {
    const roles = findRoles(ctx.orm);
    if (roles.length > 0) {
      ctx.body = roles;
      return;
    }
    const role1 = createRole('audience');
    const role2 = createRole('speaker');

    ctx.body = [ role1, role2 ];
  });
  router.get('/adduser', async (ctx) => {
    logger.debug('ctx:: ', Object.keys(ctx));
    logger.debug('params:: ', ctx.query);
    const { username } = ctx.query;
    if (username) {
      const user = await findUserByUserName(ctx.orm, username);
      logger.debug('user:: ', user);
      if (user) {
        ctx.body = user;
        return;
      }
    }
    const role = await findRole(ctx.orm, 'speaker');
    const user = await createUser(ctx.orm, username || `test-${Date.now()}`, md5(`123456`), role);
    ctx.body = user;
  });
}
