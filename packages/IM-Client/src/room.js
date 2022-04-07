class Room {
  // id
  // users
  // messages
  constructor(id) {
    this.id = id;
    this.users = [];
    this.messages = [];
  }

  addUser(user) {
    const idx = this.users.findIndex((user) => user.id === userId);
    if (idx >= 0) {
      return false;
    } else {
      this.users.push(user);
    }
    return true;
  }
  removeUser(userId) {
    let res;
    const idx = this.users.findIndex((user) => user.id === userId);
    if (idx >= 0) {
      [ res ] = this.users.splice(idx, 1);
    }
    return res;
  }

  pushMessage(msg) {
    let len = this.messages.length;
    if (len < 1) {
      this.messages.push(msg);
    } else {
      for (let i=len-1; i>=0; i--) {
        const item = this.messages[i];
        if (item.timestamp < msg.timestamp) {
          this.messages.splice(i+1, 0, msg);
          break;
        }
        if (i === 0) {
          this.messages.splice(i, 0, msg);
        }
      }
    }
  }
}


export {
  Room
}
