#!/bin/bash

pwd

git status

git pull

git add .

git commit -m "auto update"

git push origin master

# 延时1秒
sleep 1