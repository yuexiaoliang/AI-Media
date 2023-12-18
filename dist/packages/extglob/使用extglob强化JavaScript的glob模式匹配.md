---
title: 使用extglob强化JavaScript的glob模式匹配
tags: [Node.js, glob, 正则表达式, 前端开发]
desc: 深入了解如何通过extglob包，在JavaScript中实现强大和灵活的glob模式匹配，从而获得接近正则表达式的表现力。
pkgName: extglob
---

# 使用extglob强化JavaScript的glob模式匹配

在处理文件路径或者其他字符串列表时，glob模式提供了一种通配符语法，让我们可以写出简洁且富有表达力的查询表达式。但是，标准的glob模式有时候表现力不够，这时就可以使用`extglob`包来强化我们的模式匹配能力。

## 🌟 安装extglob

为了在项目中使用`extglob`，你首先需要通过npm或者yarn将它添加到依赖中。

```bash
$ npm install --save extglob
```
或者
```bash
$ yarn add extglob
```

## 🎯 基本使用

`extglob`的主要导出是一个函数，它接收一个字符串和选项对象，并返回一个包含解析后的AST和编译后的`.output`的对象，这个`.output`是一个与正则表达式兼容的字符串，可用于进行匹配。

```javascript
const extglob = require('extglob');
console.log(extglob('!(xyz)*.js'));
```

这个例子会输出一个用于匹配所有不以`xyz`开头的`.js`文件的正则表达式字符串。

## 🛠 扩展glob模式

`extglob`支持Bash风格的模式匹配，这些扩展glob模式非常强大：

```markdown
|**模式**       |**正则等价式**    |**描述**                           |
|--------------|-------------------|-----------------------------------|
|`?(pattern)`  |`(...|...)?`       |匹配零次或一次给定模式            |
|`*(pattern)`  |`(...|...)*`       |匹配零次或多次给定模式            |
|`+(pattern)`  |`(...|...)+`       |匹配至少一次给定模式              |
|`@(pattern)`  |`(...|...)`        |匹配给定模式之一                  |
|`!(pattern)`  |N/A                |匹配除了给定模式之外的任何内容    |
```

## 💡 API 示例

### .isMatch()

检查指定的字符串是否匹配给定的extglob模式。

```javascript
const extglob = require('extglob');

console.log(extglob.isMatch('a.a', '*.!(*a)')); //=> false
console.log(extglob.isMatch('a.b', '*.!(*a)')); //=> true
```

### .match()

接受字符串数组和extglob模式，返回只包含与模式匹配的字符串的新数组。

```javascript
const extglob = require('extglob');
console.log(extglob.match(['a.a', 'a.b', 'a.c'], '*.!(*a)'));
//=> ['a.b', 'a.c']
```

### .create()

将给定的`extglob`模式转换为与正则表达式兼容的字符串。

```javascript
const extglob = require('extglob');
console.log(extglob.create('*.!(*a)').output);
//=> '(?!\\.)[^/]*?\\.(?!(?!\\.)[^/]*?a\\b).*?'
```

## ✨ 性能基准

`extglob`在性能基准测试中，与minimatch这类库相比，展现了其卓越的性能与准确性。

```bash
# star-simple示例
  extglob x 2,154,184 ops/sec ±0.99% (89 runs sampled)
  minimatch x 452,812 ops/sec ±0.51% (88 runs sampled)

  fastest is extglob (by 476% avg)
```

通过性能基准测试我们可以看出，`extglob`在处理更复杂和精确的匹配模式时，表现得非常快速。

## 📄 总结

`extglob`增强了你在JavaScript中使用glob模式的能力，它让你能够编写出既具有正则表达式的表现力又具有glob语法简洁性的模式匹配。将其应用于你的项目中，无论是在构建工具、任务自动化，还是在日常的文件处理任务中，它都能提供强大的支持。

> 仓库地址：https://github.com/micromatch/extglob