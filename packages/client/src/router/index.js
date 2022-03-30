import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    // todo 拦截器
    redirect: '/home',
  }, {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
  }, {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  }, {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  }, {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
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
