module.exports = function(router) {
  // need auth
  router.get('/user/:username', async (ctx) => {
    const { username } = ctx.params;
    const { User } = ctx.orm();
    const user = await User.findOne({where: {username}});
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  // todo JWT
  router.post('/user/login', async (ctx, next) => {
    const data = ctx.request.body;
    console.log('post data:: ', data);
    ctx.body = data;
  });
}
