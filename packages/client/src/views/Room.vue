<template>
    <my-header>
      <template v-slot:front>
        <span class="header-front">房间名：{{state.room && state.room.name}}</span>
      </template>
    </my-header>
    <el-container>
      <el-main>
        main
      </el-main>
      <el-aside :class="hideChat?'hide':''">
        <el-icon class="hide-chat-button" @click="onHideChat">
          <svg v-if="hideChat" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"></path></svg>
          <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg>
        </el-icon>
        <chat
          v-if="state.room && state.isLogin"
          :room="state.room"
          :user="state.currentUser.info"
          @chat-join="onChatJoin"
          @chat-leave="onChatLeave"
        />
      </el-aside>
      <el-dialog
        v-model="loginDialogVisible"
        title="房间密码"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        >
        <span>请输入房间密码</span>
        <el-input v-model="state.password"></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              @click="onValidatePassword"
              :disable="!state.room"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-container>
</template>

<script>
import { reactive, watch, ref, onMounted } from 'vue';
import { get, post } from '../utils/service';
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
      password: '',
      isLogin: false,
    });

    const loginDialogVisible = ref(false);

    function getRoom() {
      if (!state.currentUser.info) return;
      get(`/room/${state.roomId}`)
        .then((data) => {
          state.room = data;
          if (state.currentUser.info.id === data.createUser) {
            state.isLogin = true;
          } else if (data.isOpen) {
            state.isLogin = true;
          } else {
            loginDialogVisible.value = true;
          }
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

    function onValidatePassword() {
      post('/room/validation', { roomId: state.room.id, password: state.password })
        .then((res) => {
          if (res.isValidated) {
            loginDialogVisible.value = false;
            state.isLogin = true;
          } else {
            // todo redirect to home page;
            console.warn('密码错误');
          }
        })
        .catch((err) => {
          // todo redirect to home page;
          console.warn('validate password of room failed', err);
        });
    }

    watch(() => state.currentUser.info, (_, oldV) => {
      if (!oldV) {
        getRoom();
      }
    });

    const hideChat = ref(false);
    function onHideChat() {
      hideChat.value = !hideChat.value;
    }

    onMounted(() => {
      getRoom();
    });
    return {
      state,
      loginDialogVisible,
      onChatJoin,
      onChatLeave,
      onValidatePassword,
      hideChat,
      onHideChat,
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
.el-aside {
  position: relative;
  transition-property: width;
  transition-duration: .5s;
  transition-timing-function: ease-in;
  overflow: visible;
}
.el-aside.hide {
  width: 0px;
}
.hide-chat-button {
  position: absolute;
  left: -16px;
  top: 50%;
  padding: 6px 0;
  border: 1px solid #ccc;
  border-right: 0;
  cursor: pointer;
}
</style>
