---
layout: post
title: 使用node快速启动一个服务器
tags: [javascript, nodejs]
comments: true
date: 2021-07-24 11:37:10
---

在实际生产环境中，有时我们可能需要启动一个服务器，来测试接口，我们使用node来快速启动一个服务器
<!-- more -->

## 启动node服务器

这里我们使用 `node` 的 `express` 框架去启动一个服务器

```bash
npm install express path
```

新建 `express.js` 文件，内容如下

```js
const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
let count = 0;
app.get("/test", (req, res) => {
  res.send('123')
});
app.listen(PORT);
```

启动命令

```bash
node express.js
```
