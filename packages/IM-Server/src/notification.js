const { getSocket } = require('./room');

const NIO = {
  online: 'online',
  offline: 'offline',
  ban: 'ban',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
};

/**
 * 创建通知
 * @param {*} action 
 * @param {*} payload 
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
function createNotification(action, payload, from, to) {
  return {
    action,
    payload,
    from,
    to: to ? to : '@all'
  }
}

/**
 * 用户加入房间时，向其他用户广播其上线的消息
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} userId 
 */
function join(socket, roomId, userId, username) {
  const nio = createNotification(NIO.online, {
    roomId,
    userId,
    username,
  }, userId);
  socket.to(roomId).except(userId).emit('notification', nio);
}

/**
 * 用户离开房间或异常断线时，向其他用户广播其下线的消息
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} userId 
 * @param {*} reason 
 */
function leave(socket, roomId, userId, reason) {
  const nio = createNotification(NIO.offline, {
    roomId,
    userId,
    reason: reason ? reason : 'leave'
  }, userId);
  socket.to(roomId).except(userId).emit('notification', nio);
}

/**
 * 通知被踢者
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} adminUser - 踢人者
 * @param {*} banUser - 被踢者
 * @returns 
 */
function kickOut(socket, roomId, adminUser, banUser) {
  const toSocket = getSocket(roomId, banUser);
  if (!toSocket) throw new Error('Can not find socket');
  const nio = createNotification(NIO.ban, {
    roomId,
    userId: adminUser,
  }, adminUser, banUser);
  socket.to(toSocket.id).emit('notification', nio);
}

/**
 * 异地登录被踢时广播前次连接离线的消息
 * @param {*} socket 
 */
function leave4KickOut(socket, oldSocket, roomId, userId) {
  const nio = createNotification(NIO.offline, {
    roomId,
    userId,
    reason: 'kick out'
  }, userId);
  socket.to(roomId).except(oldSocket.id).emit('notification', nio);
}

/**
 * 通知管理员，某用户请求上麦
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
function askMic(socket, roomId, from, to) {
  const toSocket = getSocket(roomId, to);
  if (!toSocket) return;
  const nio = createNotification(NIO.askMic, {
    roomId,
    userId: to,
  }, from, to);
  socket.to(toSocket.id).emit('notification', nio);
}
/**
 * 通知连麦者上麦
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
function onMic(socket, roomId, from, to) {
  const toSocket = getSocket(roomId, to);
  if (!toSocket) return;
  const nio = createNotification(NIO.onMic, {
    roomId,
    userId: to,
  }, from, to);
  socket.to(toSocket.id).emit('notification', nio);
}

/**
 * 通知连麦者下麦
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
function offMic(socket, roomId, from, to) {
  const toSocket = getSocket(roomId, to);
  if (!toSocket) return;
  const nio = createNotification(NIO.offMic, {
    roomId,
    userId: to,
  }, from, to);
  socket.to(toSocket.id).emit('notification', nio);
}

module.exports = {
  join,
  leave,
  kickOut,
  leave4KickOut,
  askMic,
  onMic,
  offMic,
}
