<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        Home

        <el-dropdown>
          <span class="el-dropdown-link">
            <span v-if="state.user">{{state.user.username}}</span>
            <el-avatar v-loading="!state.user" shape="square" :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onProfile">个人资料</el-dropdown-item>
              <el-dropdown-item @click="onAbout">关于</el-dropdown-item>
              <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get, logout } from '../utils/service';
import { router } from '../router';

export default {
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
          console.warn('home failed', err);
          router.replace('/login');
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

    onMounted(() => {
      getUser()
    });
    return {
      state,
      onProfile,
      onAbout,
      onLogout,
    }
  },
};
</script>
