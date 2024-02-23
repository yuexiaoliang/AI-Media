---
title: "用 Node.js 处理 multipart/form-data 表单数据"
tags: ["Node.js", "表单处理", "multipart/form-data", "文件上传"]
desc: "深入解析如何在 Node.js 中使用 form-data 库构建和提交 multipart/form-data 表单，实现文件上传等功能。"
pkgName: "form-data"
---

# 用 Node.js 处理 multipart/form-data 表单数据

多部分表单数据（multipart/form-data）在 Web 开发中非常常见，尤其是涉及到文件上传。在 Node.js 中，`form-data` 库提供了一个高效、简洁的方式来构造和提交这类表单数据。本文将详细介绍如何在 Node.js 项目中使用此库。

## 🚀 快速安装 form-data

要在你的 Node.js 项目中使用 `form-data` 库，首先需要通过 npm 进行安装：

```bash
npm install --save form-data
```

## 📝 创建 multipart/form-data 表单

构建表单是处理 `multipart/form-data` 的第一步。这里有一个简单的示例，演示如何创建一个包含字符串、缓冲区(Buffer)和文件流的表单：

```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('my_field', 'my value');
// 注意：Buffer 构造函数在 Node.js 中已被废弃，使用 Buffer.from() 来创建 Buffer。
form.append('my_buffer', Buffer.from([0x01, 0x02, 0x03, 0x04]));
form.append('my_file', fs.createReadStream('/path/to/file.jpg'));
```

在上面的代码中，我们首先引入了 `form-data` 和 `fs` (文件系统) 模块，然后利用 `FormData` 的 `append` 方法添加了不同类型的字段。

## 📦 提交表单数据

构建完表单之后，我们常常需要将其提交到 Web 应用。这里演示了如何使用 `form.submit()` 方法：

```javascript
form.submit('http://example.org/', (err, res) => {
  if (err) {
    console.error('提交表单时出错:', err);
    return;
  }
  // 输出响应状态码。
  console.log('表单提交成功，响应状态码：', res.statusCode);
  res.resume(); // 必须显式调用 res.resume() 以关闭响应流。
});
```

在这段代码中，`form.submit` 接收一个 URL 和一个回调函数。回调函数用于处理表单提交后的服务器响应。

## 🤖 设置自定义选项

`form-data` 允许你设置自定义选项，例如限制数据大小：

```javascript
const form = new FormData({ maxDataSize: 20971520 }); // 设置最大数据大小为 20MB。
form.append('my_field', 'my value');
form.append('my_large_buffer', /* 大型 buffer 数据 */);
```

在上面的代码中，我们创建了一个表单实例，并通过构造函数设置了 `maxDataSize` 选项，以此来限制发送数据的大小。

## 🌍 与其他库的集成

使用 `form-data` 和其他 Node.js 库集成非常灵活。下面展示了如何结合 `axios` 库提交文件：

```javascript
const axios = require('axios');
const stream = fs.createReadStream('/path/to/file.jpg');
const form = new FormData();

form.append('image', stream);
const formHeaders = form.getHeaders();

axios.post('http://example.com/upload', form, {
  headers: {
    ...formHeaders,
  },
})
.then(response => {
  console.log('文件上传成功，服务器响应：', response.data);
})
.catch(error => {
  console.error('文件上传失败：', error);
});
```

在上面的例子中，`form.getHeaders()` 是重要的一步，它为 axios 请求添加了必要的 Content-Type 头，该头信息包含了多部分表单的边界字符串。

## 🛠️ 方法清单

- `append`: 向表单添加字段。
- `getHeaders`: 获取表单提交时所需的 HTTP 头。
- `submit`: 提交表单到指定的 URL。
- `getLengthSync`: 同步获取表单内容的长度。
- `getLength`: 异步获取表单内容的长度。

在使用 `form-data` 时，这些方法可以帮助你更灵活和精确地处理表单数据。

> 仓库地址：https://github.com/form-data/form-data

## 📣 结语

通过本文，你应该对如何在 Node.js 环境中使用 `form-data` 库有了一个全面的理解。它不仅适用于文件上传，还可以用于任何需要 `multipart/form-data` 的场景。遵循这些步骤和技巧，你将能够有效地在你的 Node.js 应用中实现表单处理功能。