---
title: 打造直观的命令行界面：cliui使用指南
tags: [Nodejs, 命令行, 前端开发, cliui]
desc: 探索如何使用cliui库快速构建多列布局的命令行界面。
pkgName: cliui
---

# 打造直观的命令行界面：cliui使用指南

命令行界面是任何CLI工具中用户交互的核心。`cliui`库提供了一套简洁的API，帮助开发者快速地创建出直观并且格式化良好的多列命令行界面。本指南将逐步展示如何用`cliui`生成复杂的CLI布局，提升您命令行工具的用户体验。

前往[cliui GitHub 仓库](https://github.com/yargs/cliui)查看更多信息。

## 🚀 快速开始

在node项目中开始使用`cliui`是非常简单和直接的。首先，您需要通过npm安装`cliui`。

```shell
npm install cliui
```

安装完成后，您就可以在项目中引入并使用`cliui`了。

```javascript
const cliui = require('cliui')();

// 添加一些行和列
cliui.div('Usage: $0 [command] [options]');

// 输出结构化的命令行界面
console.log(cliui.toString());
```

## 📐 创建复杂布局

`cliui`允许您设置多列布局，并根据需要自定义宽度、对齐、边距等属性。以下是一个更复杂布局的例子：

```javascript
const cliui = require('cliui')();
const chalk = require('chalk');

// 定义命令用法
ui.div('Usage: $0 [command] [options]');

// 添加选项描述
ui.div({
  text: 'Options:',
  padding: [2, 0, 1, 0]
});

// 添加具有不同风格的列
ui.div(
  {
    text: "-f, --file",
    width: 20,
    padding: [0, 4, 0, 4]
  },
  {
    text: "the file to load." + chalk.green("(if this description is long it wraps)."),
    width: 40
  },
  {
    text: chalk.red("[required]"),
    align: 'right'
  }
);

// 输出带有格式化样式的命令行界面
console.log(ui.toString());
```

在以上代码中，我们利用chalk库为文本添加了颜色，使输出更加生动。

## 📄 布局DSL

DSL（域特定语言）是`cliui`的高级功能之一。它允许您用一种近似于自然语言的方式定义布局。例如：

```javascript
const ui = cliui({ width: 60 });

// 使用DSL布局的简单例子
ui.div('Usage: node ./bin/foo.js\n <regex>\t provide a regex\n <glob>\t provide a glob\t [required]')

// 输出结果
console.log(ui.toString());
```

使用DSL，你可以通过特殊字符来控制行列的创建和布局，如`\n`分割行，`\t`分割列，从而使得布局定义更加直观。

## ⚡ Deno/ESM 支持

`cliui`从版本7开始支持[Deno](https://deno.land/)和ESM（ECMAScript模块）。以下是在Deno中使用`cliui`的例子：

```typescript
import cliui from "https://deno.land/x/cliui/deno.ts";

const ui = cliui({});

// Deno里使用cliui
ui.div('Usage: $0 [command] [options]');

ui.div({
  text: "-f, --file",
  width: 20,
  padding: [0, 4, 0, 4]
});

console.log(ui.toString());
```

以上展示了如何在Deno环境中导入和使用`cliui`。

在你构建下一个命令行工具时，考虑使用`cliui`来增强你的用户界面。简洁强大的API加上灵活的布局定义，将帮助你节省时间并提升工具的专业感。