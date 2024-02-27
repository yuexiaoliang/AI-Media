<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

const { copy } = useClipboard();

const word = ref<EnglishWordsReturnType<'getNotPublishedXhsWord'>>();

const getTitle = () => {
  const d = '看呀~';

  if (!Array.isArray(word.value?.data)) return d;

  const list = word.value?.data?.find((item) => {
    return item.title?.includes?.('小贴士');
  })?.content;

  if (!Array.isArray(list)) return d;

  return list[0];
};

const getWord = async () => {
  const res = await window.ipcRequest.englishWords('getNotPublishedXhsWord');
  word.value = res;
  getTitle();
};

getWord();
</script>

<template>
  <div class="english-words">
    <a-space class="word-info" direction="vertical">
      <a-button size="large" type="primary" long @click="getWord">挑个单词</a-button>

      <template v-if="word">
        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ word.word }}</a-button>
          <a-button type="primary" class="copy-button">复制单词</a-button>
        </a-button-group>

        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ word.cardsDir }}</a-button>
          <a-button type="primary" class="copy-button">复制卡片目录</a-button>
        </a-button-group>

        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ getTitle() }}</a-button>
          <a-button type="primary" class="copy-button">复制标题</a-button>
        </a-button-group>
      </template>
    </a-space>
  </div>
</template>

<style lang="scss" scoped>
.english-words {
  text-align: center;

  .copy-button {
    width: 180px;
  }
}
</style>
