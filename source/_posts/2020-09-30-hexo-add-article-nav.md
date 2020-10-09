---
layout: post
title: "hexo 添加文章导航"
date: 2020-09-30
excerpt: "利用hexo 原生api添加文章目录"
tags: [web, hexo]
comments: true
---

在Hexo官网 文档>自定义>辅助函数>最下面，可以找到[toc](https://hexo.io/zh-cn/docs/helpers#toc)这个函数，看其介绍能知道它就是来实现文章目录的。  

使用toc函数，不显示标题前数字，item为页面中传过去的参数post

```html
toc.ejs
<% if (item) { %>
  <div id="toc" class="toc-article">
    <%- toc(item.content, {list_number: false}) %>
  </div>
<% } %>
```
在左侧栏插入代码
```
left-col.ejs
<nav>
  <%- partial('_partial/post/toc', {item: page}) %>
</nav>
```
修改layout代码
```
<%- partial('_partial/left-col', null, {cache: !config.relative_link, post: page}) %>

<%- partial('_partial/left-col', {cache: !config.relative_link, post: page}) %>
```
