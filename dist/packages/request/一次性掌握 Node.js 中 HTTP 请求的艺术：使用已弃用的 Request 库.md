---
title: 一次性掌握 Node.js 中 HTTP 请求的艺术：使用已弃用的 Request 库
tags: [Node.js, HTTP请求, Request库, 前端开发]
desc: 本文将介绍如何在 Node.js 中使用已弃用的 Request 库来发送 HTTP 请求，并提供具体的代码示例和操作细节。
pkgName: request
---

# 一次性掌握 Node.js 中 HTTP 请求的艺术：使用已弃用的 Request 库

> 仓库地址：https://github.com/request/request

尽管 `request` 库已经被弃用，它曾经是 Node.js 中最流行的 HTTP 客户端库之一，以其简单和强大的功能而闻名。在这篇文章中，我们将回顾 `request` 库的基本用法和一些高级特性，以及谈论它的替代方案。如果你正在维护一个仍然使用 `request` 的旧项目，或者对历史上的 Node.js 库感兴趣，这篇文章或许能带给你一些启发。

## 🌐 简易 HTTP 请求

发送一个简单的 GET 请求，并打印出结果，你可以如下操作：

```javascript
const request = require('request');

request('http://www.google.com', function (error, response, body) {
  console.error('error:', error);
  console.log('statusCode:', response && response.statusCode);
  console.log('body:', body);
});
```

在这段代码中，我们引入了 `request` 模块，并调用它来发送一个 GET 请求到 Google 的主页。然后，在回调函数中，我们打印出错误信息（如果有的话）、响应的状态码以及响应体。

## 🔄 重定向处理

`request` 默认会跟随 3xx 响应的重定向。如果你想要改变这一行为，可以调整相应的选项：

```javascript
request({
  url: 'http://some.url',
  followRedirect: false
}, function (error, response, body) {
  if (!error && response.statusCode == 302) {
    console.log('The resource has been moved to ' + response.headers.location);
  }
});
```

在这个例子中，如果遇到了一个 302 重定向响应，`request` 将不会自动跟随重定向。我们可以通过 `response.headers.location` 访问新的资源位置。

## 🖥️ 处理流

`request` 也支持请求和响应的流式处理。这使得将数据流向文件或从文件流向请求变得简单。

```javascript
const fs = require('fs');

// 流式下载图片
request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'));

// 流式上传文件
fs.createReadStream('file.json').pipe(request.put('http://mysite.com/obj.json'));
```

上面的代码示例一部分展示了如何将网上的图片下载并保存到本地文件中，另一部分则是将本地的文件上传到服务器。

## 🔒 HTTPS和SSL

对于需要使用 HTTPS 或者需要 SSL/TLS 协议参数的请求，`request` 提供了多种配置方法：

```javascript
const fs = require('fs');
const https = require('https');

const options = {
  url: 'https://secure.example.com',
  agentOptions: {
    ca: fs.readFileSync('./ca.pem')
  }
};

request(options, function(err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body);
  }
});
```

在这里，我们为 HTTPS 请求配置了 `agentOptions`，其中包括一个 SSL 证书认证。

## 🍪 使用Cookie

`request` 提供了对 cookie 的处理能力，可以使用内置的 cookie jar 管理 cookie。

```javascript
const request = require('request').defaults({ jar: true });

request('http://www.google.com', function () {
  // 自此，随后对 google.com 的请求会携带之前设置的 cookies
  request('http://www.google.com/preferences');
});
```

在这个例子中，我们启动了一个带有 cookie jar 的 `request` 实例，它将自动处理 cookie 的发送和接收。

## 💣 异常和超时处理

处理异常和正确配置超时是任何网络相关操作中不可忽视的一环：

```javascript
request('http://some.url/that/may/not/exist', {timeout: 5000}, function (err, res, body) {
  if (err && err.code === 'ETIMEDOUT') {
    console.error('Request has been timed out.');
  } else {
    console.log(body);
  }
});
```

如果在5秒钟内没有得到响应，上述请求将会超时。

`request` 库虽然已不再维护，但它的设计理念和实现细节仍然具有参考价值。如今有许多替代库，如 `axios`、`fetch`、`got` 等，它们提供了类似或更好的功能和性能。

了解 `request` 的用法对于迁移旧代码以及理解现代 Node.js HTTP 请求库的设计亦有实际意义。记住，在开始新项目时，最好选择活跃维护的库。