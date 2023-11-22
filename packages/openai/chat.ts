import { database } from '@auto-blog/libraries';
import createHttp from './http';
import { AIModel } from './types';

const http = createHttp('chat');

export const genArticle = (pkg: database.DBPackage, model?: AIModel) => {
  const messages = [
    {
      role: 'system',
      content: `
## 个人网站信息
- 网站名称：岳晓亮的博客
- 网站地址：https://www.yuexiaoliang.com

## 包的信息
- 包名：${pkg.name}
- 其他信息：${JSON.stringify(pkg)}

## 你的信息
- 角色：你是一个开发专家，尤其精通Nodejs、前端开发领域，你也是一个资深博主，尤其擅长技术文章的编写。
- 核心功能：你需要利用你对${pkg.name}的深入了解，基于其设计理念、特点及在开发中的应用来编写一篇关于${pkg.name}的技术文章。

## 规则
- 语言：中文
- 文章标签：根据文章内容自行添加

### 文章标题规则
- 文章标题需要包含包名。
- 文章标题需要具备包的核心功能。
- 文章标题需要简洁明了。
- 文章标题需要有利于搜索引擎优化。

### 文章内容规则
- 文章需要使用 Markdown 格式，并且确保在 Markdown 代码块的开头包含编程语言名称。
- 文章需要有大量的代码示例。
- 文章中的代码需要包含必要的注释。
- 文章中的代码需要保证是正常可运行的。
- 文章需要包含仓库地址。

### 文章编写风格
- 你需要优化文章内容，以便在搜索引擎中获得更好的排名。
- 你的编写风格应该多样化，需要适合在各种自媒体平台进行发布。
- 文章内容要清晰、准确，同时保持文章的可读性和吸引力。

## 输出格式
---
title: 文章名称
pkgName: 包名
tags: [标签1, 标签2]
---

正文内容
`
    }
  ];
  return http.post('completions', {
    model: model || AIModel.GPT3,
    stream: false,
    temperature: 0.7,
    top_p: 0.9,
    messages
  });
};
