---
title: Node.js实现递归创建目录的利器—mkdirp
tags: [Node.js, 文件系统, mkdirp]
desc: 掌握mkdirp库，轻松在Node.js中递归创建复杂的目录结构
pkgName: mkdirp
---

# Node.js实现递归创建目录的利器—mkdirp

像Unix命令`mkdir -p`，mkdirp可以在Node环境中轻松创建目录及其子目录，即使它们尚不存在。如果你曾纠结于处理多层目录的创建，那么本文介绍的mkdirp库将是你的强力助手。

## 📂 mkdirp的基本使用

mkdirp模块运行在Node.js中，并提供了简单的API来创建新目录，包括所有尚未存在的父目录。使用`mkdirp`时，无需关心目录是否已存在，它会智能地为你处理所有情况。

### 异步创建目录

```javascript
// 首先需要导入mkdirp模块
import { mkdirp } from 'mkdirp';

// 创建目录，返回值是一个Promise
mkdirp('/tmp/foo/bar/baz').then(made =>
  console.log(`成功创建目录，路径为 ${made}`)
);
```

### 同步创建目录

```javascript
// 导入mkdirp模块
const { mkdirp } = require('mkdirp');

// 同步创建目录，无需等待Promise
const made = mkdirp.sync('/tmp/foo/bar/baz');
console.log(`成功创建目录，路径为 ${made}`);
```

同步方法`mkdirp.sync`会立即返回，这在你不想处理异步调用时非常便捷。

## 🛠️ mkdirp的进阶方法

除了最基本的创建目录功能，mkdirp还提供了一系列的方法和选项，增强了目录创建的灵活性和控制能力。

### 创建目录并设置权限

```javascript
// 异步创建目录，并设置权限为0775
mkdirp('/tmp/foo/bar/baz', { mode: '0775' }).then(made =>
  console.log(`使用指定权限成功创建目录 ${made}`)
);
```

### 使用自定义文件系统

```javascript
// Node的fs模块
const fs = require('fs');

// 使用自定义文件系统（fs）进行创建目录
mkdirp('/tmp/foo/bar/baz', { fs: fs }).then(made =>
  console.log(`使用自定义文件系统创建目录 ${made}`)
);
```

这可以让你替换Node的默认文件操作方法，非常适合测试和仿真环境。

## 🧐 mkdirp的实现细节

mkdirp在Node.js v10.12.0及以上版本使用`fs.mkdir(p, {recursive:true})`原生选项，除非通过选项覆盖了`fs.mkdir`或`fs.mkdirSync`方法。区别于手动方法，原生方法提供了性能和效率上的优势。

## 💡 使用场景分析

每个项目可能有不同的要求和限制，你可以根据自己的需求来选择最合适的递归创建目录的方法。无论你对错误处理有何种特别的要求，或者对性能有特别的期望，mkdirp提供了相应的选择来满足你的需求。

## 📦 安装mkdirp

你可以使用npm来安装mkdirp库，用于你的本地开发：

```bash
npm install mkdirp
```

或者将其全局安装，以便在任何地方使用mkdirp命令：

```bash
npm install -g mkdirp
```

甚至npx都可以，允许你在不全局安装的情况下执行mkdirp：

```bash
npx mkdirp ...
```

## 🎯 平台支持

虽然该模块在node v8上可以工作，但官方支持的是node v10及以上版本，因为Node v8的LTS生命周期已于2020-01-01结束。

> 仓库地址：https://github.com/isaacs/node-mkdirp

本文介绍了mkdirp的关键功能和命令，无论你是Node.js初学者还是资深开发者，都可以轻松掌握并使用它来管理和创建复杂的目录结构。在你的下一个Node项目中，尝试使用mkdirp，你会发现它能显著提升你的开发效率。