---
title: "全面解读：如何使用babel-loader让你的JavaScript代码转译高效又现代"
tags: ["JavaScript", "Babel", "Webpack", "前端构建"]
desc: "深入探讨如何利用babel-loader在Webpack环境中高效转译JavaScript代码，兼容现代浏览器的同时优化项目构建流程。"
pkgName: "babel-loader"
---

# 全面解读：如何使用babel-loader让你的JavaScript代码转译高效又现代

`babel-loader` 是一个用于配合 Webpack 打包工具和 Babel 转译器的插件，允许您使用 Babel 和 Webpack 转译 JavaScript 文件。本文将详细介绍如何安装和配置 `babel-loader`，并通过实际代码样例展示其强大的功能。

## 📦 安装与基本配置

```bash
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

在您的 `webpack.config.js` 文件中，您需要将 `babel-loader` 添加到模块规则列表中：

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  }
};
```

## 🚀 高级配置项

让我们通过更多的配置项来发挥 `babel-loader` 的全部潜力。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ],
            // 使用插件来提案类属性
            plugins: ['@babel/plugin-proposal-class-properties'],
            // 启用缓存提升构建性能
            cacheDirectory: true
          }
        }
      }
    ]
  }
};
```

在此配置中，我们增加了 `cacheDirectory` 选项，此选项可以极大提升重复构建的速率。

## ⚙️ 定制缓存标识符

为了进一步优化构建速度，您可以自定义缓存标识符，以确保在适当的情况下使缓存失效。

```javascript
options: {
  cacheDirectory: true,
  cacheIdentifier: 'my-custom-cache-identifier'
}
```

## 🛠️ 排除转译问题

有时，您可能会遇到某些 `node_modules` 目录下的库不兼容 IE11，您可以通过以下方式来专门转译它们：

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: {
        and: [/node_modules/],
        not: [/unfetch/, /d3-array|d3-scale/]
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "ie 11" }]
          ]
        }
      }
    }
  ]
}
```

## 🧱 避免辅助代码的重复

为了减少因 Babel 辅助方法而引起的代码膨胀，推荐使用 `@babel/plugin-transform-runtime` 插件。

```javascript
rules: [
  {
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }]
        ],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  }
]
```

需要注意的是您还应当安装如下依赖:

```bash
npm install -D @babel/plugin-transform-runtime
npm install @babel/runtime
```

## 🎯 Webpack多目标定制babel配置

Webpack可以打包多种目标（如浏览器和Node.js服务器），您可能需要基于目标定制不同的Babel配置：

```javascript
// babel.config.js

module.exports = api => {
  return {
    // 其他配置...
    
    presets: [
      [
        "@babel/preset-env",
        {
          targets: api.caller(caller => caller && caller.target === "node")
            ? { node: "current" }
            : { browsers: ["last 2 versions", "safari > 7"] }
        }
      ]
    ]
  };
};
```

## 🛤️ 自定义Loader

对于想要在没有文件创建的情况下定制 `babel-loader` 的情况，或者需要和 `babel-loader` 直接交互的场景，可以通过 `.custom` 方法：

```javascript
// 文件：my-custom-loader.js
module.exports = require('babel-loader').custom(babel => {
  // ... 自定义处理逻辑
});
```

然后在您的Webpack配置中直接使用该Loader：

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      use: [
        {
          loader: path.resolve(__dirname, 'my-custom-loader.js'),
          options: {/* ... */}
        }
      ]
    }
  ]
};
```

通过上述步骤，您可以对 `babel-loader` 进行细致的定制，以适应您项目的特定需求。

> 仓库地址：https://github.com/babel/babel-loader

在这篇文章中，我们探讨了如何使用 `babel-loader` 在 Webpack 环境中转译 JavaScript 代码。通过适当的配置和优化，您可以确保您的项目在现代浏览器中运行无误，同时保证构建过程的效率。我们希望这篇文章对您的前端开发之旅有所帮助！