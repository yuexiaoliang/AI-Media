---
title: 确保回调只调用一次 — 探秘Node.js的once模块
tags: [Node.js, JavaScript, 前端, 回调函数]
desc: once模块是Node.js开发者的小助手，它能确保函数仅被调用一次，避免由于重复调用产生的不必要的问题。本文将详细探讨这一模块的使用方法。
pkgName: once
---

# 确保回调只调用一次 — 探秘Node.js的once模块

Node.js开发中经常遇到一种场景：某个回调函数只应当被调用一次。然而，在复杂的异步逻辑中，确保这一点往往不是件容易的事。为此，`once`模块应运而生，它提供了一个简单而又强大的方式来保证一个函数无论被如何调用，其实际执行的代码只会运行一次。

## 📦 如何使用once模块

要使用`once`模块，首先你需要通过NPM安装它：

```shell
npm install once
```

然后，就可以在你的代码中引入并使用`once`了：

```javascript
var once = require('once')

function load (file, cb) {
  cb = once(cb)
  loader.load(file)
  loader.once('load', cb)
  loader.once('error', cb)
}
```

在上面的代码中，`loader.load`调用是异步的，它既可能触发`load`事件，也可能触发`error`事件。而通过`once`，无论哪个事件先发生，`cb`回调函数都只会被执行一次。

## 🚀 在Function.prototype上使用once

如果你想要在所有的回调上都使用`once`，可以选择将其添加到`Function.prototype`中：

```javascript
require('once').proto()

function load (file, cb) {
  cb = cb.once()
  loader.load(file)
  loader.once('load', cb)
  loader.once('error', cb)
}
```

通过上述写法，你可以直接调用任何函数的`.once()`方法，从而让其成为一个只能被触发一次的回调。

## 🛠 如何检测函数是否被调用

`once`模块还让你能轻松检查你的函数是否已经被调用：

```javascript
var once = require('once')

function load (cb) {
  cb = once(cb)
  var stream = createStream()
  stream.once('data', cb)
  stream.once('end', function () {
    if (!cb.called) cb(new Error('not found'))
  })
}
```

在这个例子中，我们创建了一个流，该流在接收到数据时会调用回调`cb`。如果流结束还未接收到数据，我们会检查`cb.called`是否为`true`，如果不是，则表示回调未被调用，这时可以抛出一个错误。

注：`called`属性是`once`装饰过的函数所特有的，它能告诉你该函数是否已经被执行过。

## 🎉 严格模式：once.strict

有时候必须确保某函数只能被调用一次，如果不小心调用了多次，则表示存在逻辑错误。`once.strict`应当在这种场合下使用：

```javascript
var once = require('once')

function greet (name, cb) {
  if (!name) cb('Hello anonymous')
  cb('Hello ' + name) // 此处缺少返回语句，如果name为空，将会导致回调两次
}

function log (msg) {
  console.log(msg)
}

greet(null, once(log))
// 正常输出 'Hello anonymous'

greet(null, once.strict(log))
// 输出 'Hello anonymous'，并在第二次调用时抛出错误
```

`once.strict`函数强制你的代码逻辑只能触发一次回调，如果试图多次触发，则会抛出错误。

> 仓库地址：https://github.com/isaacs/once

以上就是`once`模块的基本用法和特性介绍。在你的Node.js项目中，恰当地运用`once`能够有效地预防重复调用造成的问题，让你的异步逻辑更加稳健和可靠。