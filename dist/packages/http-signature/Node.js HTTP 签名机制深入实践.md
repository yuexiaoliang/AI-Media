---
title: "Node.js HTTP 签名机制深入实践"
tags: ["Node.js", "HTTP Signature", "安全"]
desc: "详解如何使用node-http-signature模块为Node.js对http请求进行签名与验证，确保通信安全。"
pkgName: "http-signature"
---

# Node.js HTTP 签名机制深入实践

安全的 http 通信是 Web 开发中至关重要的部分。本文将带你深入了解如何在 Node.js 中利用 `http-signature` 模块来实现 HTTP 请求的签名和验证，一步步提升你的API安全性。

## 🚀 开始使用 `http-signature`

在 Node.js 应用中实现 HTTP 签名的步骤分为客户端的请求签名和服务端的签名验证。让我们从如何在客户端签名开始。

```javascript
// 引入 node 模块
const fs = require('fs');
const https = require('https');
const httpSignature = require('http-signature');

// 读取私钥
const key = fs.readFileSync('./key.pem', 'ascii');

// 设置请求选项
const options = {
  host: 'localhost',
  port: 8443,
  path: '/',
  method: 'GET',
  headers: {}
};

// 创建 https 请求并添加签名
const req = https.request(options, function(res) {
  console.log(res.statusCode); // 输出响应状态码
});

// 使用 http-signature 签名请求
httpSignature.sign(req, {
  key: key,
  keyId: 'keyId', // 在服务器上唯一标识公钥位置的keyId
  keyPassphrase: 'secret' // 私钥密码（如果有）
});

// 发出请求
req.end();
```

为了验证 HTTP 签名，服务端需要解析请求并使用相应的公钥进行验证。

```javascript
// 引入 node 模块
const fs = require('fs');
const https = require('https');
const httpSignature = require('http-signature');

// 服务器选项，包括SSL证书和密钥
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

// 创建 HTTPS 服务器
https.createServer(options, function (req, res) {
  let statusCode = 200;
  try {
    // 解析请求签名
    const parsed = httpSignature.parseRequest(req);
    // 根据 keyId 读取公钥
    const publicKey = fs.readFileSync(parsed.keyId, 'ascii');
    // 验证签名是否有效
    if (!httpSignature.verifySignature(parsed, publicKey)) {
      statusCode = 401; // 签名无效，返回 401 未授权
    }
  } catch (e) {
    statusCode = 401; // 捕获异常，可能是解析错误或其他错误
  }

  res.writeHead(statusCode); // 设置响应状态码
  res.end(); // 结束响应
}).listen(8443); // 监听 8443 端口
```

## 📦 安装 `http-signature`

在使用之前，确保你已经通过 npm 安装了 `http-signature` 模块。

```bash
npm install http-signature
```

通过以上步骤，你可以在 Node.js 应用中简单地实现 HTTP 请求的签名和验证，为你的 API 通信安全加上一层保护。

> 仓库地址：https://github.com/TritonDataCenter/node-http-signature

通过深入实践本文介绍的 `http-signature` 模块，你可以有效地提升你的服务端和客户端之间的通信安全。欢迎大家在评论区交流使用心得，或是提出宝贵的意见和问题！