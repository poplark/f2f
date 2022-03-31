<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Home</span>
      </template>
    </my-header>
    <el-container>
      <el-header>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import { onMounted } from 'vue';

export default {
  components: {
    'my-header': Header,
  },
  name: 'home',
  setup() {

    onMounted(() => {
      console.log('home mounted::');
    });
    return {}
  },
};
</script>

<style scoped>
.header-front {
  line-height: 30px;
}
</style>
