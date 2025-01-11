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

pg_dump -U postgres -h 192.168.130.91 -p 18814 -d regina_caas_qa4 -f /home/xc/backup/regina_caas_qa4.sql -v
psql -U postgres -h localhost  -d regina_sewsmart_qa4 < /home/xc/backup/regina_sewsmart_qa4.sql