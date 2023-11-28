---
layout: post
title: window.print 自定义页眉页脚
tags: [javascript]
comments: true
date: 2023-11-28 08:47:07
---

```html
<style>
  .header,
  .header-space,
  .footer,
  .footer-space {
    height: 100px;
  }
  .header {
    position: fixed;
    top: 0;
  }
  .footer {
    position: fixed;
    bottom: 0;
  }
</style>

<table>
  <thead>
    <tr>
      <td>
        <div class="header-space">&nbsp;</div>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="content">...</div>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>
        <div class="footer-space">&nbsp;</div>
      </td>
    </tr>
  </tfoot>
</table>
<div class="header">...</div>
<div class="footer">...</div>
```

<!-- more -->

## 方法一：position fixed

```html
<style>
  .header {
    position: fixed;
    top: 0;
  }
  .footer {
    position: fixed;
    bottom: 0;
  }
</style>

<div class="header">...</div>
<div class="content">...</div>
<div class="footer">...</div>
// CSS
```

这个方法超过一页后，页眉页脚会与内容重叠

## 方法二：table

```HTML
<table>
  <thead>
    <tr><td>
      <div class="header">...</div>
    </td></tr>
  </thead>
  <tbody>
    <tr><td>
      <div class="content">...</div>
    </td></tr>
  </tbody>
  <tfoot>
    <tr><td>
      <div class="footer">...</div>
    </td></tr>
  </tfoot>
</table>
```

利用表格 table，打印会自动把 thead,tfoot 设置为页眉页脚，不过这个方法页脚会跟在内容后面，不会在页面底部

## 总结：两种方法结合，可以很好的实现

```html
<style>
  .header,
  .header-space,
  .footer,
  .footer-space {
    height: 100px;
  }
  .header {
    position: fixed;
    top: 0;
  }
  .footer {
    position: fixed;
    bottom: 0;
  }
</style>

<table>
  <thead>
    <tr>
      <td>
        <div class="header-space">&nbsp;</div>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="content">...</div>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>
        <div class="footer-space">&nbsp;</div>
      </td>
    </tr>
  </tfoot>
</table>
<div class="header">...</div>
<div class="footer">...</div>
```

## [参考资料](https://medium.com/@Idan_Co/the-ultimate-print-html-template-with-header-footer-568f415f6d2a)
