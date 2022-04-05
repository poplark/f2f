export class Message {
  // type
  // sequence
  // payload
  // from
  // to?
  constructor(type, payload, from, to) {
    this.type = type;
    this.sequence = getSequence();
    this.payload = payload;
    this.from = from;
    this.to = to ? to : '@all';
  }

  toJSON() {
    return {
      type: this.type,
      sequence: this.sequence,
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
export function createTextMessage(roomId, fromUser, content) {
  return new Message('text', {
    roomId,
    userId: fromUser.id,
    content,
  }, fromUser.id);
}
