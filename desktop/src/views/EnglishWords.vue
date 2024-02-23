<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

const { copy } = useClipboard();
const word = ref<EnglishWordsReturnType<'getNotPublishedXhsWord'>>();

const getWord = async () => {
  const res = await window.ipcRequest.englishWords('getNotPublishedXhsWord', 'aaa');
  word.value = res;
  copy(word.value.dir);
};
</script>

<template>
  <div class="home-page">
    <a-button size="large" type="primary" @click="getWord">挑个单词</a-button>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  text-align: center;
}
</style>
