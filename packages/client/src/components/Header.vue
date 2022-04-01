<template>
<div class="page-header">
  <el-row :gutter="10">
    <el-col :span="4" class="home" @click="onGoHome">
      <slot name="front"></slot>
    </el-col>
    <el-col :span="16">
      <slot name="middle"></slot>
    </el-col>
    <el-col :span="4" class="setting">
      <slot name="end"></slot>
      <el-dropdown v-if="user.isLogin">
        <el-avatar :size="30"> {{user.shortName || '&nbsp;'}} </el-avatar>
        <el-icon><caret-bottom/></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onProfile">个人资料</el-dropdown-item>
            <el-dropdown-item @click="onAbout">关于</el-dropdown-item>
            <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else class="about" type="text" @click="onAbout">关于</el-button>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue';
import { get, logout, isLoginSync } from '../utils/service';
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
      shortName: computed(() => user.username.length > 2 ? user.username.substring(0, 1) : user.username),
      loading: false,
      error: null,
      isLogin: isLoginSync(),
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

    function onGoHome() {
      router.push({name: 'home'});
    }

    onMounted(() => {
      if (user.isLogin) {
        getUser();
      }
    });
    return {
      user,
      onProfile,
      onAbout,
      onLogout,
      onGoHome,
    }
  },
}
</script>

<style>
.page-header {
  padding: 4px 8px;
  height: 30px;
  background-color: #409EFF;
  color: #fff;
}
.page-header .home {
  cursor: pointer;
}
.page-header .header-front,
.page-header .header-middle,
.page-header .header-end {
  line-height: 30px;
}
.page-header .setting {
  text-align: right;
  cursor: pointer;
}
.page-header .setting .about {
  color: #eee;
}
.page-header .setting .about:hover {
  color: #fff;
}
</style>
