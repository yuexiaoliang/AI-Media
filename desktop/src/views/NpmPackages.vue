<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { PublishedPlatforms } from '@auto-blog/database/npm-packages';

const { copy } = useClipboard();

const platforms = ref();
const platform = ref();
async function getPlatforms() {
  const res = await window.ipcRequest.npmPackages('getPublishedPlatformsMap');
  if (!res) return;

  platforms.value = Object.keys(res).map((key) => {
    return { value: key, label: res[key as PublishedPlatforms] };
  });
}

const info = ref<NPMPackagesReturnType<'getRandomNotPublishedPkg'> | null>(null);
async function getInfo() {
  if (!platform.value?.value) return;

  const res = await window.ipcRequest.npmPackages('getRandomNotPublishedPkg', platform.value.value);
  if (!res) return;

  info.value = res;
}

const inputPkg = ref('');
async function update() {
  if (!inputPkg.value) return;

  await window.ipcRequest.englishWords('updateWordRecord', inputPkg.value, { xhsPublished: true });

  info.value = null;
  inputPkg.value = '';
}

async function init() {
  await getPlatforms();
  await getInfo();
}
init();
</script>

<template>
  <div class="npm-packages">
    <a-space class="word-info" direction="vertical">
      <a-button-group style="width: 100%">
        <a-button v-for="item in platforms" :key="item" :type="platform === item ? 'primary' : 'outline'" long @click="platform = item">{{ item.label }}</a-button>
      </a-button-group>

      <a-button size="large" type="primary" :disabled="!platform?.value" long @click="getInfo">挑个 NPM 包</a-button>

      <a-button-group style="width: 100%">
        <a-input v-model="inputPkg" class="update-input" />
        <a-button type="primary" long :disabled="!inputPkg" style="width: 180px" @click="update">设置为已发布</a-button>
      </a-button-group>

      <template v-if="info">
        <a-button-group style="width: 100%">
          <a-button type="outline" long disabled>{{ info.name }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(info.name)">复制包名</a-button>
        </a-button-group>

        <a-button-group style="width: 100%">
          <!-- <a-button type="outline" long disabled>{{ info.cardsDir }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(info.cardsDir)">复制卡片目录</a-button> -->
        </a-button-group>

        <a-button-group style="width: 100%">
          <!-- <a-button type="outline" long disabled>{{ getTitle() }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(getTitle())">复制标题</a-button> -->
        </a-button-group>
      </template>
    </a-space>
  </div>
</template>

<style lang="scss" scoped>
.npm-packages {
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
