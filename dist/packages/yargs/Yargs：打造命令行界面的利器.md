---
title: "Yargs：打造命令行界面的利器"
tags: ["Node.js","命令行解析","Yargs"]
desc: "深入了解如何使用Yargs库来创建功能丰富的命令行界面应用"
pkgName: "yargs"
---

# Yargs：打造命令行界面的利器

Yargs 是一个功能强大的 Node.js 库，专门用于解析命令行参数并生成优雅的用户界面。适合于开发者构建交互式的命令行工具。在本文中，我们将探讨 Yargs 如何帮助我们更好地处理命令行参数，以及其提供的一些高级功能。

## 🚀 快速上手

为了开始使用 Yargs，首先需要安装：

```sh
npm i yargs
```

安装完成后，我们可以在一个简单的脚本中快速开始：

```javascript
#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).option('verbose', {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging',
}).argv;

if (argv.verbose) {
  console.log('Verbose mode is on.');
}
```

在上述代码中，我们定义了一个 `verbose` 选项，它有一个别名 `-v`，并且是布尔类型。如果运行脚本时用 `--verbose` 或 `-v`，它会输出相应的日志。

## 📊 参数解析演示

在一个复杂的应用中，我们可能会有许多命令和选项，让我们看看如何定义它们：

```javascript
#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command('serve [port]', 'start the server at the given port', (yargs) => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 8000
      });
  }, (argv) => {
    if (argv.verbose) console.info(`Starting server on :${argv.port}`);
    // ... 代码以启动服务器
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .parse();

// 使用方法:
// $ ./app.js serve 8080 --verbose
```

在这个例子中，我们设置了一个 `serve` 命令来启动服务器，并且可以接受一个 `port` 位置参数。`port` 有一个默认值 `8000`，如果命令行中没有指定端口，则会使用这个默认值。

## 📚 支持的平台

### TypeScript

Yargs 提供了类型定义，可以通过安装 `@types/yargs` 来获得自动完成和类型检查的好处：

```sh
npm i @types/yargs --save-dev
```

在 TypeScript 项目中使用 Yargs 将帮助你获得更好的开发体验。

### Deno

从 `v16` 开始，Yargs 还支持 [Deno](https://github.com/denoland/deno)，下面是在 Deno 中使用 Yargs 的样例：

```typescript
import yargs from 'https://deno.land/x/yargs/deno.ts'
import { Arguments } from 'https://deno.land/x/yargs/deno-types.ts'

yargs(Deno.args)
  .command('download <files...>', 'download a list of files', (yargs: any) => {
    return yargs.positional('files', {
      describe: 'a list of files to do something with'
    });
  }, (argv: Arguments) => {
    console.info(argv);
  })
  .strictCommands()
  .demandCommand(1)
  .parse();
```

### ESM (ECMAScript Modules)

对于 ES 模块也有完善的支持，下面是在支持 ECMAScript 模块系统的环境中使用：

```javascript
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .command('curl <url>', 'fetch the contents of the URL', () => {}, (argv) => {
    console.info(argv);
  })
  .demandCommand(1)
  .parse();
```

## 🛠️ 高级功能和文档查阅

Yargs 支持大量的高级功能，例如：

- 生成动态帮助文档
- 参数验证和默认值设置
- 命令分组和嵌套
- 支持中间件以扩展功能
- 自定义解析器来处理复杂的参数

要查阅更多的功能和使用指南，请访问文档页面：

- [Yargs' API](https://github.com/docs/api.md)
- [示例](https://github.com/docs/examples.md)
- [解析技巧](https://github.com/docs/tricks.md)
- [高级主题](https://github.com/docs/advanced.md)
- [在浏览器中使用](https://github.com/docs/browser.md)

> 仓库地址：https://github.com/yargs/yargs