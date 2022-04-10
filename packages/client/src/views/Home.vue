<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Home</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
        <router-link v-for="room in state.rooms" :key="room.id" :to="getRoomLink(room)">
          {{room.name}} |
        </router-link>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get } from '../utils/service';

export default {
  components: {},
  name: 'home',
  setup() {
    const state = reactive({
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
      return `/room/${room.name}`;
    }

    onMounted(() => {
      getRoom();
    });
    return {
      state,
      getRoomLink,
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
</style>
