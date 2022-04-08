const Room = require('./room');
const Notification = require('./notification');
const Message = require('./message');

const CMD = {
  join: 'join',
  leave: 'leave',
  kickOut: 'kick-out',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
  message: 'message',
}

/**
 * CMD/MSG 的统一返回处理
 * @param {*} socket 
 * @param {*} cmd 
 * @param {*} payload 
 */
function response(socket, cmd, payload) {
  const { action, sequence } = cmd;
  socket.emit('ack', {
    action,
    sequence,
    payload,
  });
}

/**
 * 加入房间命令
 * @param {*} socket 
 * @param {*} cmd 
 */
function join(socket, cmd) {
  const { payload } = cmd;
  const { roomId, userId, username } = payload;
  socket.join(roomId);
  socket.data.roomId = roomId;
  socket.data.userId = userId;
  socket.data.username = username;

  const oldSocket = Room.getSocket(roomId, userId);
  if (oldSocket) {
    Notification.kickOut(socket, roomId, userId, userId);
    Notification.leave4KickOut(socket, oldSocket, roomId, userId);
    Room.leave(socket, roomId, userId);
  }
  Room.join(socket, roomId, userId);
  Notification.join(socket, roomId, userId, username);

  response(socket, cmd, {
    users: Room.getUsers(roomId, userId).filter(item => (item.userId !== userId))
  });
}

/**
 * 离开房间命令
 * @param {*} socket 
 * @param {*} cmd 
 */
function leave(socket, cmd) {
  const { roomId, userId } = socket.data;
  Room.leave(socket, roomId, userId);
  Notification.leave(socket, roomId, userId);

  response(socket, cmd, {});

  // todo - 自行断开么？？
  // socket.disconnect();
}

/**
 * 异常断线处理
 * @param {*} io 
 * @param {*} socket 
 * @param {*} reason 
 */
function disconnect(socket, reason) {
  const { roomId, userId } = socket.data;

  const _socket = Room.getSocket(roomId, userId);
  if (socket === _socket) {
    Room.leave(socket, roomId, userId);
    Notification.leave(socket, roomId, userId, reason);
  }
}

/**
 * 踢除用户
 * @param {*} socket 
 * @param {*} cmd 
 */
function kickOut(socket, cmd) {
  const { roomId, userId } = socket.data;
  const { payload} = cmd;
  const { userId: kUserId } = payload;

  let res = { roomId };
  try {
    Notification.kickOut(socket, roomId, userId, kUserId);
    res.userId = kUserId;
  } catch (err) {
    console.warn('command::kickOut::', err);
  }
  Room.kickOut(roomId, kUserId);
  response(socket, cmd, res);
}

/**
 * 消息处理
 * @param {*} socket 
 * @param {*} cmd 
 */
function message(socket, cmd) {
  const { roomId, userId, username } = socket.data;
  const { payload, to } = cmd;
  const timestamp = Date.now();

  Message.message(socket, roomId, {
    ...payload,
    userId,
    username,
    timestamp,
  }, userId, to);

  response(socket, cmd, {
    ...payload,
    userId,
    username,
    timestamp,
  });
}

module.exports = function(io, socket) {
  socket.on('command', (cmd) => {
    console.log('command:::: ', cmd);
    switch (cmd.action) {
      case CMD.join:
        join(socket, cmd);
        break;
      case CMD.leave:
        leave(socket, cmd);
        break;
      case CMD.kickOut:
        kickOut(socket, cmd);
        break;
      case CMD.askMic:
        break;
      case CMD.onMic:
        break;
      case CMD.offMic:
        break;
      case CMD.message:
        message(socket, cmd);
        break;
      default:
        console.warn('unknown command:::: ', cmd);
        break;
    }
  });
  socket.on('disconnect', (reason) => {
    disconnect(socket, reason);
  });
}
