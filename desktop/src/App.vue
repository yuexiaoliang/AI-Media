<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { rootRoutes } from '@/router';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <nav class="nav-list">
    <a-space>
      <a-button class="nav-list__item" v-for="nav in rootRoutes" :key="nav.name" :type="route.name === nav.name ? 'primary' : 'outline'" @click="router.push({ name: nav.name })">{{ nav.name }}</a-button>
    </a-space>
  </nav>

  <main class="main">
    <router-view></router-view>
  </main>
</template>

<style lang="scss" scoped>
.nav-list {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.main {
  padding: 20px;
}
</style>
