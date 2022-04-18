import { getSequence } from './utils/sequence';

export const CMD = {
  join: 'join',
  leave: 'leave',
  kickOut: 'kick-out',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
  message: 'message',
}

export class Command {
  // action
  // sequence
  // payload
  // from
  // to?

  /**
   * 
   * @param {*} action - 
   * @param {*} payload 
   * @param {*} from 
   * @param {*} to 
   */
  constructor(action, payload, from, to) {
    this.action = action;
    this.sequence = getSequence();
    this.payload = payload;
    this.from = from;
    this.to = to ? to : '@all';
  }

  // todo - use toJSON
  toJSON() {
    return {
      action: this.action,
      sequence: this.sequence,
      payload: this.payload,
      from: this.from,
      to: this.to,
    }
  }
}

/**
 * 加入房间
 * @param {*} roomId 
 * @param {*} user 
 * @returns 
 */
export function createJoinCommand(roomId, user) {
  return new Command(CMD.join, {
    roomId,
    userId: user.id,
    username: user.username,
  }, user.id);
}

/**
 * 离开房间
 * @param {*} user 
 * @returns 
 */
export function createLeaveCommand(user) {
  return new Command(CMD.leave, {
    userId: user.id,
  }, user.id);
}

/**
 * 踢出用户
 * @param {*} outUser - 被踢用户
 * @param {*} adminUser 
 * @returns 
 */
export function createKickOutCommand(outUser, adminUser) {
  return new Command(CMD.kickOut, {
    userId: outUser.id,
  }, adminUser.id, outUser.id);
}

/**
 * 请求上麦
 * @param {*} user 
 * @param {*} adminUser 
 * @returns 
 */
export function createAskMicCommand(user, adminUser) {
  return new Command(CMD.askMic, {
    userId: user.id,
    adminUserId: adminUser.id,
  }, user.id, adminUser.id);
}

/**
 * 允许上麦
 * @param {*} adminUser 
 * @param {*} onMicUser 
 * @returns 
 */
export function createOnMicCommand(adminUser, onMicUser) {
  return new Command(CMD.onMic, {
    userId: onMicUser.id,
  }, adminUser.id, onMicUser.id);
}

/**
 * 强制下麦
 * @param {*} adminUser 
 * @param {*} offMicUser 
 * @returns 
 */
export function createOffMicCommand(adminUser, offMicUser) {
  return new Command(CMD.offMic, {
    userId: offMicUser.id,
  }, adminUser.id, offMicUser.id);
}

const MSG_TYPE = {
  text: 'text',
  emoji: 'emoji',
}

/**
 * 文本消息
 * @param {*} content 
 * @param {*} fromUser 
 * @returns 
 */
export function createTextMessage(content, fromUser) {
  return new Command(CMD.message, {
    type: MSG_TYPE.text,
    content,
  }, fromUser.id);
}
