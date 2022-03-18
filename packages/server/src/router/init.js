module.exports = function(router) {
  router.get('/initpermission', async (ctx) => {
    const { Permission } = ctx.orm();
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
  router.get('/initrole', async (ctx) => {
    const orm = ctx.orm();
    const { Permission, Role } = orm;
    const roles = Role.findAll();
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
    console.log('ctx:: ', Object.keys(ctx));
    console.log('params:: ', ctx.query);
    const { username } = ctx.query;
    console.log('username:: ', username);
    const { Role, User } = ctx.orm();
    if (username) {
      const user = await User.findOne({where:{username}});
      console.log('user:: ', user);
      if (user) {
        ctx.body = user;
        return;
      }
    }
    const role = await Role.findOne({where: {RTCRole: 'speaker'}});
    const user = new User({
      username: username || `test-${Date.now()}`,
      password: `123456`,
      role: role.id,
    });
    await user.save()
    ctx.body = user;
  });
}
