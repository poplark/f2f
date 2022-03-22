const {
  findUserByUserName,
  findUserById,
  isValidPassword,
  findUserByAccount,
} = require('../controller/user');

module.exports = function(router) {
  // need auth
  router.get('/user', async (ctx) => {
    const { username } = ctx.query;
    const user = await findUserByUserName(ctx, username);
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  router.get('/user/:id', async (ctx) => {
    const { id } = ctx.params;
    const user = await findUserById(ctx, id);
    if (!user) {
      ctx.body = 'not found';
    } else {
      ctx.body = user;
    }
  });
  // todo JWT
  router.post('/login', async (ctx) => {
    const data = ctx.request.body;
    const { account, passwd } = data;

    console.log('login:::: ', account, passwd);

    const user = await findUserByAccount(ctx, account);

    console.log('user::::', user);

    if (user && isValidPassword(user, passwd)) {
      if (user.active) {
        ctx.body = user;
      } else {
        ctx.status = 401;
      }
    } else {
      ctx.status = 403;
    }
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
