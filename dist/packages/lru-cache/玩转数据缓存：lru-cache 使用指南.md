---
title: "玩转数据缓存：lru-cache 使用指南"
tags: ["Node.js", "缓存", "lru-cache", "前端开发"]
desc: "深入解析和使用 Node.js 中高性能的 LRU 缓存库 lru-cache，提升你的应用性能。"
pkgName: "lru-cache"
---

# 玩转数据缓存：lru-cache 使用指南

在现代应用开发中，缓存机制是提升性能的关键技术之一。lru-cache 是一个节点缓存库，它删除最近最少使用的项目（Least Recently Used，LRU）。如果你正在寻找一种方式，以优化你的数据存取效率，那么你来对地方了！

本文将全面讲解 lru-cache 的使用方法，带你从安装到实战一路畅游！

## 📦 安装 lru-cache

开始之前，你需要通过 npm 命令将 lru-cache 安装到你的项目中：

```shell
npm install lru-cache --save
```

安装完毕后，你可以使用以下任一方式在项目中引入：

```javascript
// 使用 ES6 模块导入方式
import { LRUCache } from 'lru-cache'

// 或者使用 CommonJS require 方式
const { LRUCache } = require('lru-cache')

// 如果你在浏览器中使用，可以通过 minified 版本加载
import { LRUCache } from 'http://unpkg.com/lru-cache@9/dist/mjs/index.min.mjs'
```

## 🏗 基础用法

首先，创建一个 LRUCache 实例并设定最大容量：

```javascript
const cache = new LRUCache({ max: 500 });

// 存储键值对
cache.set('key', 'value');

// 检索值
const value = cache.get('key');  // 返回 "value"
```

你也可以使用非字符串键。只需注意，这必须是同一个对象，而不只是结构相同：

```javascript
var someObject = { a: 1 };
cache.set(someObject, 'some value');

// 这里必须传递同一个对象引用
console.log(cache.get(someObject));  // 输出 'some value'
```

清空整个缓存非常简单：

```javascript
cache.clear();
```

## 🔄 更多的操作

lru-cache 提供了一系列实用的方法来管理缓存内容：

```javascript
// 检查某个键是否存在
const hasKey = cache.has('key');

// 删除某个键
cache.delete('key');

// 遍历缓存中的所有值
for (const value of cache.values()) {
  console.log(value);
}

// 运用 LRU 原则弹出最久未使用的元素
const oldValue = cache.pop();
```

## ⏳ 使用 TTL

你也可以给缓存内容设置生存时间（TTL），超时后会将它们视为过期：

```javascript
// 创建带有 TTL 的缓存实例
const cacheWithTTL = new LRUCache({ max: 100, ttl: 1000 * 60 * 2 });

cacheWithTTL.set('key', 'value');

// 即便项目过期了，你可以设置 allowStale 选项在删除前返回旧的项目
const staleValue = cacheWithTTL.get('key', { allowStale: true });
```

## 💫 异步支持与实时刷新

如果你想要更高级的功能，比如在缓存项过期后在后台异步刷新它们，lru-cache 提供了 `fetchMethod` 选项来实现：

```javascript
const cacheWithAsync = new LRUCache({
  max: 100,
  ttl: 1000 * 60,
  fetchMethod: async (key, staleValue, { options, signal, context }) => {
    // 你的异步取数据逻辑，例如 HTTP 请求
    const newValue = await fetchData(key);
    return newValue;
  }
});

// 使用 fetch() 方法会在需要时自动异步更新缓存
const value = await cacheWithAsync.fetch('key');
```

## 📈 性能和最佳实践

版本7的lru-cache已经成为JavaScript中最高性能的LRU缓存实现之一。记住以下最佳实践，以确保你的缓存机制最高效：

- **预先分配存储**：尽量在LRUCache构造函数中设置`max`选项，这样可以预先分配内存。
- **避免过度使用**：除非绝对需要，不要使用`dispose`函数、大小跟踪或TTL行为，因为这些功能都会影响性能。
- **键值类型**：尽量使用短字符串或整数作为键，它们通常会有更好的性能。

通过以上介绍，你应该已经具备了使用 lru-cache 的基本能力。尝试将其应用到你的项目中，让数据处理更加迅速高效！

> 仓库地址：https://github.com/isaacs/node-lru-cache