const { decode } = require('js-base64');
const {
  createRoom,
  editRoom,
  findRoomsByUserId,
  findRoomById,
} = require('@f2f/storage');

module.exports = function(router) {
  router.post('/room', async (ctx) => {
    const { id: userId } = ctx.userInfo;
    const { name, isOpen, type, password, startAt, duration } = ctx.request.body;

    ctx.body = await createRoom(ctx.orm, name, isOpen, type, userId, password, startAt, duration);
  });
  router.post('/room/edit/:id', async (ctx) => {
    const { id } = ctx.params;
    const room = await findRoomById(ctx.orm, id);
  });
  router.post('/room/delete/:id', async (ctx) => {
    const { id } = ctx.params;
    const { id: userId } = ctx.userInfo;
    const room = await findRoomById(ctx.orm, id);
    if (room && room.createUser === userId) {
      await room.destroy();
      ctx.body = {};
    } else {
      ctx.status = 404;
    }
  });
  router.get('/rooms', async (ctx) => {
    const { id: userId } = ctx.userInfo;
    ctx.body = await findRoomsByUserId(ctx.orm, userId);
  });
  router.get('/room/:id', async (ctx) => {
    const { id } = ctx.params;
    const { id: userId } = ctx.userInfo;
    const room = await findRoomById(ctx.orm, id);
    if (room.get('createUser') !== userId && !room.get('isOpen')) {
      ctx.status = 404;
      ctx.body = {};
      return;
    }
    ctx.body = room;
  });
  router.get('/room/:userId', async (ctx) => {
  });
}
