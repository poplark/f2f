<template>
<div class="chat-room">
  <span>{{state.user.username}}</span>
  <el-button @click="onJoin">join</el-button>
  <el-button @click="onLeave">leave</el-button>
  <el-button @click="onSendMsg">send message</el-button>
</div>
</template>

<script>
import { reactive, onMounted } from 'vue';
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
    });

    function onJoin() {
      const { user } = state;
      state.chat = createInstance(user.id, user.username, 'token');
      console.log('chat:::: ', state.chat);
      state.chat.join('room-test').then((res) => {
        console.log('onJoin:::: ', res);
      });
    }
    function onLeave() {
      state.chat.leave().then((res) => {
        console.log('onLeave:::: ', res);
      });
    }

    function onSendMsg() {
      state.chat.sendMessage('hello f2f').then((res) => {
        console.log('onSendMsg:::: ', res);
      });
    }

    return {
      state,
      onJoin,
      onLeave,
      onSendMsg,
    }
  },
}
</script>

<style>
</style>
