---
title: 纯 JavaScript 字符编码转换：iconv-lite 的使用指南
tags: [前端开发, Node.js, 编码转换, iconv-lite]
desc: 探索如何使用 iconv-lite 进行无缝的字符编码转换，提升您的 Node.js 应用国际化支持。
pkgName: iconv-lite
---

# 纯 JavaScript 字符编码转换：iconv-lite 的使用指南

iconv-lite 是一个纯 JavaScript 实现的字符编码转换库，让开发者在 Node.js 环境中轻松实现编码的转换，无需依赖原生的编译环境。本文将带您了解如何在实际项目中使用 iconv-lite，优化您的应用以支持多种字符编码。

## 🌀 快速开始

在开始之前，请确保您已经通过 NPM 安装了 iconv-lite：

```bash
npm install iconv-lite
```

### 基础用法

```javascript
const iconv = require('iconv-lite');

// 从编码的 Buffer 转换为 JavaScript 字符串
const str = iconv.decode(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');

// 从 JavaScript 字符串转换为编码的 Buffer
const buf = iconv.encode("示例输入字符串", 'win1251');

// 检查是否支持某种编码
const isSupported = iconv.encodingExists("us-ascii");
// 输出：true 或 false
```

在上述代码中，我们使用 `iconv.decode` 将 Buffer 对象转换为字符串，`iconv.encode` 将字符串转换为 Buffer 对象。同时，我们可以通过 `iconv.encodingExists` 方法检测库是否支持特定的编码。

### 流 API (Node v0.10+)

```javascript
const http = require('http');
const fs = require('fs');
const iconv = require('iconv-lite');

// 使用流进行解码（从二进制流转换为 JavaScript 字符串）
http.createServer((req, res) => {
    const converterStream = iconv.decodeStream('win1251');
    req.pipe(converterStream);

    converterStream.on('data', (str) => {
        // 这里处理解码后的字符串，逐块操作
        console.log(str);
    });
});

// 流转换编码示例
fs.createReadStream('file-in-win1251.txt')
    .pipe(iconv.decodeStream('win1251'))
    .pipe(iconv.encodeStream('ucs2'))
    .pipe(fs.createWriteStream('file-in-ucs2.txt'));

// 方便方法：所有的 encode/decode 流都有 .collect(cb) 方法
http.createServer((req, res) => {
    req.pipe(iconv.decodeStream('win1251')).collect((err, body) => {
        console.assert(typeof body === 'string');
        // 这里是完整的请求体字符串
        console.log(body);
    });
});
```

流 API 允许我们在接收或发送数据时实时进行编码转换，非常适合处理大文件或数据流。

## 🚀 性能比较

iconv-lite 不仅使用方便，还拥有较高的性能。以下是与 node-iconv 模块的性能对比：

```plaintext
operation             node-iconv   iconv-lite
----------------------------------------------
encode('win1251')     ~96 Mb/s     ~320 Mb/s
decode('win1251')     ~95 Mb/s     ~246 Mb/s
```

性能测试显示，iconv-lite 在编码转换方面优于 node-iconv，尤其是在对 `win1251` 编码进行操作时。

## 📘 支持的编码类型

iconv-lite 支持包括 UTF-8、UTF-16（LE/BE）、UTF-32（LE/BE）、ISO-8859 系列、Windows 125x 系列等众多编码。

详细的支持编码列表请访问：[支持的编码](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).

## 🎯 其他重要说明

- 使用 iconv-lite 时，请尽量传递 Buffer 到 `decode()` 方法，以避免不可预知的问题。
- 在无法转换字符时，默认会显示 � 或 ?。目前不支持字符音译。
- Node版本 0.10.31 和 0.11.13 存在已知问题，请避免使用这些版本。

> 仓库地址：https://github.com/ashtuchkin/iconv-lite

以上就是 iconv-lite 的主要使用方法。通过此库，您可以在不同的字符编码之间自由、高效地转换，极大便利了多语言和国际化项目的开发。