---
title: 以毫秒为中心：利用ms包高效转换时间格式
tags: [Node.js, 时间处理, ms包, 编程, 前端开发]
desc: 探索如何使用ms包将各种时间单位轻松转换为毫秒，适用于Node.js和浏览器环境。
pkgName: ms
---

# 以毫秒为中心：利用ms包高效转换时间格式

轻松地在字符串和毫秒之间进行转换是许多应用程序的基本需求。本文针对 `ms` 包提供了一个实用指南，展示了如何在JavaScript中高效地处理时间。

## 🕒 快速开始

在开始之前，你需要确保已经通过 `npm` 安装了 `ms` 包：

```bash
npm install ms
```

## 🛠️ 使用示例

这里是一些使用 `ms` 进行时间转换的基础示例。

### 字符串转换为毫秒

```javascript
const ms = require('ms');

// 将天数转换为毫秒
console.log(ms('2 days'));  // 输出：172800000

// 将小时转换为毫秒
console.log(ms('10h'));     // 输出：36000000

// 支持负数，表示过去的时间
console.log(ms('-1h'));     // 输出：-3600000
```

### 从毫秒转换回字符串

```javascript
const ms = require('ms');

// 从毫秒转换回简短的时间字符串
console.log(ms(60000));             // 输出："1m"
console.log(ms(ms('10 hours')));    // 输出："10h"

// 开启{ long: true }选项，以完整的单词形式输出
console.log(ms(60000, { long: true }));            // 输出："1 minute"
console.log(ms(ms('10 hours'), { long: true }));   // 输出："10 hours"
```

### 使用TypeScript的类型安全

TypeScript用户可以享受到完整的类型安全。

```typescript
import ms, { StringValue } from 'ms';

// 接受一个 `ms` 兼容的字符串
function timer(value: StringValue) {
  console.log(ms(value));
}

timer('1h'); // 正确使用
```

使用类型断言来确保变量符合 `ms` 要求的格式。

```typescript
function safelyConvert(value: string) {
  try {
    const milliseconds = ms(value as StringValue);
    console.log(milliseconds);
  } catch (error) {
    console.error('The provided value is not valid:', error);
  }
}

safelyConvert('15m'); // 正确使用
```

## 🌐 在Edge环境中使用

`ms` 包同样适应于Edge Runtime，可以在Vercel Edge Functions等环境中运用。

```javascript
/* 使用 ms 包从启动时刻开始计算存活时间 */
import ms from 'ms';
const start = Date.now();

export default (req) => {
  return new Response(`Alive since ${ms(Date.now() - start)}`);
};

export const config = {
  runtime: 'experimental-edge',
};
```

想要更深入了解，请访问 `ms` 包的GitHub仓库：[ms on GitHub](https://github.com/vercel/ms)

在使用 `ms` 包时如果遇到任何问题，不要犹豫，可通过以上链接查看更多详情，并在需要时为项目贡献你的智慧。希望这篇文章能帮助你更加轻松地在JavaScript应用中处理时间！