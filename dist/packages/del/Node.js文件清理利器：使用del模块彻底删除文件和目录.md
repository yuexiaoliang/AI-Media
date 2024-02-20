---
title: "Node.js文件清理利器：使用del模块彻底删除文件和目录"
tags: ["Node.js", "文件系统", "del模块", "编程"]
desc: "本文详细介绍如何使用del模块进行高效、安全地文件和目录删除操作，为Node.js项目的文件管理提供有力工具。"
pkgName: "del"
---

# Node.js文件清理利器：使用del模块彻底删除文件和目录

文件清理在开发过程中是一个常见且必要的步骤。无论是删除临时文件、构建产物还是清空日志，合适的工具能够提高效率，降低出错概率。今天，我们要介绍的`del`模块，是Node.js生态中不可或缺的文件删除工具，它提供了简单而强大的API，用于安全地删除文件和目录。

## 📂 安装del模块

```bash
npm install del
```

在开始使用`del`之前，您需要安装它作为您项目的依赖项。

## 🌟 如何使用del模块删除文件

```javascript
// 引入del模块
import { deleteAsync } from 'del';

// 异步删除匹配'*.js'的文件，排除'unicorn.js'
const deletedFilePaths = await deleteAsync(['temp/*.js', '!temp/unicorn.js']);

// 打印出被删除的文件路径
console.log('Deleted files:\n', deletedFilePaths.join('\n'));
```

在这个例子中，我们导入了`deleteAsync`函数，并且使用了`await`来等待删除操作完成。通过数组的形式，我们可以一次性指定多个匹配模式或者排除特定的文件。

## 🚫 注意事项

当使用glob模式`**`时，它不仅匹配所有子目录和文件，也包括父目录。

```javascript
import { deleteSync } from 'del';

// 不正确的使用方式，会尝试删除'public/assets'本身
deleteSync(['public/assets/**', '!public/assets/goat.png']);

// 正确的方式，排除了父目录和特定文件
deleteSync(['public/assets/**', '!public/assets', '!public/assets/goat.png']);
```

在这个例子中，我们通过在排除模式中显式添加父目录，保证了不会删除目录本身。

## 🚀 API使用示例

### 删除文件并返回路径数组

```javascript
// 异步删除文件，返回包含删除文件路径的数组
import { deleteAsync } from 'del';

(async () => {
  const deletedPaths = await deleteAsync(['temp/*.js'], {dryRun: true});
  console.log('Files and directories that would be deleted:\n', deletedPaths.join('\n'));
})();
```

`dryRun`选项允许您在不实际删除文件的情况下查看哪些文件将被删除。这对于测试和验证模式匹配是否正确是非常有用的。

### 控制并发数

```javascript
// 设置并发限制为5，逐一删除文件
import { deleteAsync } from 'del';

await deleteAsync('temp/*.js', {concurrency: 5});
```

在删除大量文件时，您可以通过`concurrency`选项设置并发限制，防止同时打开过多文件句柄。

### 进度反馈

```javascript
// 删除文件时获取进度反馈
import { deleteAsync } from 'del';

await deleteAsync(patterns, {
  onProgress: progress => {
    console.log(`${progress.percent * 100}% completed`);
  }
});
```

每次文件或目录被删除后，`onProgress`回调函数将被触发，您可以利用它来监控删除进度。

> 仓库地址：https://github.com/sindresorhus/del

通过以上介绍和示例，您应该对如何使用`del`模块有了全面的了解。该模块的简洁而强大的API使得Node.js中的文件删除变得既简单又安全。无论是开发环境的清理还是生产环境的文件管理，`del`都是您可靠的伴侣。