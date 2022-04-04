// todo - persistance store
const rooms = new Map();

function getUsers(roomId) {
  let res = [];
  if (rooms.has(roomId)) {
    const [ userMap ] = rooms.get(roomId);
    for (let key of userMap.keys()) {
      res.push(key);
    }
  }
  return res;
}

function getSocketId(roomId, userId) {
  let res = '';
  if (rooms.has(roomId)) {
    const [ userMap ] = rooms.get(roomId);
    if (userMap.has(userId)) {
      res = userMap.get(userId);
    }
  }
  return res;
}

function joinRoom(socket, roomId, userId) {
  // socket.id map to rooms;
  let userMap, socketMap;
  if (rooms.has(roomId)) {
    [ userMap, socketMap ] = rooms.get(roomId);
    if (userMap.has(userId)) {
      // todo - kick-out old socketId
    } else {
      userMap.set(userId, socket.id);
      socketMap.set(socket.id, userId);
    }
  } else {
    userMap = new Map();
    userMap.set(userId, socket.id);
    socketMap = new Map();
    socketMap.set(socket.id, userId);
    rooms.set(roomId, [userMap, socketMap]);
  }
}

function leaveRoom(socket, roomId, userId) {
  if (rooms.has(roomId)) {
    const [ userMap, socketMap ] = rooms.get(roomId);
    if (userMap.has(userId)) {
      userMap.delete(userId);
    }
    if (socketMap.has(socket.id)) {
      socketMap.delete(socket.id);
    }
    if (userMap.size === 0) {
      rooms.delete(roomId);
    }
  }
  socket.disconnect();
}

module.exports = {
  getUsers,
  getSocketId,
  joinRoom,
  leaveRoom,
}
