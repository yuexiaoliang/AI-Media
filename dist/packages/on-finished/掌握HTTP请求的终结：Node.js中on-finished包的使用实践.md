---
title: "掌握HTTP请求的终结：Node.js中on-finished包的使用实践"
tags: ["Node.js", "HTTP", "on-finished", "后端开发"]
desc: "深入探讨on-finished包的妙用，学习如何优雅地处理Node.js中HTTP请求的完成、关闭或错误事件。"
pkgName: "on-finished"
---

# 掌握HTTP请求的终结：Node.js中on-finished包的使用实践

on-finished包是Node.js开发者的小帮手，能帮助你监听HTTP请求或响应的结束。无论是请求完成、关闭还是遇到错误，on-finished都能让你精准地执行回调函数，做出相应处理。这篇文章将通过实际的代码示例，展示如何高效地运用on-finished。

## 🌐 安装指南

要开始使用on-finished，你首先需要在你的Node.js项目中安装它。使用npm是最快捷的方式：

```bash
$ npm install on-finished
```

## 🧩 基础API使用

### 监听响应对象的完成

回调函数将会在响应对象完成时被调用一次。如果在处理过程中出现错误，回调的第一个参数会携带这个错误信息。

```javascript
var onFinished = require('on-finished');

http.createServer(function onRequest(req, res) {
  // ... 你的逻辑代码 ...

  onFinished(res, function (err, res) {
    if (err) {
      console.error('Response encountered an error:', err);
    }
    // 清理工作，比如关闭文件句柄等
  });
});
```

### 监听请求对象的完成

如果你需要在请求对象完成时执行回调，你也可以这么做。回调同样会在请求对象完成时被调用一次，错误会通过第一个参数传递。

```javascript
var onFinished = require('on-finished');

http.createServer(function (req, res) {
  var data = '';

  req.on('data', function (chunk) {
    data += chunk;
  });

  onFinished(req, function (err) {
    if (err) {
      console.error('Request encountered an error:', err);
      return;
    }
    // 请求数据已经完整接收到此处变量data中
    // 进行接下来的处理...
  });
});
```

## 🧰 判断请求/响应是否已完成

on-finished提供了isFinished方法来检查请求或响应对象是否已经完成。这可以让你在开始某些操作前做出选择性的判断。

```javascript
var onFinished = require('on-finished');

http.createServer(function (req, res) {
  if (onFinished.isFinished(req)) {
    // 请求已完成，不需要再次读取数据
  } else {
    // 请求未完成，继续监听数据流
  }
});
```

## 🎯 特殊的Node.js请求处理

对于HTTP CONNECT方法和HTTP Upgrade请求，由于Node.js的限制，这些请求会被on-finished视为立即完成：

- HTTP CONNECT方法：请求会立即完成，即使请求体未被读取。
- HTTP Upgrade请求：类似于CONNECT，请求将立即完成。

## 💡 实战示例

下面的例子演示了如何在响应结束后确保文件描述符总是被关闭，避免资源泄露。

```javascript
var destroy = require('destroy');
var fs = require('fs');
var http = require('http');
var onFinished = require('on-finished');

http.createServer(function onRequest(req, res) {
  var stream = fs.createReadStream('package.json');
  stream.pipe(res);

  onFinished(res, function () {
    // 使用destroy来确保流被完全关闭
    destroy(stream);
  });
});
```

以上代码片段展示了如何简洁明了地处理流和响应结束后的清理工作。

> 仓库地址：https://github.com/jshttp/on-finished

on-finished是一个在Node.js中处理HTTP请求生命周期事件不可或缺的工具。它的轻巧与易用让开发者能够更专注于核心逻辑，同时保持代码的整洁与可维护性。通过丰富的代码示例和适时的错误处理，这篇文章为你展示了如何在项目中灵活而高效地使用这个工具。