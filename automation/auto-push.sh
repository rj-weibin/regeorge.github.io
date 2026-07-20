#!/bin/bash

# Obsidian笔记自动推送脚本
# 每天00:00自动检查更新并推送到GitHub

cd "/Users/regeorge/Documents/codeStore/obsidian"

# 检查是否有未提交的更改
if git diff-index --quiet HEAD --; then
    echo "$(date): 没有新的更改，无需推送"
else
    # 有更改，执行推送
    git add .
    git commit -m "每日自动更新: $(date '+%Y-%m-%d %H:%M')"
    git push
    echo "$(date): 成功推送到GitHub"
fi