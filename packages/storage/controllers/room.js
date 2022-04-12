const { Op } = require('sequelize');

function isUndefined(_undefined) {
  return undefined === _undefined;
}
function isNull(_null) {
  return null === _null;
}
function isBlankValue(val) {
  return isNull(val) || isUndefined(val);
}

module.exports = function(_exports) {
  async function findRoomsByUserId(orm, userId) {
    const { Room } = orm;
    const rooms = await Room.findAll({
      where: {
        [Op.or]: [
          {createUser: userId },
          { isOpen: true }
        ],
      }
    });

    return rooms;
  }

  async function createRoom(orm, name, type, userId, password, startAt, duration) {
    const { Room } = orm;
    const room = new Room({
      name,
      type: type === 'audio' ? type : 'video',
      createUser: userId,
      password,
      startAt,
      duration,
    });

    await room.save();

    return room;
  }

  async function findRoomById(orm, roomId) {
    const { Room } = orm;
    const room = await Room.findOne({
      where: {id: roomId}
    });
  
    return room;
  }

  async function editRoom(orm, id, name, type, password, startAt, duration, isOpen) {
    const { Room } = orm;
    const room = await findRoomById(ctx, id);
    if (room) {
      room.set({
        name: isBlankValue(name) ? room.name : name,
        type: isBlankValue(type) ? room.type : type,
        password: isBlankValue(password) ? room.password : password,
        startAt: isBlankValue(startAt) ? room.startAt : startAt,
        duration: isBlankValue(duration) ? room.duration : duration,
        isOpen: isBlankValue(isOpen) ? room.isOpen : isOpen,
      });
      await room.save();
    }
    return room;
  }

  async function findUserFromRoom() {
  }

  _exports.findRoomsByUserId = findRoomsByUserId;
  _exports.createRoom = createRoom;
  _exports.findRoomById = findRoomById;
  _exports.editRoom = editRoom;
  _exports.findUserFromRoom = findUserFromRoom;
}
