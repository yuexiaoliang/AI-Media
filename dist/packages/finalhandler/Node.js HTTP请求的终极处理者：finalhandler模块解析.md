---
title: "Node.js HTTP请求的终极处理者: finalhandler模块解析"
tags: ["Node.js", "finalhandler", "HTTP", "中间件"]
desc: "深入finalhandler模块的实现与应用，为你的Node.js HTTP服务添加完善的请求终结逻辑。"
pkgName: "finalhandler"
---

# Node.js HTTP请求的终极处理者: finalhandler模块解析

`finalhandler` 是 Node.js 的一个模块，用于 HTTP 服务中作为最后一步响应 HTTP 请求。本文将详细介绍如何安装和在项目中有效地使用 `finalhandler`。

## 🚀 安装指南

要开始使用 `finalhandler`，你需要通过 npm 将其安装到你的项目中。以下是安装命令：

```bash
$ npm install finalhandler
```

安装完成后，你可以按照下面的示例将 `finalhandler` 集成到你的 Node.js 应用程序中。

## 📦 使用API

首先，你需要在项目中引入`finalhandler`：

```javascript
var finalhandler = require('finalhandler')
```

### finalhandler(req, res, \[options\])

使用 `finalhandler` 创建一个函数，它将作为`req`（请求）和`res`（响应）的最终阶段被调用。你应该调用这个函数并传递 `err` 参数。如果没有错误（err 为 falsy），它会向客户端发送一个 404 响应。如果存在错误（err 为 truthy），将根据错误写入响应或者如果响应已经开始，则结束响应。

当错误被写入时，以下信息会被添加到响应中：

- `res.statusCode` 会从 `err.status` 或 `err.statusCode` 中设置。如果这个值不在 4xx 或 5xx 范围内，它将被设置为 500。
- `res.statusMessage` 会根据状态码来设置。
- 如果 `env` 为 `'production'`，正文将是状态代码消息的 HTML；否则会是 `err.stack`。
- 任何在 `err.headers` 对象中指定的头信息。

当 `finalhandler` 被调用时，它还会从 `req` 中取消管道(pipeline)中的任何内容。

#### options.env

默认情况下，环境由 `NODE_ENV` 变量决定，但可以通过此选项覆盖。

#### options.onerror

提供一个当存在错误时调用的函数。可以用于将错误写入中心位置而无需生成过多的函数。调用时使用 `onerror(err, req, res)`。

## 🧩 实战示例

以下是 `finalhandler` 在几种常见情况下的使用示例。

### 总是返回404

```javascript
var finalhandler = require('finalhandler')
var http = require('http')

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  done() // 无论请求什么，总是返回404
})

server.listen(3000)
```

### 执行简单操作

```javascript
var finalhandler = require('finalhandler')
var fs = require('fs')
var http = require('http')

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)

  fs.readFile('index.html', function (err, buf) {
    if (err) return done(err)   // 读取出错，交给finalhandler处理
    res.setHeader('Content-Type', 'text/html')
    res.end(buf)                // 成功读取文件，返回内容
  })
})

server.listen(3000)
```

### 与中间件风格函数结合使用

```javascript
var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

var serve = serveStatic('public')  // 设置静态文件服务器

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  serve(req, res, done)  // 使用 `serve-static` 提供静态文件服务
})

server.listen(3000)
```

### 记录所有错误

```javascript
var finalhandler = require('finalhandler')
var fs = require('fs')
var http = require('http')

// 创建服务器实例
var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res, { onerror: logerror })

  fs.readFile('index.html', function (err, buf) {
    if (err) return done(err)  // 错误读取文件时，使用finalhandler处理
    res.setHeader('Content-Type', 'text/html')
    res.end(buf)               // 成功读取文件，返回内容
  })
})

// 监听端口
server.listen(3000)

// 错误日志函数
function logerror (err) {
  console.error(err.stack || err.toString())
}
```

> 仓库地址：https://github.com/pillarjs/finalhandler

通过这些实例的详细讲解，希望你已经掌握如何在你的 Node.js 项目中使用 `finalhandler` 以提供优雅的错误处理和404响应。