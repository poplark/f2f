const { decode } = require('js-base64');
const {
  findUserByUserName,
  createRoom,
  editRoom,
  findRoomsByUserId,
  findRoomById,
} = require('@f2f/storage');

module.exports = function(router) {
  router.post('/room', async (ctx) => {
    const { authorization } = ctx.request.headers;
    const accessToken = authorization.split(' ')[1];
    const infoCode = accessToken.split('.')[1];
    const info = JSON.parse(decode(infoCode));
    const { username } = info || ctx.query;
    const user = await findUserByUserName(ctx.orm, username);

    if (!user) {
      ctx.body = 'not found';
      return;
    }

    const { name, type, password, startAt, duration } = ctx.request.body;

    ctx.body = await createRoom(ctx.orm, name, type, user.get('id'), password, startAt, duration);
  });
  router.post('/room/alteration', async (ctx) => {
  });
  router.get('/rooms', async (ctx) => {
    const { authorization } = ctx.request.headers;
    const accessToken = authorization.split(' ')[1];
    const infoCode = accessToken.split('.')[1];
    const info = JSON.parse(decode(infoCode));
    const { username } = info || ctx.query;
    const user = await findUserByUserName(ctx.orm, username);

    if (!user) {
      ctx.body = 'not found';
      return;
    }

    ctx.body = await findRoomsByUserId(ctx.orm, user.get('id'));
  });
  router.get('/room/:id', async (ctx) => {
  });
  router.get('/room/:userId', async (ctx) => {
  });
}
