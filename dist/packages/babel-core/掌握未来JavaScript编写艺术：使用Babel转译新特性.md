---
title: "掌握未来JavaScript编写艺术：使用Babel转译新特性"
tags: [JavaScript, Babel, 转译, ES2020]
desc: "本文详细介绍了如何使用Babel将现代JavaScript代码转译为向后兼容的版本，让您无需等待浏览器的支持立即使用最新特性。"
pkgName: "@babel/core"
---

# 掌握未来JavaScript编写艺术：使用Babel转译新特性

当遇到现代浏览器还不支持的JavaScript新特性时，`@babel/core` 将是你的得力助手。本文将引导您完成从安装到实践的整个过程，领略 Babel 如何优雅地将 ES2020 及更高版本的代码转译为那些老旧浏览器也能理解的格式。

## 🚚 安装 Babel

在开始前，请确保你已经安装了 Node.js 和 npm。首先，创建一个新的项目文件夹，并初使化 npm：

```bash
mkdir my-babel-project
cd my-babel-project
npm init -y
```

然后，您可以使用 npm 安装 `@babel/core` 和所需的插件或预设：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

## 🛠 配置 Babel

安装完毕后，创建一个 `.babelrc` 或 `babel.config.json` 文件来配置 Babel。这里我们使用 `@babel/preset-env`，它允许您使用最新的 JavaScript 不用担心向后兼容性问题。

```json
{
  "presets": ["@babel/preset-env"]
}
```

## 🧪 转译 JavaScript 代码

现在，让我们看看如何将一个使用了 ES2020 中的空值合并操作符 `??` 的函数转译为兼容旧版 JavaScript 的代码。

**输入代码** (`input.js`):

```javascript
// 我们使用了ES2020中的空值合并操作符
function greet(input) {
  return input ?? "Hello world";
}
```

接下来，通过下面的命令转译该文件：

```bash
npx babel input.js --out-file output.js
```

**输出代码** (`output.js`):

```javascript
function greet(input) {
  return input !== null && input !== void 0 ? input : "Hello world";
}
```

转译后的代码将能够在那些不支持 ES2020 中 `??` 操作符的老旧环境中运行。

## 📘 编写兼容性代码

在更复杂的开发过程中，你可能会用到更多令人兴奋的新特性。比如，你可能会用到 ES6 的解构赋值或者 ES7 的装饰器。Babel 可以帮助你把这些代码转译成老版本的 JavaScript。

假设你有以下的 ES6 代码：

```javascript
const [first, ...rest] = [1, 2, 3, 4];
console.log(first); // 输出: 1
console.log(rest);  // 输出: [2, 3, 4]
```

使用 Babel 转译会得到如下结果：

```javascript
var _slice = Array.prototype.slice;
var first = [1, 2, 3, 4][0];
var rest = _slice.call([1, 2, 3, 4], 1);

console.log(first); // 输出: 1
console.log(rest);  // 输出: [2, 3, 4]
```

通过上述示例，可以看到 Babel 如何将现代的 JavaScript 代码转译为广泛兼容的语法。

## 📖 结语

Babel是一个强大的工具，可以让开发者尽情使用最新的JavaScript特性，同时确保代码的广泛兼容性。通过简单的配置和转译过程，项目就可以支持那些并未实现最新ECMAScript标准的环境，无疑为开发者提供了极大的便利性和前瞻性。

> 仓库地址：https://github.com/babel/babel

快去尝试将你的项目引入未来吧，让 Babel 成为你通向现代 JavaScript 世界的桥梁！