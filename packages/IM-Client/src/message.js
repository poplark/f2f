export class Message {
  // type
  // sequence
  // payload
  // from
  // to?
  constructor(payload) {
    const { type, content, userId, username, timestamp } = payload;
    this.type = type;
    this.content = content;
    this.userId = userId;
    this.username = username;
    this.timestamp = timestamp;
  }
}

export function messageHandler(payload) {
  const message = new Message(payload);
  this.room.pushMessage(message);
  this.emit('message', message);
}
