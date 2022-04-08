<template>
<div class="chat-room">
  <div v-if="state.chat">
    <div >
      <h2>消息</h2>
      <div v-for="(message, index) in state.chat.messages" :key="index">
        [{{message.username}}@{{formatTimestamp(message.timestamp)}}]: {{message.content}}
      </div>
    </div>
    <div>
      <h2>用户</h2>
      <div @click="onChooseUser(user)" v-for="user in state.chat.users" :key="user.id">
        {{user.username}}
      </div>
    </div>
  </div>
  <el-button @click="onJoin">join</el-button>
  <el-button @click="onLeave">leave</el-button>
  <el-input v-model="state.message" @keyup.enter="onSendMsg"></el-input>
  <el-button @click="onSendMsg">send message</el-button>
  <el-button @click="onKickOut">kick out</el-button>
</div>
</template>

<script>
import { reactive, getCurrentInstance, onMounted, onUpdated, onBeforeUnmount } from 'vue';
import { createInstance } from '@f2f/im-client';

export default {
  props: {
    user: {
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      user: props.user,
      chat: null,
      choose: null,
      message: ''
    });
    let {ctx:internalInstance} = getCurrentInstance();

    function onJoin() {
      const { user, chat } = state;
      if (chat) return;
      state.chat = createInstance(user.id, user.username, 'token');
      console.log('chat:::: ', state.chat);
      window.p = state.chat;
      state.chat.join('room-test').then((res) => {
        console.log('onJoin:::: ', res);
      });
      state.chat.on('user-online', (user) => {
        console.log('on::user-online:::: ', user, internalInstance);
        internalInstance.$forceUpdate();
      });
      state.chat.on('user-offline', (user) => {
        console.log('on::user-offline:::: ', user);
        internalInstance.$forceUpdate();
      });
      state.chat.on('ban', (reason) => {
        console.log('on::ban:::: ', reason);
      });
      state.chat.on('message', (message) => {
        console.log('on::message:::: ', message);
        internalInstance.$forceUpdate();
      });
    }
    function onLeave() {
      state.chat.leave().then((res) => {
        console.log('onLeave:::: ', res);
      });
    }

    function onSendMsg() {
      if (!state.message) return;
      state.chat.sendMessage(state.message).then((res) => {
        console.log('onSendMsg:::: ', res);
        state.message = '';
      });
    }

    function onKickOut() {
      if (!state.choose) return;
      state.chat.kickOut(state.choose).then((res) => {
        console.log('onKickOut:::: ', res);
      });
    }

    function onChooseUser(user) {
      state.choose = user;
    }

    function formatTimestamp(timestamp) {
      return new Date(timestamp);
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
      state,
      onJoin,
      onLeave,
      onSendMsg,
      onKickOut,
      onChooseUser,
      formatTimestamp,
    }
  },
  computed: {
    users: function() {
      console.log('computed::users::', this.state.chat.users);
      this.state.chat.users;
    },
    messages: function() {
      console.log('computed::messages::', this.state.chat.users);
      this.state.chat.messages;
    }
  }
}
</script>

<style>
</style>
