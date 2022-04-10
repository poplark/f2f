import { createRouter, createWebHashHistory } from 'vue-router';
import { isLoginSync, isLoginAsync } from '../utils/service';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    beforeEnter(to, from) {
      const _isLogin = isLoginSync();
      if (!_isLogin) {
        return '/login';
      }
    },
  }, {
    path: '/room/:roomId',
    name: 'room',
    component: () => import('../views/Room.vue'),
    beforeEnter(to, from) {
      const _isLogin = isLoginSync();
      if (!_isLogin) {
        return '/login';
      }
    },
  }, {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    beforeEnter() {
      const _isLogin = isLoginSync();
      if (!_isLogin) {
        return '/login';
      }
    },
  }, {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  }, {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    beforeEnter: async function(to, from, next) {
      const _isLogin = await isLoginAsync();
      if (_isLogin) {
        next({name: 'home'});
      } else {
        next();
      }
    },
  }, {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    beforeEnter: async function(to, from, next) {
      const _isLogin = await isLoginAsync();
      if (_isLogin) {
        next({name: 'home'});
      } else {
        next();
      }
    },
  }, {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test.vue'),
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
