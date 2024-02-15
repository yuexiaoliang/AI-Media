---
title: "解决JSON循环引用问题：使用json-stringify-safe优雅地序列化数据"
tags: ["JavaScript","序列化","循环引用"]
desc: "探索json-stringify-safe，一个解决传统JSON.stringify在遇到循环引用时抛出异常问题的完美替代方案。"
pkgName: "json-stringify-safe"
---

# 解决JSON循环引用问题：使用json-stringify-safe优雅地序列化数据

在JavaScript开发中，对含有循环引用的对象进行序列化时，`JSON.stringify`会抛出错误。而`json-stringify-safe`包恰好解决了这一问题，让循环引用不再是难题。本文将详细介绍如何用`json-stringify-safe`优雅地处理循环引用。

## 🛠️ 安装与基本使用

首先，你需要通过npm安装`json-stringify-safe`包：

```bash
npm install json-stringify-safe
```

然后，你可以在你的代码中引入并使用它：

```javascript
var stringify = require('json-stringify-safe');

// 创建一个具有循环引用的对象
var circularObj = {};
circularObj.circularRef = circularObj;
circularObj.list = [circularObj, circularObj];

// 使用json-stringify-safe进行序列化
console.log(stringify(circularObj, null, 2));
```

以上代码会输出：

```json
{
  "circularRef": "[Circular]",
  "list": [
    "[Circular]",
    "[Circular]"
  ]
}
```

如上所示，`json-stringify-safe`将循环引用替换为字符串`"[Circular]"`，避免了错误，并且使得输出的JSON易于阅读和理解。

## 🔄 深入理解循环引用处理

`json-stringify-safe`不仅仅是“安全版”的`JSON.stringify`，它还允许用户自定义对循环引用的处理策略。

### 自定义序列化

```javascript
// 自定义序列化函数
function serializer(key, value) {
  if (typeof value === 'number') {
    return undefined; // 不序列化数字类型
  }
  return value;
}

console.log(stringify(circularObj, serializer, 2));
```

这段代码中，我们自定义了序列化函数，过滤掉所有数字类型的值。

### 自定义循环引用的处理策略

```javascript
// 自定义循环引用处理策略
function decycler(key, value) {
  if (key === 'circularRef') {
    return { important: 'reference' }; // 将循环引用替换为指定的对象
  }
  return '[Circular]';
}

console.log(stringify(circularObj, null, 2, decycler));
```

在这个示例中，我们为`circularRef`属性的循环引用提供了特定的替代对象。

## 🔧 工具函数：getSerialize

```javascript
// 获取可重用的序列化函数
var serialize = stringify.getSerialize(serializer, decycler);

// 使用获得的序列化函数进行JSON.stringify
var output = JSON.stringify(circularObj, serialize);
console.log(output);
```

这样，我们就可以获得并使用一个可重用的序列化函数，此函数可以用于`JSON.stringify`。

**注意：**从`getSerialize`获取的函数目前是有状态的，因此不要多次使用同一个实例。

> 仓库地址：https://github.com/isaacs/json-stringify-safe

遵循这篇指南，你将能够在你的项目中优雅地处理JSON的循环引用问题。`json-stringify-safe`是JavaScript工具箱中的一个宝贵组件，尤其是在处理复杂对象或不确定输入时。