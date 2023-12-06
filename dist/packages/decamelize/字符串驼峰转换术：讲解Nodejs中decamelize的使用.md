---
title: "字符串驼峰转换术：讲解Nodejs中decamelize的使用"
tags: [Nodejs, 前端开发, 字符串处理, decamelize]
desc: 探索如何在Nodejs项目中使用decamelize包将驼峰字符串高效转换为小写，并插入自定义分隔符。
pkgName: decamelize
---

# 字符串驼峰转换术：讲解Nodejs中decamelize的使用

在编程中，变量和函数名经常用驼峰式（camelCase）命名法来写。但是，有时我们需要转换这些命名为其他格式，比如下划线分隔（snake_case）。这篇文章会深入探讨如何在Nodejs中利用decamelize包进行这样的转换。

## 📦 如何安装decamelize

在开始使用`decamelize`之前，首先需要在你的Nodejs项目中安装它。打开终端，运行以下命令：

```shell
npm install decamelize
```

## 🛠 如何使用decamelize

安装完毕后，我们可以开始使用`decamelize`函数了。下面是一些基本的例子，展示如何将驼峰字符串转换为下划线分隔的小写字符串。

```javascript
import decamelize from 'decamelize';

// 基本用法
decamelize('unicornRainbow');
//=> 'unicorn_rainbow'
```

### 自定义分隔符

如果你不想使用默认的下划线作为分隔符，`decamelize`允许你指定一个自定义的分隔符。

```javascript
// 使用自定义分隔符 '-'
decamelize('unicornRainbow', {separator: '-'});
//=> 'unicorn-rainbow'
```

### 保持连续大写的情况

当你处理一些缩略词或者特殊的命名时，可能需要保持连续的大写字母不变。`decamelize`提供了一个选项来处理这个情况。

```javascript
// 保持连续的大写字母
decamelize('testGUILabel', {preserveConsecutiveUppercase: true});
//=> 'test_GUI_label'

// 不保持连续的大写字母
decamelize('testGUILabel', {preserveConsecutiveUppercase: false});
//=> 'test_gui_label'
```

## 🔧 API详细说明

### decamelize(input, options?)

#### input

Type: `string`

输入的驼峰式字符串。

#### options

Type: `object`

可选的参数对象。

##### separator

Type: `string`  
Default: `'_'`

字符串中词汇的分隔符。

##### preserveConsecutiveUppercase

Type: `boolean`  
Default: `false`

是否保留连续的大写字母。

## 🔄 相关工具

如果你需要进行相反的操作，即将下划线分隔或其他格式的字符串转换为驼峰式，可以使用[`camelcase`](https://github.com/sindresorhus/camelcase)包。

> 仓库地址：https://github.com/sindresorhus/decamelize

通过本文，你应该对如何在Nodejs项目中使用`decamelize`有了清晰的理解。现在，将驼峰命名的字符串转换为下划线分隔的小写字符串变得轻而易举了！不要忘记在使用用户输入时限制字符串的长度，保证应用的安全性。