---
title: 深入浅出 Node.js 对象拓展：使用 extend 实现深浅拷贝
tags: [Node.js, extend, 深拷贝, 浅拷贝]
desc: 本文深入探讨 Node.js 中如何使用 extend 模块实现对象的深浅拷贝，以及与 Object.assign 的对比分析。
pkgName: extend
---

# 深入浅出 Node.js 对象拓展：使用 extend 实现深浅拷贝

extend 模块是 Node.js 开发者必备的实用工具之一，它提供了一种简洁的方式来拓展或合并对象。在本指南中，我们将详解如何利用它进行深拷贝和浅拷贝，并示范一些常见的用例。

## 🛠 安装 extend

在开始前，你需要确保你的工程中安装了 extend。安装方法如下：

```bash
npm install extend
```

安装完成后，你就可以在你的 Node.js 项目中使用 extend 了。

## 📝 使用 extend

extend 提供了一个简单的API来拓展一个对象。下面我们将通过例子来看它是如何使用的。

```javascript
// 引入 extend 模块
var extend = require('extend');

// 创建一个目标对象
var targetObject = {
  name: "Alice",
  age: 25
};

// 创建其他对象
var object1 = {
  name: "Bob"
};
var object2 = {
  country: "Wonderland"
};
```

使用 extend 的基础语法如下：

```javascript
// 执行浅拷贝
extend(targetObject, object1, object2);
```

执行上面的代码后，`targetObject` 的值会变为：

```javascript
{
  name: "Bob",         // 从 object1 里面拷贝过来
  age: 25,             // 原本 targetObject 的属性
  country: "Wonderland" // 从 object2 里面拷贝过来
}
```

注意，所有传入的对象（除了第一个之外）会依次拓展到第一个对象中，如果有相同的属性名，后面的属性将会覆盖前面的。

接下来，我们来看看如何进行深拷贝：

```javascript
// 创建一个需要深拷贝的对象
var deepTarget = {
  contact: {
    phone: "12345678"
  }
};

var deepSource = {
  contact: {
    email: "alice@example.com"
  }
};

// 执行深拷贝
extend(true, deepTarget, deepSource);
```

经过上述操作后，`deepTarget` 的值会变为：

```javascript
{
  contact: {
    phone: "12345678",        // 原本 deepTarget 的属性
    email: "alice@example.com" // 从 deepSource 拷贝过来的属性
  }
}
```

通过在 `extend()` 函数中设置第一个参数为 `true`，我们可以执行一个深拷贝，此操作会递归地将一个对象拷贝到另一个对象中。

> 仓库地址：https://github.com/justmoon/node-extend

## 🤔 extend 和 Object.assign 的比较

在 Node.js 版本 4 及以上，`Object.assign` 函数提供了原生的对象拓展功能。使用的方式与 extend 类似，但是它不支持深拷贝。以下是 `Object.assign` 的一个使用示例：

```javascript
var obj = { name: "Alice" };
var source = { age: 25 };

Object.assign(obj, source);
```

执行后，obj 的值将会是：

```javascript
{
  name: "Alice",
  age: 25
}
```

在决定使用 `extend` 还是 `Object.assign` 时，你应该考虑是否需要深拷贝的功能，以及对ECMAScript标准的支持状况。

通过本篇文章，你应该对 extend 模块的基础使用有了一定的了解。它是一个非常有用的工具，能够在日常开发中大大简化对象操作的复杂性。加入 extend 到你的工具箱中，为未来的项目打下坚实的基础。