const { decode } = require('js-base64');
const {
  createRoom,
  editRoom,
  findRoomsByUserId,
  findRoomById,
  extractRoomInfo,
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
      ctx.body = {};
    }
  });
  router.get('/rooms', async (ctx) => {
    const { id: userId } = ctx.userInfo;
    ctx.body = await findRoomsByUserId(ctx.orm, userId);
  });
  router.post('/room/validation', async (ctx) => {
    const { roomId, password } = ctx.request.body;
    const room = await findRoomById(ctx.orm, roomId);
    if (!room) {
      ctx.status = 404;
      ctx.body = {};
      return;
    }
    if (room.password === password) {
      ctx.body = {
        isValidated: true,
      };
    } else {
      ctx.body = {
        isValidated: false,
      };
    }
  });
  router.get('/room/:id', async (ctx) => {
    const { id } = ctx.params;
    const { id: userId } = ctx.userInfo;
    const room = await findRoomById(ctx.orm, id);
    if (!room) {
      ctx.status = 404;
      ctx.body = {};
      return;
    }
    if (room.createUser === userId) {
      ctx.body = room;
    } else {
      ctx.body = extractRoomInfo(room);
    }
  });
  router.get('/room/:userId', async (ctx) => {
  });
}
