#!/bin/bash

pwd

git status

# 添加所有更改到暂存区
git add .

# 提交更改
git commit -m "auto update"

# 推送到远程仓库
git push origin master

echo "更改已成功提交并推送到远程仓库。"

# 延时1秒
sleep 2