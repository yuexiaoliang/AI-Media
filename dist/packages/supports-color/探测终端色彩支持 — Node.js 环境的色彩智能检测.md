---
title: 探测终端色彩支持 — Node.js 环境的色彩智能检测
tags: [Node.js, 前端工具, 终端色彩, supports-color]
desc: 对于想要让终端输出更具吸引力的开发者来说，supports-color 是一个检测终端色彩支持的实用工具包。
pkgName: supports-color
---

# 探测终端色彩支持 — Node.js 环境的色彩智能检测

在开发命令行工具时，利用色彩提升用户体验是很常见的需求。`supports-color` 包为你的 Node.js 应用检测终端是否支持色彩，及其支持等级。这篇指南将带你快速上手 `supports-color`，打造一个色彩丰富的终端应用。

## 🎨 安装 `supports-color`

```bash
$ npm install supports-color
```

首先，通过上述命令将 `supports-color` 添加到你的项目中。

## 🖥️ 如何使用 `supports-color`

接下来，让我们来看看如何在实际的项目中应用它：

```javascript
// 引入 supports-color 模块
import supportsColor from 'supports-color';

// 检测标准输出是否支持色彩
if (supportsColor.stdout) {
	console.log('Terminal stdout supports color');
}

// 进一步检查是否支持 256 色
if (supportsColor.stdout.has256) {
	console.log('Terminal stdout supports 256 colors');
}

// 检验是否支持 1600 万色（真彩色）
if (supportsColor.stderr.has16m) {
	console.log('Terminal stderr supports 16 million colors (truecolor)');
}
```

这些代码片段可以直接应用在你的应用程序中，助你根据终端的支持度调整输出色彩。

## 🛠️ API 使用详解

`supports-color` 提供了一个主要对象，包含两个属性：`stdout` 和 `stderr`。这两个属性都是个对象，或者在不支持色彩时为 `false`。

**stdout/stderr 对象：**

```javascript
// stdout/stderr 对象属性示例
{
  level: 2, // 色彩支持的级别
  has256: true, // 支持 256 色
  // 其他属性...
}
```

属性及含义：

- `.level = 1` 和 `.hasBasic = true`：基础色彩支持（16色）
- `.level = 2` 和 `.has256 = true`：256 色彩支持
- `.level = 3` 和 `.has16m = true`：真彩色支持（1600 万色）

### 🗂️ 自定义实例

```javascript
// 引入 createSupportsColor 来自 supports-color
import { createSupportsColor } from 'supports-color';

// 创建一个自定义的颜色支持实例
const stdoutSupportsColor = createSupportsColor(process.stdout);

// 使用该实例进行色彩支持检测
if (stdoutSupportsColor) {
	console.log('Terminal stdout supports color');
}
// `stdoutSupportsColor` 的结果等同于 `supportsColor.stdout`
```

### 🏳️‍🌈 强制色彩和 CLI 标志

`supports-color` 遵循 `--color` 和 `--no-color` 命令行标志。

如果不能使用 `--color`，可以设置环境变量比如 `FORCE_COLOR=1` 来强制启用基本色彩支持。

使用 `--color=256` 和 `--color=16m` 可以分别启用 256 色和真彩色模式。

## 📦 相关资源

这里还有一些与 `supports-color` 相关的资源：

- [supports-color-cli](https://github.com/chalk/supports-color-cli): 此模块的命令行界面
- [chalk](https://github.com/chalk/chalk): 终端字符串样式处理工具
- [is-unicode-supported](https://github.com/sindresorhus/is-unicode-supported): 检测终端是否支持 Unicode
- [is-interactive](https://github.com/sindresorhus/is-interactive): 检验 stdout 或 stderr 是否为交互模式

希望本文能帮助你清晰地理解和使用 `supports-color`，让你的 Node.js 应用终端输出变得更加色彩缤纷！

> 仓库地址：https://github.com/chalk/supports-color