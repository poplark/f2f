module.exports = function(router) {
  // need auth
  router.get('/user', async (ctx) => {
    const { username } = ctx.query;
    const { User } = ctx.orm();
    const user = await User.findOne({where: {username}});
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  router.get('/user/:id', async (ctx) => {
    const { id } = ctx.params;
    const { User } = ctx.orm();
    const user = await User.findOne({where: {id}});
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  // todo JWT
  router.post('/login', async (ctx) => {
    const data = ctx.request.body;
    console.log('post data:: ', data);
    ctx.body = data;
  });
  router.post('/logout', async (ctx) => {
    console.log('post data:: ', data);
    ctx.body = data;
  });
  router.post('/register', async (ctx, next) => {
    const data = ctx.request.body;
    console.log('post data:: ', data);
    ctx.body = data;
  });
}
