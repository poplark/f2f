import { CMD, Command } from "./command";

const MSG_TYPE = {
  text: 'text',
  emoji: 'emoji',
}

export class Message extends Command {
  // type
  // sequence
  // payload
  // from
  // to?
  constructor(type, content, from, to) {
    super(CMD.message, {
      type,
      content
    }, from, to);
  }
}

/**
 * 向房间发消息
 * @param {*} roomId
 * @param {*} fromUser
 * @returns
 */
export function createTextMessage(content, fromUser) {
  return new Message(MSG_TYPE.text, content, fromUser.id);
}
