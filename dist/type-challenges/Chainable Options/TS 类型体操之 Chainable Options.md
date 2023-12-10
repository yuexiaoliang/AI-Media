---
title: TS 类型体操之 Chainable Options
tags: [Typescript, 类型挑战, 前端]
effect: 利用 Typescript 类型编程实现链式调用配置项的类型，并保证最终结果类型正确。
tsUtil: Chainable Options
---

# TS 类型体操之 Chainable Options

利用 TypeScript 强大的类型系统，我们可以实现很多 JavaScript 运行时的特性在编译时进行类型检查。本文将介绍如何实现一个链式调用的配置对象 `Chainable Options` 并保证其类型安全。

## 📜 概念理解

Chainable Options 是一种在 JavaScript 中常用的设计模式，允许我们通过链式调用动态地构建选项或配置对象。这种模式提供了代码的流畅性和易读性。当我们将其运用到 TypeScript 中，为了保持类型安全，我们需要编写相应的类型声明来支持这种模式。

`Chainable` 类型应具有以下功能：
1. 可以通过 `option` 方法添加配置项，且每个配置项都有唯一的键和对应的值。
2. 可以通过 `get` 方法获取最终的配置对象，并且该对象的类型是所有之前添加的配置项组合起来的类型。

## 🚀 类型实现

```ts
// TypeScript 类型代码

type Chainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): Chainable<T & Record<K, V>>;
  get(): T;
};

// 使用例子
declare const config: Chainable;

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get();

// result 的预期类型为:
// {
//   foo: number,
//   name: string,
//   bar: {
//     value: string
//   }
// }
```

### 解释

1. `Chainable<T = {}>` 定义了一个泛型类型，默认为空对象类型 `{}`。
2. 方法 `option` 接受两个参数，`key` 为 `string` 类型的键，`value` 为任意类型的值。
3. `option` 方法返回一个新的 `Chainable` 类型，但是它的泛型参数 `T` 被扩展为包含新键值对的类型，即 `T & Record<K, V>`。
4. 方法 `get` 直接返回类型 `T`，即所有累计的键值对的组合类型。

## 🧩 使用示例

以下是如何在 TypeScript 中使用 `Chainable Options` 的示例：

```ts
// TypeScript 使用代码示例

// 首先声明一个 Chainable 类型的变量
declare const settings: Chainable;

// 通过链式调用添加配置项
const updatedSettings = settings
  .option('host', 'localhost')
  .option('port', 8080)
  .option('custom', { key: 'value' })
  .get();

// updatedSettings 的类型现在是：
// {
//   host: string;
//   port: number;
//   custom: {
//     key: string;
//   };
// }
```

## 📂 类型挑战存储库

本文中讨论的类型挑战来自于开源项目 [type-challenges](https://github.com/type-challenges/type-challenges)，其中包含了许多 TypeScript 类型相关的挑战，旨在帮助开发者提升其类型编程的技能。通过解决这些挑战，你可以更加深入地理解 TypeScript 类型系统的工作原理。

> 仓库地址：https://github.com/type-challenges/type-challenges

通过上述的类型挑战演示以及使用示例，相信你现在对 TypeScript 中的 `Chainable Options` 有了更清晰的了解。类型编程不仅能使类型更丰富、代码更安全，而且还能提高代码的表现力。在日常工作中，合理利用 TypeScript 的类型系统，可以帮助我们构建更加可靠和维护性更好的前端应用。