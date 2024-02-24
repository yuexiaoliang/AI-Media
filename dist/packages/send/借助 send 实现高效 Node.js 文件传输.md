---
title: "借助 send 实现高效 Node.js 文件传输"
tags: ["Node.js", "文件传输", "send", "HTTP服务"]
desc: "本文详细介绍了如何使用 send 模块在 Node.js 中快速搭建静态文件服务，支持分段传输、条件请求和更多高级特性。"
pkgName: "send"
---

# 借助 send 实现高效 Node.js 文件传输

send 模块是为了简化在 Node.js 应用中实现文件作为 HTTP 响应流的过程而设计。此模块支持部分响应（Ranges）、条件式 GET 协商、直观的事件监听和丰富的配置选项，是搭建高性能静态文件服务的完美选择。

> 仓库地址：https://github.com/pillarjs/send

## 📦 安装指南

要开始使用 send，您需要先通过 npm 将其安装到您的项目中：

```bash
$ npm install send
```

安装完成后，你可以通过 `require` 在你的 Node.js 应用中引入它。

## 🔧 使用 API

send 模块提供了一个简洁的 API 来处理文件响应。

```javascript
const send = require('send');
```

### send(req, path, [options])

使用 `send` 函数创建一个新的 `SendStream` 实例，从文件系统中发送路径指定的文件作为 HTTP 响应。

```javascript
// 示例：使用 express 创建一个简单的静态文件服务器
const express = require('express');
const send = require('send');

const app = express();

app.get('*', (req, res) => {
  const filePath = req.path;
  
  // 使用 send 返回文件。
  send(req, filePath, { root: __dirname })
    .pipe(res);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

在这个例子中，当你访问任意 URL，服务器都会尝试返回与 URL 匹配的文件。

## ⚙️ 配置选项

send 提供了多个选项用于自定义文件传输行为。

```javascript
// 示例：设置不同的配置选项
const send = require('send');

app.get('*', (req, res) => {
  const options = {
    dotfiles: 'ignore',    // 忽略点文件
    etag: true,            // 启用 etag 生成
    lastModified: true,    // 启用 Last-Modified 头
    maxAge: '1h',          // 设置缓存最大年龄为1小时
    root: __dirname        // 设置提供文件的目录
  };

  send(req, req.pathname, options).pipe(res);
});
```

## 🛠️ 定制 MIME 类型

send 模块允许定制和文件扩展名相关联的 MIME 类型。

```javascript
// 示例：添加和定制 MIME 类型
const send = require('send');

// 设置默认的 MIME 类型
send.mime.default_type = 'text/plain';

// 添加自定义 MIME 类型
send.mime.define({
  'text/markdown': ['md'],
  'application/x-my-type': ['x-mt', 'x-mtt']
});
```

配置 MIME 类型后，发送文件时 send 将设置相应的 `Content-Type` 头部。

## 🚨 错误处理

对于 send 所产生的错误，您可以自定义错误处理的逻辑。

```javascript
// 示例：自定义错误处理
const send = require('send');

app.get('*', (req, res) => {
  send(req, req.pathname)
    .on('error', (err) => {
      res.statusCode = err.status || 500;
      res.end('Error: ' + err.message);
    })
    .pipe(res);
});
```

## 🎨 个性化目录列表

send 默认不会列出目录内容，但是你可以通过监听事件来自定义目录的行为。

```javascript
// 示例：自定义目录列表
const send = require('send');
const fs = require('fs');

app.get('*', (req, res) => {
  send(req, req.pathname)
    .on('directory', (res, path) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          res.statusCode = 500;
          res.end('Server Error');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        res.end(files.join('\n'));
      });
    })
    .pipe(res);
});
```

## 🏁 结语

send 模块的灵活性和易用性使得在 Node.js 应用中实现文件传输服务变得非常简单。以上展示的用法仅仅是冰山一角。利用 send 模块，你可以轻松在 Node.js 中搭建一个功能强大的静态文件服务器。