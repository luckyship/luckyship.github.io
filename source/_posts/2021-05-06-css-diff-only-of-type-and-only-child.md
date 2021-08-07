---
layout: post
title: only-child和only-of-type区别
tags: [css, web]
comments: true
date: 2021-05-06 14:45:11
---

## only-child选择器

`:only-child` 选择器选择的是父元素中只有一个子元素，而且只有唯一的一个子元素。也就是说，匹配的元素的父元素中仅有一个子元素，而且是一个唯一的子元素。

## only-of-type选择器

`:only-of-type` 选择器用来选择一个元素是它的父元素的唯一一个相同类型的子元素。这样说或许不太好理解，换一种说法。 `:only-of-type` 是表示一个元素他有很多个子元素，而其中只有一种类型的子元素是唯一的，使用 `:only-of-type` 选择器就可以选中这个元素中的唯一一个类型子元素。

<!-- more -->

## 示例

```html
<style>
  p:only-of-type {
    background: #ff0000;
  }

  p:only-child {
    border: 5px solid blue;
  }
</style>

<body>

  <div>
    <p>这是一个段落。</p>
    <span>123</span>
    <span>123</span>
  </div>

  <div>
    <p>这是一个段落。</p>
    <p>这是一个段落。</p>
  </div>

  <div>
    <p>这是一个段落。</p>
  </div>
</body>
```

<iframe width="100%" height="350px" srcdoc='
<style>
p:only-of-type {
  background:#ff0000; 
}
p:only-child
{
  border: 5px solid blue; 
}
</style>
<body>
<div>
<p>这是一个段落。</p>
<span>123</span>
<span>123</span>
</div>
<div>
<p>这是一个段落。</p>
<p>这是一个段落。</p>
</div>
<div>
<p>这是一个段落。</p>
</div>
</body>
'>
</iframe>
