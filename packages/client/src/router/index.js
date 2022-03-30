import { createRouter, createWebHashHistory } from 'vue-router';
import { isLoginSync, isLoginAsync } from '../utils/service';

const routes = [
  {
    path: '/',
    // todo 拦截器
    redirect: '/home',
  }, {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
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
