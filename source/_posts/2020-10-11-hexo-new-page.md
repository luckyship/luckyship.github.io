---
layout: post
title: 'hexo新建页面'
excerpt: '在hexo上新建一个页面，该页面形式上和post差不多，内容有区别'
tags: [hexo]
comments: true
date: 2020-10-11 21:06:47
---

使用`hexo new page 命令`
```
$ hexo new page comment
```
在`source`文件夹下就有了一个新的文件夹
```
$ ls source
comment _post
```
当使用`hexo g`时，会在`public`文件夹下生成新的文件夹`comment`，这样我们在网页上就可以通过`url + comment/`的方式访问该页面
