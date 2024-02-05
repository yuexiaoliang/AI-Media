---
title: "使用Estraverse遍历与操作JavaScript AST"
tags: ["JavaScript", "AST", "estraverse", "前端开发"]
desc: "深入了解如何使用Estraverse来遍历和处理ECMAScript的抽象语法树（AST）"
pkgName: "estraverse"
---

# 使用Estraverse遍历与操作JavaScript AST

Estraverse是一个强大的库，用于遍历和操作ECMAScript的抽象语法树（AST）。通过本文，你将学习如何使用Estraverse执行基本的遍历，如何跳过、替换、移除节点，以及如何通过扩展遍历功能应对自定义节点类型。掌握这些基本技能，将有助于你进行代码的分析、重构以及优化等。

## 📘 快速入门

首先，你需要在你的项目中安装`estraverse`：

```bash
npm install estraverse --save
```

下面是一个基本的遍历示例，遍历一个AST并输出所有在文件根部声明的变量名。

```javascript
const estraverse = require('estraverse');

estraverse.traverse(ast, {
    enter: function (node, parent) {
        // 如果遇到函数声明或表达式，则跳过内部节点的遍历
        if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration')
            return estraverse.VisitorOption.Skip;
    },
    leave: function (node, parent) {
        // 当遇到变量声明节点时，输出变量名
        if (node.type === 'VariableDeclarator')
            console.log(node.id.name);
    }
});
```

## 🚦 控制遍历流程

我们可以使用`this.skip()`, `this.remove()` 和 `this.break()` 函数来代替返回Skip, Remove 和 Break，这样可以更加直观地控制遍历过程。

```javascript
estraverse.traverse(ast, {
    enter: function (node) {
        // 立即终止遍历
        this.break();
    }
});
```

## 🔀 替换节点

Estraverse允许你在遍历时替换节点，通过在`enter`/`leave`函数中返回一个新节点来实现。

```javascript
let result = estraverse.replace(ast, {
    enter: function (node) {
        // 如果当前节点是字面量，用`replaced`节点来替换它
        if (node.type === 'Literal')
            return replaced;
    }
});
```

## 📋 扩展遍历规则

通过传递`visitor.keys`映射，我们可以扩展Estraverse的遍历功能，适应自定义节点类型。

```javascript
var tree = {
    type: 'TestExpression',
    argument: {
        type: 'Literal',
        value: 20
    },
    extended: true
};

estraverse.traverse(tree, {
    enter: function (node) { },
    keys: {
        TestExpression: ['argument']
    }
});
```

## 🔍 自定义未知节点的遍历行为

当遇到未知节点类型时，通过`visitor.fallback`选项，我们可以自定义遍历的行为。

```javascript
var tree = {
    type: 'TestExpression',
    argument: {
        type: 'Literal',
        value: 20
    },
    extended: true
};

// 迭代未知节点的子节点
estraverse.traverse(tree, {
    enter: function (node) { },
    fallback: 'iteration'
});
```

当`visitor.fallback`是一个函数时，我们可以决定每个节点应该访问哪些键。

```javascript
estraverse.traverse(tree, {
    enter: function (node) { },
    fallback: function(node) {
        // 返回除了`argument`属性之外的所有键
        return Object.keys(node).filter(function(key) {
            return key !== 'argument';
        });
    }
});
```

通过Estraverse，你可以灵活而强大地遍历和操作JavaScript代码的AST结构，使得代码分析和变换成为可能。上述示例只是浅尝辄止，Estraverse的功能远不止这些，你可以在官方文档中深入学习更多高级用法。

> 仓库地址：https://github.com/estools/estraverse 

引入Estraverse到你的项目中，开始探索以AST为基础的代码工程技术吧！