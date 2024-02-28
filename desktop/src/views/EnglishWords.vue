<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

const { copy } = useClipboard();

const word = ref<EnglishWordsReturnType<'getNotPublishedXhsWord'> | null>(null);

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
  if (!res) return;

  word.value = res;
  getTitle();
};

const inputWord = ref('');

const update = async () => {
  if (!inputWord.value) return;

  await window.ipcRequest.englishWords('updateWordRecord', inputWord.value, { xhsPublished: true });

  word.value = null;
  inputWord.value = '';
};
</script>

<template>
  <div class="english-words">
    <a-space class="word-info" direction="vertical">
      <a-button size="large" type="primary" long @click="getWord">挑个单词</a-button>
      <a-input v-model="inputWord" class="update-input">
        <template #append>
          <a-button type="primary" long :disabled="!inputWord" @click="update">设置为已发布</a-button>
        </template>
      </a-input>

      <template v-if="word">
        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ word.word }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(word.word)">复制单词</a-button>
        </a-button-group>

        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ word.cardsDir }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(word.cardsDir)">复制卡片目录</a-button>
        </a-button-group>

        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ getTitle() }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(getTitle())">复制标题</a-button>
        </a-button-group>
      </template>
    </a-space>
  </div>
</template>

<style lang="scss" scoped>
.english-words {
  text-align: center;

  .update-input {
    :deep(.arco-input-append) {
      padding: 0;
      border: 0;

      .arco-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  .word-info {
    width: 600px;
  }

  .copy-button {
    width: 180px;
  }
}
</style>
