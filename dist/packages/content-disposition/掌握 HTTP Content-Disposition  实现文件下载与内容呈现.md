---
title: "掌握 HTTP Content-Disposition: 实现文件下载与内容呈现"
tags: ["Node.js", "HTTP", "Content-Disposition"]
desc: "详解如何通过Node.js模块content-disposition处理HTTP内容展示，实现高效文件传输和附件下载"
pkgName: "content-disposition"
---

# 掌握 HTTP Content-Disposition: 实现文件下载与内容呈现

HTTP `Content-Disposition` 响应头是一项关键技术，用于控制浏览器如何处理接收到的内容。你是否需要让用户直接在浏览器中预览内容，还是提示他们下载文件？这篇文章将带你了解如何通过 Node.js 模块 `content-disposition` 来达成这些目标。

## 📥 创建 Content-Disposition 头

当你需要发送文件到客户端并提示用户下载时，正确设置 `Content-Disposition` 头是关键步骤。以下示例显示了如何使用 `content-disposition` 模块生成这个头的值。

```javascript
var contentDisposition = require('content-disposition');

// 设置文件名和 Content-Disposition
res.setHeader('Content-Disposition', contentDisposition('example.pdf'));
```

### 文件名选项及其降级处理

如果你的文件名包含非 ISO-8859-1 字符，你需要考虑降级处理。

```javascript
// 使用 fallback 时指定一个 ISO-8859-1 兼容的文件名
res.setHeader('Content-Disposition', contentDisposition('不可描述图片.png', {
  fallback: 'fallback-name.png'
}));
```

### 指定内容展示类型

默认情况下，`contentDisposition` 方法将类型设置为 `"attachment"`，此类型指示浏览器下载内容。但是，你可以选择设置为 `"inline"`，如果你希望浏览器尝试直接展示内容而不是下载。

```javascript
// 文件将在浏览器内直接展示
res.setHeader('Content-Disposition', contentDisposition('在线预览.pdf', {
  type: 'inline'
}));
```

## 🗂 解析 Content-Disposition 头

解析服务器发送的 `Content-Disposition` 头使你能够获取有关附件和文件名的详细信息。

```javascript
var parsed = contentDisposition.parse('attachment; filename="file.txt"');

// 类型和参数将被包含在解析结果里面
console.log(parsed.type); // 'attachment'
console.log(parsed.parameters.filename); // 'file.txt'
```

## 📁 例子：发送文件下载

通过 HTTP 服务器发送文件，并自动设置正确的 `Content-Disposition` 头，使用户能够下载文件。

```javascript
var contentDisposition = require('content-disposition');
var destroy = require('destroy');
var fs = require('fs');
var http = require('http');
var onFinished = require('on-finished');

http.createServer(function onRequest(req, res) {
  // 设定 PDF 文件路径
  var filePath = '/path/to/public/plans.pdf';

  // 设置响应头
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', contentDisposition(filePath));

  // Pipe 文件内容到响应
  var stream = fs.createReadStream(filePath);
  stream.pipe(res);

  // 完成后销毁流
  onFinished(res, function() {
    destroy(stream);
  });
}).listen(3000);
```

在以上代码示例中，当客户端请求服务器时，服务器会发送响应，其 `Content-Disposition` 头会告诉浏览器这是一个 `attachment`，用户将被提示下载文件 `plans.pdf`。

> 仓库地址：https://github.com/jshttp/content-disposition

使用 `content-disposition` 模块能够极大地简化处理 HTTP 内容展示的工作流程，无论你需要控制内容如何被浏览器处理，都可以通过这个强大的模块来实现。