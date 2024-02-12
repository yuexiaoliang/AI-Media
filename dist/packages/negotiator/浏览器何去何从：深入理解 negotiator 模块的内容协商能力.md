---
title: "浏览器何去何从：深入理解 negotiator 模块的内容协商能力"
tags: ["Node.js", "HTTP 协商", "内容协商", "前端"]
desc: "本文详解 Node.js 中利用 negotiator 模块进行内容协商的强大机制，包括语言、字符集、编码和媒体类型的逐一拆解，带你领略 HTTP 头协商的艺术。"
pkgName: "negotiator"
---

# 浏览器何去何从：深入理解 negotiator 模块的内容协商能力

内容协商是 Web 开发中一个重要的概念，它允许客户端和服务器之间就响应的最佳形式达成共识。在 Node.js 环境下，`negotiator` 模块是处理这种类型协商的利器。本篇博客将带你深入了解其使用方法，并通过示例贴近实际开发场景。

## 🛠 安装命令

在开始之前，确保你已经在项目中安装了 `negotiator`：

```sh
$ npm install negotiator
```

## 🌐 基本概念

首先初始化 `Negotiator`：

```javascript
var Negotiator = require('negotiator');
```

创建 `negotiator` 实例时，需要传入 HTTP 请求对象：

```javascript
var negotiator = new Negotiator(request);
```

下面，我们将逐一探讨 `negotiator` 提供的方法以及其作用。

## 💬 Accept 头协商

HTTP 的 `Accept` 头用于告诉服务器客户端能够处理的媒体类型（MIME 类型）以及偏好。

### 获取客户端偏好的媒体类型

```javascript
// 设定可用媒体类型
var availableMediaTypes = ['text/html', 'text/plain', 'application/json'];

// 获取客户端的偏好媒体类型列表，没有指定可用类型则返回全部
var preferredMediaTypes = negotiator.mediaTypes();
// 示例输出：['text/html', 'application/*', 'image/jpeg']

// 获取客户端的偏好媒体类型列表，仅考虑提供的可用类型
preferredMediaTypes = negotiator.mediaTypes(availableMediaTypes);
// 示例输出：['text/html', 'application/json']

// 获取客户端最偏好的单个媒体类型，仅考虑提供的可用类型
var preferredMediaType = negotiator.mediaType(availableMediaTypes);
// 示例输出：'text/html'

// 注意：以上示例假设客户端请求头为 'text/html, application/*;q=0.2, image/jpeg;q=0.8'
```

## 🔤 Accept-Language 头协商

语言协商用于确定客户端偏好的内容语言。

### 获取客户端偏好的语言

```javascript
// 设定可用语言
var availableLanguages = ['en', 'es', 'fr'];

// 获取客户端的偏好语言列表
var preferredLanguages = negotiator.languages();
// 示例输出：['es', 'pt', 'en']

// 获取客户端的偏好语言列表，考虑可用语言
preferredLanguages = negotiator.languages(availableLanguages);
// 示例输出：['es', 'en']

// 获取客户端最偏好的单个语言，考虑可用语言
var preferredLanguage = negotiator.language(availableLanguages);
// 示例输出：'es'

// 注意：以上示例假设客户端请求头为 'en;q=0.8, es, pt'
```

## 🖋 Accept-Charset 头协商

字符集协商确保返回的内容采用客户端能够理解的编码。

### 获取客户端偏好的字符集

```javascript
// 设定可用字符集
var availableCharsets = ['utf-8', 'iso-8859-1', 'iso-8859-5'];

// 获取客户端的偏好字符集列表
var preferredCharsets = negotiator.charsets();
// 示例输出：['utf-8', 'iso-8859-1', 'utf-7']

// 获取客户端的偏好字符集列表，考虑可用字符集
preferredCharsets = negotiator.charsets(availableCharsets);
// 示例输出：['utf-8', 'iso-8859-1']

// 获取客户端最偏好的单个字符集，考虑可用字符集
var preferredCharset = negotiator.charset(availableCharsets);
// 示例输出：'utf-8'

// 注意：以上示例假设客户端请求头为 'utf-8, iso-8859-1;q=0.8, utf-7;q=0.2'
```

## 🗜 Accept-Encoding 头协商

编码协商帮助确定内容压缩方法，以优化传输。

### 获取客户端偏好的编码

```javascript
// 设定可用编码
var availableEncodings = ['identity', 'gzip'];

// 获取客户端的偏好编码列表
var preferredEncodings = negotiator.encodings();
// 示例输出：['gzip', 'identity', 'compress']

// 获取客户端的偏好编码列表，考虑可用编码
preferredEncodings = negotiator.encodings(availableEncodings);
// 示例输出：['gzip', 'identity']

// 获取客户端最偏好的单个编码，考虑可用编码
var preferredEncoding = negotiator.encoding(availableEncodings);
// 示例输出：'gzip'

// 注意：以上示例假设客户端请求头为 'gzip, compress;q=0.2, identity;q=0.5'
```

通过上述示例代码，我们可以看到 `negotiator` 如何简洁而有效地帮助我们处理 HTTP 请求的内容协商。通过对 Accept, Accept-Language, Accept-Charset, 和 Accept-Encoding 请求头的解析，我们能够为客户端提供最合适的响应。这是构建高效、用户友好 Web 应用的关键步骤。

> 仓库地址：https://github.com/jshttp/negotiator

在任何基于 HTTP 协议的应用程序中，了解并运用内容协商是十分重要的。掌握 `negotiator` 的使用，可以让你更好地为客户端提供定制化的内容，无论是在国际化处理、字符编码选择还是压缩上都能够精准响应客户端的需求。