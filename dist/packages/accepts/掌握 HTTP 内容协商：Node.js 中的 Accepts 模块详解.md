---
title: 掌握 HTTP 内容协商：Node.js 中的 Accepts 模块详解
tags: [Node.js, HTTP, 内容协商, Accepts]
desc: 深入了解 Accepts 模块，一款高效管理 HTTP 内容协商的 Node.js 库，通过实际示例掌握其使用方法。
pkgName: accepts
---

# 掌握 HTTP 内容协商：Node.js 中的 Accepts 模块详解

HTTP 内容协商机制使服务能够根据客户端的请求头（如 `Accept`, `Accept-Language`, `Accept-Encoding`）返回最合适的响应。在 Node.js 生态中，`accepts` 模块基于强大的 `negotiator` 库简化了内容协商的流程。本文将深入解析 `accepts` 的安装、API 使用，并通过代码示例展示如何在实际项目中应用此模块。

## 📦 安装

使用 npm 安装 `accepts` 模块：

```bash
$ npm install accepts
```

在你的项目中引入 `accepts`：

```javascript
var accepts = require('accepts');
```

## 🚀 基本使用

创建一个 `Accepts` 对象来处理传入的 `req` 对象（HTTP 请求）。

```javascript
var accept = accepts(req);
```

### 字符集协商

检查请求所接受的字符集，并选择最优选项：

```javascript
// 返回第一个客户端接受的字符集
var charset = accept.charset(['utf-8', 'iso-8859-1']);

if (charset) {
  console.log('客户端接受的字符集为:', charset);
} else {
  console.log('客户端不接受提供的字符集');
}
```

### 编码格式协商

确定客户端接受的编码格式：

```javascript
// 返回第一个客户端接受的编码格式
var encoding = accept.encoding(['gzip', 'deflate']);

if (encoding) {
  console.log('客户端接受的编码格式为:', encoding);
} else {
  console.log('客户端不接受提供的编码格式');
}
```

### 语言协商

选择客户端优先接受的语言：

```javascript
// 返回第一个客户端接受的语言
var language = accept.language(['en', 'es', 'fr']);

if (language) {
  console.log('客户端接受的语言为:', language);
} else {
  console.log('客户端不接受提供的语言选项');
}
```

### 类型协商

基于客户端请求头的 `Accept` 条目选择最适合的响应类型：

```javascript
// 返回第一个客户端接受的类型
var type = accept.type(['json', 'html']);

if (type) {
  console.log('客户端接受的类型为:', type);
} else {
  console.log('客户端不接受提供的类型选项');
}
```

## 🌐 举例

假设你的服务器需要根据客户端请求返回不同类型的数据格式，例如 JSON 或 HTML。

```javascript
var accepts = require('accepts');
var http = require('http');

function handleRequest(req, res) {
  var accept = accepts(req);

  // 你的服务器类型优先级列表
  switch (accept.type(['json', 'html'])) {
    case 'json':
      res.setHeader('Content-Type', 'application/json');
      res.write('{"message":"Hello, world!"}');
      break;
    case 'html':
      res.setHeader('Content-Type', 'text/html');
      res.write('<b>Hello, world!</b>');
      break;
    default:
      res.setHeader('Content-Type', 'text/plain');
      res.write('Hello, world!');
      break;
  }

  res.end();
}

http.createServer(handleRequest).listen(3000);
```

使用 cURL 测试服务器响应：

```bash
curl -H 'Accept: text/html' http://localhost:3000/
```

该请求会从服务器接收到 HTML 格式的相应，因为客户端通过 `Accept` 请求头明确表示了首选类型。

> 仓库地址：https://github.com/jshttp/accepts

通过本文，你已经学会了如何使用 `accepts` 模块提高你的 Node.js 服务的内容协商能力，支持更复杂的协商逻辑以便返回最适合客户端的响应。