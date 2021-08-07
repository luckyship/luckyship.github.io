---
layout: post
title: 跨域（服务端解决）
tags: [web, nodejs, javascript]
comments: true
date: 2021-03-20 17:31:30
---

在开发web项目的时候，经常会遇见跨域问题，虽然是个前端，但是了解一些后端解决跨域的方法，有助于我们更快解决问题
<!-- more -->

## nodejs express框架跨域解决

```js
app.all("*", function(req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");

  //允许的header类型
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next();
});
```

## nginx转发跨域

nginx设置

```bash
location ~ ^/aaaa {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    proxy_pass http://xx.xx.xx.xx:7071;
}
```
