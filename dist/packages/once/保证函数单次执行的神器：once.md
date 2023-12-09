---
title: 保证函数单次执行的神器：once
tags: [Node.js, once, 函数封装]
desc: once 模块可以确保你的函数只被执行一次，即使在异步事件中也能避免重复调用的问题，让代码更加健壮。
pkgName: once
---

# 保证函数单次执行的神器：once

在 Node.js 项目中，我们时常需要处理函数只被调用一次的场景，比如在文件读取、网络请求等异步操作中。当我们的函数被不小心多次调用时，可能会导致程序出现意外行为。`once` 包提供了一个简单优雅的解决方案来处理这个问题。它能够确保一个函数无论被调用多少次，只执行一次，并缓存第一次调用的结果。

## 🛠 使用指南

在这里，我们将通过一系列的代码示例学习如何使用 `once` 来管理我们的函数调用。

### 基本使用

首先，让我们看看 `once` 的基本用法。

```javascript
const once = require('once')

function loadData(cb) {
  // 将回调函数包装成只能调用一次的函数
  cb = once(cb)
  loadDataFromServer('data', cb)
}

function handleData(err, data) {
  if (err) {
    console.error(err)
  } else {
    console.log('Data loaded:', data)
  }
}

// loadData 调用 handleData，即使 load 多次，handleData 也只会执行一次
loadData(handleData)
```

### 函数原型扩展

`once` 包还提供了一种原型扩展的方式，让任何函数都可以轻易地变成只执行一次的函数。

```javascript
// 只需在应用的某个地方调用一次即可
require('once').proto()

function onceExample(cb) {
  // 将回调函数转化为只能调用一次的函数
  cb = cb.once()
  doSomethingAsync(cb)
  doAnotherThingAsync(cb)
}

onceExample(function(message) {
  console.log(message)
})
```

我们在调用 `.once()` 方法之后，回调函数 `cb` 变成了只可以调用一次的函数，避免了多次触发的问题。

### 严格模式

如果你想确保逻辑一致性，即函数确实是只被调用一次，你可以使用 `once.strict`。

```javascript
function connectToDatabase(cb) {
  cb = once.strict(cb)
  try {
    // 尝试连接数据库...
    cb(null, 'Connection established')
  } catch (e) {
    cb(e)
  }
}

connectToDatabase(function(err, info) {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log(info)
  }
})
```

如果 `connectToDatabase` 回调被调用超过一次，`once.strict` 将会抛出错误。

### 检查函数状态

`once` 也提供了方法来检查函数是否已经被调用过。

```javascript
function fetchData(cb) {
  cb = once(cb)

  performNetworkRequest('url', function(err, data) {
    if (err) return cb(err)
    cb(null, data)

    // 检查函数是否被调用
    if (cb.called) {
      console.log('Callback was called with value:', cb.value)
    }
  })
}

fetchData(function(err, result) {
  if (err) {
    console.error(err)
    return
  }
  console.log('Fetched data:', result)
})
```

在这个代码示例中，我们可以通过 `cb.called` 和 `cb.value` 属性来检查我们的回调函数是否已经执行过，以及它的返回值。

> 仓库地址：https://github.com/isaacs/once

这只是对 `once` 包的一个简介，但你可以开始将它应用到实际的项目中。确保你的函数逻辑严密而且只执行一次对于防止意外情况和潜在的bug是非常重要的，特别是在处理异步操作时。希望通过这个小工具，你的代码可以变得更加健壮和可靠。