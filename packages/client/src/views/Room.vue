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
      <el-aside>
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

    onMounted(() => {
      getRoom();
    });
    return {
      state,
      loginDialogVisible,
      onChatJoin,
      onChatLeave,
      onValidatePassword,
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
.el-aside {
  overflow: hidden;
}
</style>
