// todo - persistance store
// todo - 记录 room version ， 用于消息乱序时的同步
const rooms = new Map();

function getUsers(roomId) {
  let res = [];
  if (rooms.has(roomId)) {
    const socketMap = rooms.get(roomId);
    for (let [_, socket] of socketMap) {
      res.push(socket.data);
    }
  }
  return res;
}

function getSocket(roomId, userId) {
  let res = null;
  if (rooms.has(roomId)) {
    const socketMap = rooms.get(roomId);
    if (socketMap.has(userId)) {
      res = socketMap.get(userId);
    }
  }
  return res;
}

/**
 * 保存 房间及用户信息至 socket，缓存 socket 到 room 的 socketMap 中，用于记录房间内所有用户
 * @param {*} socket 
 * @param {*} roomId 
 * @param {*} userId 
 */
function join(socket, roomId, userId) {
  // socket.id map to rooms;
  let socketMap;
  if (rooms.has(roomId)) {
    socketMap = rooms.get(roomId);
    if (socketMap.has(userId)) {
      // todo - kick-out old socketId
    } else {
      socketMap.set(userId, socket);
    }
  } else {
    socketMap = new Map();
    socketMap.set(userId, socket);
    rooms.set(roomId, socketMap);
  }
}

function leave(socket, roomId, userId) {
  if (rooms.has(roomId)) {
    const socketMap = rooms.get(roomId);
    if (socketMap.has(userId)) {
      socketMap.delete(userId);
    }
    if (socketMap.size === 0) {
      rooms.delete(roomId);
    }
  }
}

/**
 * 踢除用户
 * @param {*} roomId - 房间号
 * @param {*} userId - 被踢用户
 */
function kickOut(roomId, userId) {
  if (rooms.has(roomId)) {
    const socketMap = rooms.get(roomId);
    if (socketMap.has(userId)) {
      socketMap.delete(userId);
    }
    if (socketMap.size === 0) {
      rooms.delete(roomId);
    }
  }
}

module.exports = {
  getUsers,
  getSocket,
  join,
  leave,
  kickOut,
}
