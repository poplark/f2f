export class Message {
  // type
  // payload
  // from
  // to?
  constructor(type, payload, from, to) {
    this.type = type;
    this.payload = payload;
    this.from = from;
    this.to = to ? to : '@all';
  }

  getMessage() {
    return {
      action: this.action,
      payload: this.payload,
      from: this.from,
      to: this.to,
    }
  }
}

/**
 * 向房间发消息
 * @param {*} roomId
 * @param {*} fromUser
 * @returns
 */
export function createTextMessage(roomId, fromUser) {
  return new Message('text', {
    roomId,
    userId: fromUser.id,
  }, fromUser.id);
}
