---
title: 玩转错误处理：使用 error-ex 扩展 Node.js 错误对象
tags: [Node.js, error-ex, 错误处理]
desc: 了解如何使用 error-ex 包来定制和扩展 Node.js 的错误对象，为错误处理添加更多上下文信息。
pkgName: error-ex
---

# 玩转错误处理：使用 error-ex 扩展 Node.js 错误对象

错误处理在任何编程语言中都是一个至关重要的环节。Node.js 的 `Error` 对象提供了基本的错误处理机制，但有时我们需要更多定制化功能，以增加错误上下文信息或改造错误的展示。这篇文章将向你介绍如何使用 `error-ex` 包来达成这个目的。

## 🗂 开始之前的准备

在开始之前，确保你已经安装了 `error-ex`。如果还未安装，可以通过以下命令加以安装：

```bash
npm install error-ex --save
```

安装完成后，你就可以在你的 Node.js 项目中使用 `error-ex`。

## 🚧 创建自定义错误类型

`error-ex` 的核心功能在于让你能非常容易地创建新的错误类型。下面的代码展示了如何创建一个名为 `JSONError` 的新错误类型。

```js
const errorEx = require('error-ex');

const JSONError = errorEx('JSONError');

const err = new JSONError('出现错误');
err.name; //-> 'JSONError'
throw err; // 抛出的错误将会显示为 'JSONError: 出现错误'
```

以上代码中，我们创建了一个特定名称的错误类型，并通过 `new` 关键字实例化该错误，同时 `err.name` 将会显示我们所设定的错误名称。

## 🔍 给错误信息添加更多上下文

有时候我们需要在抛出的错误中添加文件名、路径或其他相关信息。使用 `error-ex`，你可以轻易地为错误添加额外的上下文。

```js
const JSONError = errorEx('JSONError', { fileName: errorEx.line('在 %s 中') });

const err = new JSONError('解析错误');
err.fileName = '/a/b/c/foo.json';
throw err; // 抛出的错误现在会包含文件路径: '(line 2)-> 在 /a/b/c/foo.json 中'
```

在这个例子中，`fileName` 属性被用来添加一个栈行，它为错误提供了更多的上下文信息。

## 🛠 进阶自定义错误处理

`error-ex` 也允许你通过一个可配置的属性字典来构建复杂的错误信息。下面是一个较为高级的示例：

```js
const AdvancedError = errorEx('AdvancedError', {
    detail: {
        message: function (value, existingMessage) {
            return [`详细信息: ${value}`, ...existingMessage];
        }
    }
});

const err = new AdvancedError('服务未响应');
err.detail = '服务器可能正在维护';
throw err;

/*
    AdvancedError: 服务未响应
    详细信息: 服务器可能正在维护
        at Object.<anonymous> (example.js:10:7)
*/
```

在上述代码中，我们定义了一个名为 `AdvancedError` 的错误类型，并在构造函数中添加了一个 `detail` 属性。在这个属性中，我们通过一个函数来定制错误消息，使得我们可以在现有的错误消息之前添加自定义的文本。

## 🏗 总结

通过使用 `error-ex`，你可以轻松地实现错误对象的定制化和扩展，为你的 Node.js 应用添加更为丰富和详细的错误信息，便于调试和错误追踪。

希望通过这篇文章，你已经掌握了如何使用 `error-ex` 来创建自定义错误类型，并为其添加额外的上下文信息，更加深入地进行错误处理。

> 仓库地址：https://github.com/Qix-/node-error-ex