<template>
<div>
  <el-tabs v-if="state.isJoined" type="border-card" v-model="activeName" class="chat-room" @tab-click="handleSwitchTab">
    <el-tab-pane label="用户列表" name="first" :key="state.userUpdateTimestamp">
      <div class="user" v-for="user in getUsers()" :key="user.id">
        {{user.username}}
        <div class="operate">
          <el-button @click="onMic(user)">上麦</el-button>
          <el-button @click="onKickOut(user)">踢出</el-button>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="消息" name="second" :key="state.messageUpdateTimestamp">
      <div :class="computeClass(state.user, message)" v-for="(message, index) in getMessages()" :key="index">
        <div class="user">
          <span time="username">{{message.username}}</span>
          <span class="time">{{formatTimestamp(message.timestamp)}}</span>
        </div>
        <div class="content">
          {{message.content}}
        </div>
      </div>
      <el-input v-model="state.message" @keyup.enter="onSendMsg"></el-input>
    </el-tab-pane>
  </el-tabs>
  <el-button @click="onJoin">join</el-button>
  <el-button @click="onLeave">leave</el-button>
  <el-button @click="onSendMsg">send message</el-button>
  <el-button @click="onKickOut">kick out</el-button>
</div>
</template>

<script>
import { ref, reactive, getCurrentInstance, onMounted, onUpdated, onBeforeUnmount } from 'vue';
import { createInstance } from '@f2f/im-client';

export default {
  props: {
    room: {
      default: ''
    },
    user: {
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      user: props.user,
      choose: null,
      message: '',
      isJoined: false,
      userUpdateTimestamp: 0,
      messageUpdateTimestamp: 0,
    });
    let chat = null;
    let {ctx:internalInstance} = getCurrentInstance();

    const activeName = ref('first');
    const handleSwitchTab = (tab, event) => {
      console.log(tab, event)
    }

    function onJoin() {
      const { user } = state;
      if (chat || !props.room) return;
      chat = createInstance(user.id, user.username, 'token');
      chat.join(props.room).then((res) => {
        console.log('onJoin:::: ', res);
        state.isJoined = true;
      });
      chat.on('user-online', (user) => {
        console.log('on::user-online:::: ', user, internalInstance);
        // internalInstance.$forceUpdate();
        state.userUpdateTimestamp = Date.now();
      });
      chat.on('user-offline', (user) => {
        console.log('on::user-offline:::: ', user);
        // internalInstance.$forceUpdate();
        state.userUpdateTimestamp = Date.now();
      });
      chat.on('ban', (reason) => {
        console.log('on::ban:::: ', reason);
        chat = null;
        state.isJoined = false;
      });
      chat.on('message', (message) => {
        console.log('on::message:::: ', message);
        // internalInstance.$forceUpdate();
        state.messageUpdateTimestamp = Date.now();
      });
    }
    function onLeave() {
      chat.leave().then((res) => {
        console.log('onLeave:::: ', res);
        chat = null;
        state.isJoined = false;
      });
    }

    function onSendMsg() {
      if (!state.message || !chat) return;
      chat.sendMessage(state.message).then((res) => {
        console.log('send message succeed', res);
        state.message = '';
      }).catch(err => {
        console.log('send message failed', err);
      });
    }

    function onKickOut(user) {
      chat.kickOut(user).then(() => {
        console.log('kick out user succeed');
      }).catch(err => {
        console.log('kick out user failed', err);
      });
    }

    function onChooseUser(user) {
      state.choose = user;
    }

    function computeClass(user, message) {
      return user.id === message.userId ? 'message myself' : 'message';
    }
    function formatTimestamp(timestamp) {
      const now = new Date();
      const time = new Date(timestamp);
      if (now.toDateString() !== time.toDateString()) {
        return time.toLocaleString();
      } else {
        return time.toLocaleTimeString();
      }
    }

    function getUsers() {
      return chat ? chat.users : [];
    }
    function getMessages() {
      return chat ? chat.messages : [];
    }

    onMounted(() => {
      console.log('onMounted::', state.user);
    });
    onUpdated(() => {
      console.log('onUpdated::', state.user);
    });
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount::', state.user);
    });

    return {
      activeName,
      handleSwitchTab,
      state,
      onJoin,
      onLeave,
      onSendMsg,
      onKickOut,
      onChooseUser,
      computeClass,
      formatTimestamp,
      getUsers,
      getMessages,
    }
  },
}
</script>

<style scoped>
.chat-room {
  max-width: 400px;
}
.user {
  border-bottom: 1px;
}
.user .operate {
  display: inline-block;
}
.message {
  margin: 10px 0;
}
.message.myself {
  text-align: right;
}
.message .user {
  margin-bottom: 6px;
  font-size: 12px;
}
.message .user .username {
  color: #333;
}
.message .user .time {
  margin-left: 6px;
  color: #999;
}
.message .content {
  display: inline-block;
  padding: 6px 8px;
  border: 1px;
  border-radius: 6px;
  background-color: #eee;
  text-align: left;
}
.message.myself .content {
  background-color: #A7E879;
}

</style>