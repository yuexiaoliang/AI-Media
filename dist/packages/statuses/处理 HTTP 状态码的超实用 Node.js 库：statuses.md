---
title: "处理 HTTP 状态码的超实用 Node.js 库：statuses"
tags: ["Node.js", "HTTP", "状态码", "前端开发"]
desc: "一目了然的指南，带你详细了解如何在 Node.js 项目中使用 statuses 库来处理 HTTP 状态码。"
pkgName: "statuses"
---

# 处理 HTTP 状态码的超实用 Node.js 库：statuses

在 Node.js 的世界里，处理各种 HTTP 状态码是日常开发不可避免的一部分。今天就为大家介绍一个非常有用的库——`statuses`，它让 HTTP 状态码的查找和使用变得非常简单和直观。

## 🚀 快速上手

在开始之前，确保有 Node.js 环境，并通过 npm 安装 `statuses` 包：

```bash
$ npm install statuses
```

安装完成后，你可以在你的项目中如下方式使用它：

```javascript
var status = require('statuses')

// 获取状态码对应的文本信息
console.log(status(404))  // 输出: 'Not Found'

// 获取文本信息对应的状态码
console.log(status('Not Found'))  // 输出: 404
```

## 📜 检索状态码信息

`statuses` 提供了一系列的方便方法来查询 HTTP 状态码信息。

### 获取状态码对应的描述

```javascript
// 使用状态码获取描述
console.log(status(403))  // 输出: 'Forbidden'
// 使用字符串形式的状态码同样有效
console.log(status('403'))  // 输出: 'Forbidden'

// 如果状态码未知，将抛出错误
try {
  console.log(status(306))  
} catch (e) {
  console.error(e)  // Error: invalid status code: 306
}
```

### 通过描述获取状态码

```javascript
// 获取描述对应的状态码
console.log(status('Forbidden'))  // 输出: 403
console.log(status('forbidden'))  // 输出: 403 (大小写不敏感)

// 如果描述未知，将抛出错误
try {
  console.log(status('foo'))  
} catch (e) {
  console.error(e)  // Error: invalid status message: "foo"
}
```

## 📦 查询特殊状态码属性

`statuses` 还提供了一些特殊属性的查询功能，例如判断是否是空响应、重定向或者是否应当重试。

### 空响应判断

```javascript
// 状态码是否表示空响应
console.log(status.empty[204]) // 输出: true
console.log(status.empty[304]) // 输出: true
console.log(status.empty[200]) // 输出: undefined (不是空响应)
```

### 重定向判断

```javascript
// 状态码是否表示重定向
console.log(status.redirect[301]) // 输出: true
console.log(status.redirect[200]) // 输出: undefined (不是重定向)
```

### 重试推荐判断

```javascript
// 是否建议重试请求
console.log(status.retry[503]) // 输出: true
console.log(status.retry[501]) // 输出: undefined (不建议重试)
```

## 📘 获取所有状态码列表

有时候我们需要了解所有的 HTTP 状态码列表，`statuses` 也提供了这样的功能。

```javascript
// 获取所有状态码的列表
console.log(status.codes) // 输出: [100, 101, 102, ..., 509]
```

> 仓库地址：https://github.com/jshttp/statuses

通过这篇介绍，希望大家能够对 `statuses` 有一个全面的了解。它的简洁和实用性一定会在你处理 HTTP 状态码时提升效率！快去试试吧！