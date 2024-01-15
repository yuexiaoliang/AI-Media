---
title: "一键寻找可执行文件：Node.js 的 which 工具实践"
tags: ["Node.js", "which", "前端开发"]
desc: "掌握如何在 Node.js 环境中快速定位与执行系统命令，提升开发效率"
pkgName: "which"
---

# 一键寻找可执行文件：Node.js 的 which 工具实践

在 Unix 系统中，`which` 命令非常有用，它能够帮助我们快速定位可执行文件的路径。而当我们转到了 Node.js 开发环境，`which` 依然扮演着重要的角色。让我们通过一个具体的工具包——`node-which`，一起来深入了解并且实践它的强大能力。

## 🛠 如何在 Node.js 中使用 which

`node-which` 包提供了一个简单的方法来模仿 Unix 的 `which` 命令。使用它能帮我们找到指定的可执行文件在 PATH 环境变量中的首个实例。尤其是在我们需要在 Node.js 脚本中调用系统命令时，快速定位到这些命令的路径是非常有用的。

### 异步使用方式

以下示例展现了如何以异步方式使用 `node-which` 来查找 `node` 命令的路径。需要注意的是，如果没有找到可执行文件，`node-which` 会返回一个 rejected 的 promise。

```javascript
const which = require('which');

(async () => {
  try {
    const resolved = await which('node');
    console.log('Node.js path:', resolved);
  } catch (e) {
    console.error('Executable not found:', e);
  }
})();
```

### 同步使用方式

你也可以选择同步的方式来使用 `node-which`。如果指定的命令找不到，同步方法会抛出一个错误。

```javascript
const which = require('which');

try {
  const resolved = which.sync('node');
  console.log('Node.js path:', resolved);
} catch (e) {
  console.error('Executable not found:', e);
}
```

## 🔄 which 参数与选项

`which` 提供了一些参数和选项，使得我们能够根据具体的场景进行定制化的查找。

### 使用 nothrow 选项

使用 `nothrow` 选项，当找不到文件时，可以避免抛出错误。

```javascript
const which = require('which');

// 异步方式，使用 nothrow 选项
which('node', { nothrow: true })
  .then((resolvedOrNull) => {
    if (resolvedOrNull) {
      console.log('Node.js path:', resolvedOrNull);
    } else {
      console.log('Executable not found!');
    }
  });

// 同步方式，使用 nothrow 选项
const resolvedOrNull = which.sync('node', { nothrow: true });
if (resolvedOrNull) {
  console.log('Node.js path:', resolvedOrNull);
} else {
  console.log('Executable not found!');
}
```

### 自定义 PATH 和 PATHEXT

如果需要，你可以通过 `path` 和 `pathExt` 选项来覆盖系统的 PATH 和 PATHEXT 环境变量。

```javascript
const which = require('which');
const someOtherPath = '/custom/path';
const somePathExt = '.EXT';

which('node', { path: someOtherPath, pathExt: somePathExt })
  .then((resolved) => {
    console.log('Custom path Node.js:', resolved);
  }).catch((err) => {
    console.error('Executable not found with custom path', err);
  });
```

## ✔ CLI 使用方式

不仅仅是编程中可以使用 `which`，你还可以通过命令行工具 `node-which` 来完成相同的任务。

### 命令行下的 which

为了在命令行中使用 `which`，可以通过以下方式来启动：

```shell
node-which node
```

这样你就可以看到在命令行环境下，`which` 找到的关于 `node` 命令的路径。

通过使用这个工具，我们能够在 Node.js 开发过程中快速、方便地定位系统命令的路径，极大地提升我们的开发效率和脚本执行的可靠性。

要了解更多细节和功能，可以访问 `node-which` 的 GitHub 仓库：
https://github.com/npm/node-which