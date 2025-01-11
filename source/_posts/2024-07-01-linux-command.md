---
layout: post
title: 2024-07-01-linux-command
tags: []
comments: true
date: 2024-07-01 11:10:05
---

查看大文件

```bash
# 可查看任意目录下的大文件
sudo du -h --max-depth=1 / | sort -hr
```