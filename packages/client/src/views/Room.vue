<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Home</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
        <chat v-if="state.user" :room="state.roomId" :user="state.user"/>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get } from '../utils/service';
import Chat from '../components/Chat.vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    'chat': Chat,
  },
  name: 'room',
  setup() {
    const x = useRoute();
    console.log('rrrrrrrrrrr', x);
    const state = reactive({
      user: null,
      roomId: x.params.roomId,
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
