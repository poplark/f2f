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
    socketMap.set(userId, socket);
  } else {
    socketMap = new Map();
    socketMap.set(userId, socket);
    rooms.set(roomId, socketMap);
  }
}

/**
 * 用户离开 - 自行离开或被踢离开
 * @param {*} roomId 
 * @param {*} userId 
 */
function leave(roomId, userId) {
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
}
