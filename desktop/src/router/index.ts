import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '@/views/Home.vue';

export const rootRoutes = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },

  {
    name: 'EnglishWords',
    path: '/english-words',
    component: () => import('@/views/EnglishWords.vue')
  },

  {
    name: 'NpmPackages',
    path: '/npm-packages',
    component: () => import('@/views/NpmPackages.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...rootRoutes]
});

export default router;
