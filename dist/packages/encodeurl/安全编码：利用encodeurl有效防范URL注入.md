---
title: "安全编码：利用encodeurl有效防范URL注入"
tags: ["前端安全","Node.js","URL编码"]
desc: "深入浅出地介绍如何使用encodeurl保护你的网站不受URL注入攻击的威胁"
pkgName: "encodeurl"
---

# 安全编码：利用encodeurl有效防范URL注入

在开发Web应用时，正确对URL进行编码是保障应用安全性的关键措施，`encodeurl` 包为我们提供了一个灵活可靠的方式去处理URL编码的问题。

## 🚀 安装encodeurl

在开始之前，你需要确保你的开发环境已经安装了Node.js。下面是如何通过NPM安装 `encodeurl` 包：

```bash
$ npm install encodeurl
```

安装完成后，我们就可以在项目中引入并使用它了。

## 📌 使用encodeurl API

引入 `encodeurl` 是极其简单的，只需一行代码：

```javascript
var encodeUrl = require('encodeurl')
```

### 使用encodeUrl函数进行编码

`encodeUrl` 函数能够对URL进行百分比编码，但它会忽略已经编码过的序列：

```javascript
// 将完整的URL进行安全编码
var safeUrl = encodeUrl('http://你好世界.com/新年?query=测试')
console.log(safeUrl) // 输出: http://%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C.com/%E6%96%B0%E5%B9%B4?query=%E6%B5%8B%E8%AF%95
```

这个函数会尽其所能，安全地编码输入的URL，即使其中包含有潜在问题的字符，如未配对的替代字符，也会被优雅地处理。

### 在HTTP服务器中使用

让我们来看一个实际的例子，如何在HTTP服务器中应用 `encodeurl`：

```javascript
var http = require('http')
var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')

// 创建一个HTTP服务器响应404页面
http.createServer(function onRequest(req, res) {
  // 对请求的URL进行编码
  var url = encodeUrl(req.url)

  // 创建HTML内容
  var body = '<p>Location ' + escapeHtml(url) + ' not found</p>'

  // 设置响应状态码和响应头
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Content-Length', String(Buffer.byteLength(body, 'utf-8')))
  // 发送响应体
  res.end(body, 'utf-8')
}).listen(3000) // 监听3000端口
```

这里 `encodeurl` 被用来安全地编码客户端请求的URL，并且这个被编码的URL会显示在404页面中。

## 🎯 在重定向中使用encodeurl

对于重定向的场合，编码URL同样十分重要，以防止可能的注入攻击：

```javascript
var http = require('http')
var encodeUrl = require('encodeurl')
var url = require('url')

// 创建HTTP服务器响应301重定向
http.createServer(function onRequest(req, res) {
  // 解析请求的URL
  var href = url.parse(req.url)

  // 设置新的重定向位置
  href.host = 'localhost'
  href.protocol = 'https:'
  href.slashes = true

  // 对新位置进行安全编码
  var location = encodeUrl(url.format(href))

  // 设置重定向的HTTP状态码、响应头和响应体
  res.statusCode = 301
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Location', location)
  res.end(`<p>Redirecting to new site: ${escapeHtml(location)}</p>`)
}).listen(3000)
```

在上面的代码中，重定向的URL先被 `url.format` 构建完整，然后用 `encodeUrl` 进行编码保证其安全性，最后通过 `Location` 响应头告知客户端重定向的目标地址。

## 🛠️ 运行测试

若你需要对 `encodeurl` 进行测试或者贡献代码，请按照以下步骤运行测试：

```bash
$ npm test
$ npm run lint
```

> 仓库地址：https://github.com/pillarjs/encodeurl

使用 `encodeurl` 可以有效提升你的网站安全等级，避免了很多常见的URL注入安全问题，让我们编写更安全的代码，创建更加可靠的应用。