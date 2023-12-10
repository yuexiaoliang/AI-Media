# Auto Blog

从生成到发布的自动化公众号发布系统。

## 基本流程

1. 基于 [Libraries](https://libraries.io/api) 获取热门的 `NPM` 项目，并存到本地数据库。
1. 在本地数据库中随机选择一个目标项目。
1. 访问目标项目的仓库，获取项目的 `README.md` 文件内容。
1. 使用 `gpt3` 精简 `README.md` 文件内容，去除技术不相关内容，如：Authors、Backers、Sponsors、License 等。
1. 基于 `gpt4` 生成目标项目相关标题，并记录当前步骤。
1. 基于 `gpt4` 生成目标项目相关内容，并记录当前步骤。

## 关键节点

### 获取热门的 `NPM` 项目

1. 使用 `Libraries` 获取热门的 `NPM` 项目列表。包含以下信息：

- 包的名称。

1. 使用 `Libraries` 获取包的详细信息。包含以下信息：

- 包的仓库地址。
- 包的官方地址。

### 图片处理

1. 将远程图片下载到本地。
1. 将图片地址替换本本地地址。

## TODO

- [ ] ts 类型体操: <https://github.com/type-challenges/type-challenges>

