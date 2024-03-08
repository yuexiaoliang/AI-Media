<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { PublishedPlatforms } from '@auto-blog/database/npm-packages';

const { copy } = useClipboard();

const pkgName = ref('fs.realpath');

const platforms = ref();
const platform = ref();
async function getPlatforms() {
  const res = await window.ipcRequest.npmPackages('getPublishedPlatformsMap');
  if (!res) return;

  platforms.value = Object.keys(res).map((key) => {
    return { value: key, label: res[key as PublishedPlatforms] };
  });
}

async function getInfo() {
  if (!platform.value?.value) return;

  const res = await window.ipcRequest.npmPackages('getRandomNotPublishedPkg', platform.value.value);
  if (!res) return;

  pkgName.value = res.name;
}

const details = ref<NPMPackagesReturnType<'getArticleFile'> | null>(null);
const getDetails = async () => {
  if (!pkgName.value) return;

  try {
    const res = await window.ipcRequest.npmPackages('getArticleFile', pkgName.value);
    if (!res) return;
    console.log(`🚀 > getDetails > res:`, res);

    details.value = res;
  } catch (error) {
    console.log(`🚀 > getDetails > error:`, error);
  }
};

async function update() {
  if (!pkgName.value) return;

  await window.ipcRequest.englishWords('updateWordRecord', pkgName.value, { xhsPublished: true });

  pkgName.value = '';
  details.value = null;
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
        <a-input v-model="pkgName" class="update-input" />
        <a-button type="primary" long :disabled="!pkgName" style="width: 120px" @click="getDetails">获取包详情</a-button>
        <a-button type="primary" status="warning" @click="copy(pkgName)">复制包名</a-button>
        <a-button type="primary" long :disabled="!pkgName" status="success" style="width: 120px">设置为已发布</a-button>
      </a-button-group>

      <template v-if="pkgName === details?.name">
        <a-button-group v-if="details?.cover" style="width: 100%">
          <a-button type="outline" long disabled>{{ details.cover }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(details.cover)">复制缩略图目录</a-button>
        </a-button-group>

        <a-button-group v-if="details?.title" style="width: 100%">
          <a-button type="outline" long disabled>{{ details.title }}</a-button>
          <a-button type="primary" class="copy-button" @click="copy(details.title)">复制标题</a-button>
        </a-button-group>

        <div v-if="details?.md" class="content-wrap">
          <a-button type="primary" long @click="copy(details.md)">复制正文</a-button>
          <pre>{{ details.md }}</pre>
        </div>
      </template>
    </a-space>
  </div>
</template>

<style lang="scss" scoped>
.npm-packages {
  display: flex;
  justify-content: center;

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

  .copy-button {
    width: 180px;
  }

  .word-info {
    width: 600px;

    .content-wrap {
      width: 100%;

      pre {
        padding: 10px;
        max-height: 300px;
        overflow: auto;
        white-space: pre-wrap;
        border: 1px solid #e8e8e8;
        border-top: 0;
      }
    }
  }
}
</style>
