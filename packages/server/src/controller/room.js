function isUndefined(_undefined) {
  return undefined === _undefined;
}
function isNull(_null) {
  return null === _null;
}
function isBlankValue(val) {
  return isNull(val) || isUndefined(val);
}

exports.createRoom = async function createRoom(ctx, name, type, userId, password, startAt, duration) {
  const { Room } = ctx.orm();

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

exports.findRoomById = async function findRoomById(ctx, roomId) {
  const { Room } = ctx.orm();

  const room = await Room.findOne({
    where: {id: roomId}
  });

  return room;
}

exports.editRoom = async function editRoom(ctx, id, name, type, password, startAt, duration, isOpen) {
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

exports.findRoomsByUserId = async function findRoomsByUserId(ctx, userId) {
  const { Room } = ctx.orm();

  const rooms = await Room.findAll({
    where: {createUser: userId}
  });

  return rooms;
}

exports.findUserFromRoom = async function findUserFromRoom() {
}
