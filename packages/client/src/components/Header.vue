<template>
<div class="header">
  <el-row :gutter="10">
    <el-col :span="4">
      <slot name="front"></slot>
    </el-col>
    <el-col :span="16">
      <slot name="middle"></slot>
    </el-col>
    <el-col :span="4" class="setting">
      <slot name="end"></slot>
      <el-dropdown>
        <el-avatar :size="30"> {{shortName}} </el-avatar>
        <el-icon><caret-bottom /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onProfile">个人资料</el-dropdown-item>
            <el-dropdown-item @click="onAbout">关于</el-dropdown-item>
            <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get, logout } from '../utils/service';
import { router } from '../router';
import { CaretBottom } from '@element-plus/icons-vue';

export default {
  components: {
    'caret-bottom': CaretBottom,
  },
  setup() {
    const user = reactive({
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      username: '',
      loading: false,
      error: null,
    });

    function getUser() {
      user.loading = true;
      get('/user')
        .then((data) => {
          user.username = data.username;
        })
        .catch((err) => {
          user.error = err;
        })
        .finally(() => {
          user.loading = false;
        });
    }
    function onProfile() {
      router.push({name: 'profile'});
    }

    function onAbout() {
      router.push({name: 'about'});
    }

    function onLogout() {
      logout();
      router.push({name: 'login'});
    }

    onMounted(getUser);
    return {
      user,
      onProfile,
      onAbout,
      onLogout,
    }
  },
  computed: {
    shortName() {
      return this.user.username.length > 2 ? this.user.username.substring(0, 1) : this.user.username;
    }
  }
}
</script>

<style scoped>
.header {
  padding: 4px 8px;
  background-color: #409EFF;
  color: #fff;
}
.header .setting {
  text-align: right;
  cursor: pointer;
}
</style>
