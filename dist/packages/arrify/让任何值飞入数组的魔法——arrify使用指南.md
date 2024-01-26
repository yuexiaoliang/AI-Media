---
title: "让任何值飞入数组的魔法——arrify使用指南"
tags: ["JavaScript", "编程", "前端开发", "数组处理"]
desc: "深入浅出地介绍如何使用arrify包将各种数据结构转换为数组，一键解决不同数据类型的数组化问题。"
pkgName: "arrify"
---

# 让任何值飞入数组的魔法——arrify使用指南

简洁至极的JavaScript工具库: arrify，可以轻松地将各种类型的值转换为数组。不管是基本类型还是复杂的数据结构，arrify都能一键将其“魔法化”为一个干净的数组形式。本文将通过详实的代码示例告诉你如何使用这个小巧而强大的工具。

## 🔄 普通值转数组

当你拿到一个值，可能是来自用户输入，API响应或其他途径，并希望把它处理成统一的数组格式进行操作，arrify 是你的不二之选。

```javascript
import arrify from 'arrify';

// 将字符串转为数组
console.log(arrify('🦄'));
//=> ['🦄']

// 数组则保持不变
console.log(arrify(['🦄']));
//=> ['🦄']
```

在上面的示例中，可以看到无论是字符串还是数组，arrify 都能够给出一个预期的数组结果。

## 🛠 高级数据结构转数组

对于诸如 Set 这样的ES6中新引入的数据结构，你可能需要额外的成本去将其转换为数组，使用 arrify，这项工作将变得异常简单。

```javascript
// 将 Set 转为数组
const unicornSet = new Set(['🦄']);
console.log(arrify(unicornSet));
//=> ['🦄']
```

这里我们创建了一个 Set 集合，在使用 arrify 之后，它就变成了我们熟悉的数组形式。

## 🚫 对空值的处理

在 JavaScript 开发中，处理 `null` 或 `undefined` 是一件经常遇到也令人头疼的事情。幸运的是，arrify 在遇到这些值时，会直接返回一个空数组。

```javascript
// null 和 undefined 转为空数组
console.log(arrify(null));      //=> []
console.log(arrify(undefined)); //=> []
```

正如代码示例中所见，任何时候传入 `null` 或 `undefined`，arrify 都会给你一个干净的空数组，这对于保持数据处理的一致性非常有帮助。

arrify 真正的魅力在于它的简单性和高效性。不再需要复杂的判断或者多余的转换代码，只需要一个简单的函数调用，就可以让任何值稳稳地落入数组的怀抱。

> 仓库地址：https://github.com/sindresorhus/arrify

开启你的魔法转换之旅吧，继续探索 arrify 的更多可能性！

使用这个指南，我相信你会和我一样，发现 arrify 在前端开发工作中带来的便捷，直观简单的API让你的代码变得更加清晰和优雅，现在开始使用它吧！