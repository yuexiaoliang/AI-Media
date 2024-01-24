---
title: "Unicode与Punycode相互转换的强大工具库"
tags: ["前端开发", "Punycode.js", "Unicode转换"]
desc: "学习如何使用Punycode.js库来处理Unicode和ASCII之间的转换，附带实用的代码示例"
pkgName: "punycode"
---

# Unicode与Punycode相互转换的强大工具库

Punycode.js 是一个强大的字符编码转换库，专注于Unicode与Punycode之间的转换。本文档将教你如何在项目中使用 Punycode.js 进行编码转换，确保你可以在全球化应用中处理各种语言的域名。

## 🛠️ 安装指南

安装 Punycode.js 非常简单，你只需两步即可在Node.js项目中引入它。

```bash
npm install punycode --save
```

在Node.js中使用：

```javascript
const punycode = require('punycode/');
```

请注意，尽管Nodejs核心模块中包含了过时的 Punycode 模块，使用上述代码可以确保你引入的是最新的用户空间(userland)模块。

## 🌐 API 使用示例

### `punycode.decode(string)`

将 Punycode ASCII字符串转换为Unicode字符串。

```javascript
// 解码域名部分
console.log(punycode.decode('maana-pta')); // 输出 'mañana'
console.log(punycode.decode('--dqo34k'));  // 输出 '☃-⌘'
```

### `punycode.encode(string)`

将 Unicode 字符串转换为 Punycode ASCII 字符串。

```javascript
// 编码域名部分
console.log(punycode.encode('mañana')); // 输出 'maana-pta'
console.log(punycode.encode('☃-⌘'));    // 输出 '--dqo34k'
```

### `punycode.toUnicode(input)`

将代表域名或电子邮件地址的 Punycode 字符串转换为 Unicode 字符串。

```javascript
// 解码完整的域名
console.log(punycode.toUnicode('xn--maana-pta.com')); // 输出 'mañana.com'
console.log(punycode.toUnicode('xn----dqo34k.com'));  // 输出 '☃-⌘.com'

// 解码电子邮件地址
console.log(punycode.toUnicode('джумла@xn--p-8sbkgc5ag7bhce.xn--ba-lmcq'));
// 输出 'джумла@джpумлатест.bрфa'
```

### `punycode.toASCII(input)`

将表示域名或电子邮件地址的 Unicode 字符串转换为 Punycode。

```javascript
// 编码完整的域名
console.log(punycode.toASCII('mañana.com')); // 输出 'xn--maana-pta.com'
console.log(punycode.toASCII('☃-⌘.com'));   // 输出 'xn----dqo34k.com'

// 编码电子邮件地址
console.log(punycode.toASCII('джумла@джpумлатест.bрфa'));
// 输出 'джумла@xn--p-8sbkgc5ag7bhce.xn--ba-lmcq'
```

### `punycode.ucs2`

处理 Unicode 字符之间的相互转换。

#### `punycode.ucs2.decode(string)`

转换字符串为 Unicode 码点值数组。

```javascript
console.log(punycode.ucs2.decode('abc')); // 输出 [0x61, 0x62, 0x63]

// 解码一个代表中心四卦符号 U+1D306 的代理对：
console.log(punycode.ucs2.decode('\uD834\uDF06')); // 输出 [0x1D306]
```

#### `punycode.ucs2.encode(codePoints)`

根据码点值数组创建字符串。

```javascript
console.log(punycode.ucs2.encode([0x61, 0x62, 0x63])); // 输出 'abc'
console.log(punycode.ucs2.encode([0x1D306]));          // 输出 '\uD834\uDF06'
```

> 仓库地址：https://github.com/mathiasbynens/punycode.js

通过使用 Punycode.js，你可以方便地将Unicode字符进行ASCII编码，以便在域名系统中使用，同时也可以解码Punycode域名，以增进国际化网站的用户体验。而且，整个过程就像上面示例中那样简单——一行代码就搞定！