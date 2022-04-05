const CMD = {
  join: 'join',
  leave: 'leave',
  kickOut: 'kick-out',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

export class Command {
  // action
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
    this.payload = payload;
    this.from = from;
    this.to = to ? to : '@all';
  }

  // todo - use toJSON
  toJSON() {
    return {
      action: this.action,
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
  }, user.id);
}

/**
 * 离开房间
 * @param {*} roomId 
 * @param {*} user 
 * @returns 
 */
export function createLeaveCommand(roomId, user) {
  return new Command(CMD.leave, {
    roomId,
    userId: user.id,
  }, user.id);
}

/**
 * 踢出用户
 * @param {*} roomId 
 * @param {*} adminUser 
 * @param {*} outUser 
 * @returns 
 */
export function createKickOutCommand(roomId, adminUser, outUser) {
  return new Command(CMD.kickOut, {
    roomId,
    userId: outUser.id,
  }, adminUser.id, outUser.id);
}

/**
 * 请求上麦
 * @param {*} roomId 
 * @param {*} user 
 */
export function createAskMicCommand(roomId, user) {
  return new Command(CMD.askMic, {
    roomId,
    userId: user.id,
  }, user.id); // todo - 管理员？？？后台自动确认
}

/**
 * 允许上麦
 * @param {*} roomId 
 * @param {*} adminUser 
 * @param {*} onMicUser 
 * @returns 
 */
export function createOnMicCommand(roomId, adminUser, onMicUser) {
  return new Command(CMD.onMic, {
    roomId,
    userId: onMicUser.id,
  }, adminUser.id, onMicUser.id);
}

/**
 * 强制下麦
 * @param {*} roomId 
 * @param {*} adminUser 
 * @param {*} offMicUser 
 * @returns 
 */
export function createOffMicCommand(roomId, adminUser, offMicUser) {
  return new Command(CMD.offMic, {
    roomId,
    userId: offMicUser.id,
  }, adminUser.id, offMicUser.id);
}
