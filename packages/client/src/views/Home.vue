<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Home</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
        <room v-if="state.user" :user="state.user"/>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get } from '../utils/service';
import Room from '../components/Chat/Room.vue';

export default {
  components: {
    'room': Room,
  },
  name: 'home',
  setup() {
    const state = reactive({
      user: null,
    });

    function getUser() {
      get('/user')
        .then((data) => {
          state.user = data;
        })
        .catch((err) => {
          console.warn('home::getUser:: ', err);
        });
    }

    onMounted(() => {
      getUser();
    });
    return {
      state
    }
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
</style>
