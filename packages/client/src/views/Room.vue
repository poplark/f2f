<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">房间名：{{state.room && state.room.name}}</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
        <chat
          v-if="state.room && state.currentUser.info"
          :room="state.roomId"
          :user="state.currentUser.info"
          @chat-join="onChatJoin"
          @chat-leave="onChatLeave"
        />
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get } from '../utils/service';
import Chat from '../components/Chat.vue';
import { useRouter, useRoute } from 'vue-router';
import { currentUser } from '../components/Header/currentUser';

export default {
  components: {
    'chat': Chat,
  },
  name: 'room',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      currentUser: currentUser.state,
      roomId: route.params.roomId,
      room: null,
    });

    function getRoom() {
      get(`/room/${state.roomId}`)
        .then((data) => {
          state.room = data;
        })
        .catch((err) => {
          console.warn('home::getUser:: ', err);
        });
    }

    function onChatJoin() {
      console.log('chat joined');
    }
    function onChatLeave() {
      console.log('chat leaved');
      router.replace({name: 'home'});
    }

    onMounted(() => {
      getRoom();
    });
    return {
      state,
      onChatJoin,
      onChatLeave,
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
</style>
