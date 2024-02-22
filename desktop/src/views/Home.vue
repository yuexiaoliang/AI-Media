<script setup lang="ts">
window.ipcRenderer.send('send-test', { abc: 123 });

window.ipcRequest('invoke-test', 'a').then((val) => {
  console.log(`🚀 > val:`, val);
});
</script>

<template>
  <div class="home-page">home-page</div>
</template>

<style lang="scss" scoped>
.home-page {
}
</style>
