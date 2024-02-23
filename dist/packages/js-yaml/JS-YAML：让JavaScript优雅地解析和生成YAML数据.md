---
title: "JS-YAML：让JavaScript优雅地解析和生成YAML数据"
tags: ["JavaScript", "YAML", "数据序列化", "节点模块"]
desc: "本文将指导您使用JS-YAML包，轻松在JavaScript中解析和生成YAML数据，让配置和数据交换变得简单高效。"
pkgName: "js-yaml"
---

# JS-YAML：让JavaScript优雅地解析和生成YAML数据

在Web开发和各种应用配置中，YAML格式以其可读性高和易于书写的特点，成为了广泛使用的数据序列化格式之一。JS-YAML是一个高效的JavaScript库，能够让我们在Node.js环境中轻松解析和生成YAML格式的数据。本文将深入介绍如何使用JS-YAML，包括其安装、API使用方法，以及实用的代码示例。

> 仓库地址：https://github.com/nodeca/js-yaml

## 🛠 安装和CLI工具

要在Node.js项目中使用JS-YAML，您首先需要安装它。通过简单的NPM命令即可完成安装：

```bash
npm install js-yaml
```

如果您需要使用命令行界面来检查YAML文件，可以全局安装JS-YAML：

```bash
npm install -g js-yaml
```

在安装之后，您可以通过以下命令行方式使用它：

```bash
js-yaml -c -t example.yml
```

上面的命令中，`-c`选项启用紧凑模式显示错误，`-t`选项在发生错误时显示堆栈跟踪。

## 🚀 API使用方法

接下来，让我们来看看如何在JavaScript代码中使用JS-YAML的API。

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

// 读取YAML文档，出错时抛出异常
try {
  const doc = yaml.load(fs.readFileSync('/path/to/example.yml', 'utf8'));
  console.log(doc);
} catch (e) {
  console.error(e);
}
```

在上面的代码中，我们使用了`readFileSync`从文件系统中读取YAML文件内容，并且传递该内容至`yaml.load`来将YAML字符串解析为JavaScript对象。

而要将一个JavaScript对象转换为YAML格式的字符串，可以这样操作：

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

let data = {
  title: "JS-YAML Demo",
  isFun: true,
  count: 3,
  details: {
    features: ["parse", "stringify", "cool"],
    nullValue: null,
  },
};

// 将JavaScript对象转换成YAML格式字符串
let yamlStr = yaml.dump(data);
console.log(yamlStr);

// 写入文件
fs.writeFileSync('/path/to/result.yml', yamlStr, 'utf8');
```

## 📋 支持的YAML类型和选项

JS-YAML支持YAML和JavaScript类型之间的转换。以下是默认支持的YAML标签以及它们对应的JavaScript类型：

```yaml
!!null ''                   # 对应 JavaScript 的 null
!!bool 'yes'                # 对应 JavaScript 的布尔类型
!!int '3...'                # 对应 JavaScript 的数字类型
!!float '3.14...'           # 同样对应 JavaScript 的数字类型
!!binary '...base64...'     # 对应 Node.js 的 Buffer 类型
!!timestamp 'YYYY-...'      # 对应 JavaScript 的 Date 类型
!!omap [ ... ]              # 对应 JavaScript 的Map或Object类型的数组
!!pairs [ ... ]             # 对应数组或者数组对
!!set { ... }               # 对应 JavaScript 的 Set 类型
!!str '...'                 # 对应 JavaScript 的字符串
!!seq [ ... ]               # 对应 JavaScript 的数组
!!map { ... }               # 对应 JavaScript 的 Object 类型
```

当序列化JavaScript对象到YAML时，可以通过多种选项来自定义生成的YAML字符串：

```javascript
let options = {
  indent: 4,
  noRefs: true,
  noCompatMode: true,
};

let yamlStr = yaml.dump(data, options);
```

在这个例子中，`indent`确定了缩进的空格数，`noRefs`设置为`true`意味着不将重复的对象转换为引用，`noCompatMode`设置为`true`意味着不尝试与旧的YAML版本兼容。

## 🧪 实用代码示例

为了提供实际操作的感受，让我们来看一些具体的代码示例。

### 解析含有多个文档的YAML：

如果您的YAML文件包含多个文档，那么您应当使用`loadAll`方法：

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

let data = fs.readFileSync('/path/to/multiple-docs.yml', 'utf8');

yaml.loadAll(data, function (doc) {
  console.log(doc);
});
```

### 生成具有自定义格式的YAML：

您也可以定制序列化过程中的各种输出格式：

```javascript
const yamlStr = yaml.dump(data, {
  styles: {
    '!!null': 'canonical', // 将 null 值转换为 YAML 的 '~'
    '!!bool': 'uppercase'  // 将布尔值转换为大写的 'TRUE' 或 'FALSE'
  },
  sortKeys: true // 根据键名排序
});
```

通过这种方式，您可以获得按自己要求定制的YAML格式输出。

通过以上介绍，您应该对如何在Node.js项目中使用JS-YAML有了清晰的了解。无论是需要解析配置文件还是生成易于人类阅读的数据格式，JS-YAML都是一个优秀的选择。花点时间尝试一下，它可能会成为您工程工具箱中的重要组成部分。