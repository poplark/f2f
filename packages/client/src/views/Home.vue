<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Home</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
        <el-button type="text" @click="addRoomVisible = true">
          创建房间
        </el-button>
        <el-table :data="state.rooms" style="width: 100%">
          <el-table-column prop="id" label="#" width="80" />
          <el-table-column prop="name" label="房间名" width="180" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="isOpen" label="公开" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" size="small" @click="getRoomLink(scope.row)">进入</el-button>
              <el-button v-if="state.currentUser.info && scope.row.createUser===state.currentUser.info.id" type="text" size="small" @click="deleteRoom(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-header>
    </el-container>
  </div>
  <el-dialog v-model="addRoomVisible" title="创建房间">
    <el-form :loading="savingRoom" :model="form">
      <el-form-item label="房间名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="公开" :label-width="formLabelWidth">
        <el-select v-model="form.isOpen" placeholder="请选择是否公开">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="房间类型" :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="请选择一个类型">
          <el-option label="纯音频" value="audio" />
          <el-option label="音视频" value="video" />
        </el-select>
      </el-form-item>
      <el-form-item label="房间密码" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开始时间" :label-width="formLabelWidth">
        <el-input v-model="form.startAt" autocomplete="off" />
      </el-form-item>
      <el-form-item label="持续时间" :label-width="formLabelWidth">
        <el-input v-model="form.duration" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addRoomVisible = false">取消</el-button>
        <el-button type="primary" @click="onCreateRoom">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { get, post } from '../utils/service';
import { router } from '../router';
import { currentUser } from '../components/Header/currentUser';

export default {
  components: {},
  name: 'home',
  setup() {
    const state = reactive({
      currentUser: currentUser.state,
      rooms: [{
        id: 1,
        name: 'room1',
      }, {
        id: 2,
        name: 'room2',
      }, {
        id: 3,
        name: 'room3',
      }],
    });

    const formLabelWidth = '80px';
    const form = reactive({
      name: '',
      type: 'video',
      isOpen: false,
      password: '123456',
      startAt: Date.now(),
      duration: 3600,
    });
    const addRoomVisible= ref(false);

    function getRoom() {
      get('/rooms')
        .then((data) => {
          console.log('rooms:: ', data);
          state.rooms = data;
        })
        .catch((err) => {
          console.warn('room:getRooms:: ', err);
        });
    }

    function getRoomLink(room) {
      console.log('ooo router', router, room);
      return router.push({name: 'room', params: { roomId: room.id }});
    }

    const savingRoom = ref(false);
    function onCreateRoom() {
      console.log('onCreateRoom:: ', form);
      console.log('onCreateRoom:: ', addRoomVisible);
      // todo - validate form;
      savingRoom.value = true;
      post('/room', {
        name: form.name,
        isOpen: form.isOpen,
        type: form.type,
        password: form.password,
        startAt: form.startAt,
        duration: form.duration
      }).then((res) => {
        addRoomVisible.value = false;
        // todo - refresh room list
        getRoom();
      }).catch((err) => {
        // todo - show error
      }).finally(() => {
        savingRoom.value = false;
      });
    }

    onMounted(() => {
      getRoom();
    });
    return {
      state,
      formLabelWidth,
      addRoomVisible,
      form,
      savingRoom,
      getRoomLink,
      onCreateRoom,
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
</style>
