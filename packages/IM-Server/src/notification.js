const { getSocketId } = require('./room');

const NIO = {
  online: 'online',
  offline: 'offline',
  ban: 'ban',
  onMic: 'on-mic',
  offMic: 'off-mic',
};

function createNotification(action, payload, from, to) {
  return {
    action,
    payload,
    from,
    to: to ? to : '@all'
  }
}

/**
 * 特殊地，socket 断开时，由 io 广播到 roomId 房间
 * @param {*} roomId 
 * @param {*} userId 
 * @returns 
 */
function disconnectNotification(roomId, userId) {
  return createNotification(NIO.offline, {
    roomId,
    userId,
  }, userId);
}

function userOnline(socket, roomId, userId) {
  const nio = createNotification(NIO.online, {
    roomId,
    userId,
  }, userId);
  socket.broadcast.emit('notification', nio);
}

function userOffline(socket, roomId, userId) {
  const nio = createNotification(NIO.offline, {
    roomId,
    userId,
  }, userId);
  socket.broadcast.emit('notification', nio);
}

function ban(socket, roomId, adminUser, banUser) {
  const toId = getSocketId(roomId, banUser);
  if (!toId) return;
  const nio = createNotification(NIO.ban, {
    roomId,
    userId: banUser,
  }, adminUser, banUser);
  socket.to(toId).emit('notification', nio);
}

function onMic(socket, roomId, from, to) {
  const toId = getSocketId(roomId, to);
  if (!toId) return;
  const nio = createNotification(NIO.onMic, {
    roomId,
    userId: to,
  }, from, to);
  socket.to(toId).emit('notification', nio);
}

function offMic(socket, roomId, from, to) {
  const toId = getSocketId(roomId, to);
  if (!toId) return;
  const nio = createNotification(NIO.offMic, {
    roomId,
    userId: to,
  }, from, to);
  socket.to(toId).emit('notification', nio);
}

module.exports = {
  disconnectNotification,
  userOnline,
  userOffline,
  ban,
  onMic,
  offMic,
}
