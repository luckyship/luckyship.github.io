---
layout: post
title: css层叠上下文
tags: [css, web]
categories: review
comments: true
date: 2021-10-12 11:06:48
---

对于 css 的层叠顺序一直不是很清楚，使用 z-index 的时候有的时候不生效，为啥会产生这样的场景呢，css 的层叠顺序到底是怎样的

<!-- more -->

以往，由于自己使用 `z-index` 的频率不大，所以对这个 CSS 属性存在比较片面的认识。一直认为 `z-index` 就是用来描述定义一个元素在屏幕 Z 轴上的堆叠顺序。`z-index` 值越大在 Z 轴上就越靠上，也就是离屏幕观察者越近。最后才发现这个认识存在很大的问题：

- 首先，`z-index` 属性值并不是在任何元素上都有效果。它仅在定位元素（定义了 `position` 属性，且属性值为非 `static` 值的元素）上有效果。
- 判断元素在 `Z` 轴上的堆叠顺序，不仅仅是直接比较两个元素的 `z-index` 值的大小，这个堆叠顺序实际由元素的层叠上下文、层叠等级共同决定。

要想完全理解一个东西，首先要明白它是什么，也就是它的定义。我们先看看上面提到的层叠上下文、层叠等级、层叠顺序都是什么？定义又太过抽象，后面会再用一个具象的比喻来让你彻底明白它们到底是什么，有什么联系。

## 什么是`层叠上下文`

层叠上下文(`stacking context`)，是 `HTML` 中一个三维的概念。在 `CSS2.1` 规范中，每个盒模型的位置是三维的，分别是平面画布上的`X`轴，`Y` 轴以及表示层叠的 `Z `轴。一般情况下，元素在页面上沿`X`轴 `Y` 轴平铺，我们察觉不到它们在 `Z `轴上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。

如果一个元素含有层叠上下文，(也就是说它是层叠上下文元素)，我们可以理解为这个元素在 `Z` 轴上就“高人一等”，最终表现就是它离屏幕观察者更近。

> 具象的比喻：你可以把层叠上下文元素理解为理解为该元素当了官，而其他非层叠上下文元素则可以理解为普通群众。凡是“当了官的元素”就比普通元素等级要高，也就是说元素在 Z 轴上更靠上，更靠近观察者。

## 什么是“层叠等级”

那么，层叠等级指的又是什么？层叠等级(`stacking level`，叫“层叠级别”/“层叠水平”也行)

在同一个层叠上下文中，它描述定义的是该层叠上下文中的层叠上下文元素在`Z`轴上的上下顺序。
在其他普通元素中，它描述定义的是这些普通元素在`Z`轴上的上下顺序。
说到这，可能很多人疑问了，不论在层叠上下文中还是在普通元素中，层叠等级都表示元素在`Z`轴上的上下顺序，那就直接说它描述定义了所有元素在`Z`轴上的上下顺序就 OK 啊！为什么要分开描述？

为了说明原因，先举个栗子：

> 具象的比喻：我们之前说到，处于层叠上下文中的元素，就像是元素当了官，等级自然比普通元素高。再想象一下，假设一个官员 A 是个省级领导，他下属有一个秘书 a-1，家里有一个保姆 a-2。另一个官员 B 是一个县级领导，他下属有一个秘书 b-1，家里有一个保姆 b-2。a-1 和 b-1 虽然都是秘书，但是你想一个省级领导的秘书和一个县级领导的秘书之间有可比性么？甚至保姆 a-2 都要比秘书 b-1 的等级高得多。谁大谁小，谁高谁低一目了然，所以根本没有比较的意义。只有在 A 下属的 a-1、a-2 以及 B 下属的 b-1、b-2 中相互比较大小高低才有意义

再类比回“层叠上下文”和“层叠等级”，就得出一个结论：

- 普通元素的层叠等级优先由其所在的层叠上下文决定。
- 层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。

## 如何产生“层叠上下文”

前面说了那么多，知道了“层叠上下文”和“层叠等级”，其中还有一个最关键的问题：到底如何产生层叠上下文呢？如何让一个元素变成层叠上下文元素呢？

其实，层叠上下文也基本上是有一些特定的 `CSS` 属性创建的，一般有 `3` 种方法：

- `HTML` 中的根元素`<html></html>`本身 j 就具有层叠上下文，称为“根层叠上下文”。
- 普通元素设置 `position` 属性为非 `static` 值并设置 `z-index` 属性为具体数值，产生层叠上下文。
- `CSS3` 中的新属性也可以产生层叠上下文。

## 什么是“层叠顺序”

说完“层叠上下文”和“层叠等级”，我们再来说说“层叠顺序”。“层叠顺序”(`stacking order`)表示元素发生层叠时按照特定的顺序规则在 `Z` 轴上垂直显示。由此可见，前面所说的“层叠上下文”和“层叠等级”是一种概念，而这里的“层叠顺序”是一种规则。

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="500px" srcdoc="
<style type='text/css'>
  .z-index div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
<div class='z-index'>
    <div id='background' style='background-color:violet; transform: translate(0px, 0px);'>
      <span style='position: absolute;'>层叠上下文background/border</span>
      <div style='background-color:blueviolet;  z-index: -1; margin-left: 50px; margin-top: 50px;'>负index</div>
      <div style='background-color:steelblue; margin: -50px 0 0 100px;'>block块状盒子</div>
      <div style='background-color:springgreen; float: left; margin: -50px 0 -50px 150px'>float浮动盒子</div>
      <div style='background-color:greenyellow; display: inline-block; margin: -50px 0 0 200px;'>
        inline/inline-block盒子
      </div>
      <div style='background-color:orange; position: relative; z-index: auto; margin: -50px 0 0 250px;'>
        z-index:auto/z-index:0
      </div>
      <div style='background-color:red; position: relative; z-index: 1; margin: -50px 0 0 300px;'>正z-index</div>
    </div>
  </div>
</body>
">
</iframe>
<!-- /* md-file-format-disable */ -->

> 上图的代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>JS Bin</title>
  </head>
  <body>
    <style type="text/css">
      .z-index div {
        width: 200px;
        height: 100px;
        color: white;
        border: 1px solid white;
      }
    </style>
    <body>
      <div class="z-index">
        <div id="background" style="background-color:violet; transform: translate(0px, 0px);">
          <span style="position: absolute;">层叠上下文background/border</span>
          <div style="background-color:blueviolet;  z-index: -1; margin-left: 50px; margin-top: 50px;">负index</div>
          <div style="background-color:steelblue; margin: -50px 0 0 100px;">block块状盒子</div>
          <div style="background-color:springgreen; float: left; margin: -50px 0 -50px 150px">float浮动盒子</div>
          <div style="background-color:greenyellow; display: inline-block; margin: -50px 0 0 200px;">
            inline/inline-block盒子
          </div>
          <div style="background-color:orange; position: relative; z-index: auto; margin: -50px 0 0 250px;">
            z-index:auto/z-index:0
          </div>
          <div style="background-color:red; position: relative; z-index: 1; margin: -50px 0 0 300px;">正z-index</div>
        </div>
      </div>
    </body>
  </body>
</html>
```

在不考虑 CSS3 的情况下，当元素发生层叠时，层叠顺讯遵循上面途中的规则。 这里值得注意的是：

- 左上角"层叠上下文 `background/border`"指的是层叠上下文元素的背景和边框。
- `inline/inline-block` 元素的层叠顺序要高于 `block`(块级)/`float`(浮动)元素。
- 单纯考虑层叠顺序，`z-index: auto` 和 `z-index: 0` 在同一层级，但这两个属性值本身是有根本区别的。

## 判断方法

- 1、首先先看要比较的两个元素是否处于同一个层叠上下文中：
  - 1.1 如果是，谁的层叠等级大，谁在上面（怎么判断层叠等级大小呢？——看“层叠顺序”图）。
  - 1.2 如果两个元素不在统一层叠上下文中，请先比较他们所处的层叠上下文的层叠等级。
- 2、当两个元素层叠等级相同、层叠顺序相同时，在 DOM 结构中后面的元素层叠等级在前面元素之上。

### 实例

```html
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="box1" style="position: relative; z-index: auto;">
    <div class="child1" style="background-color:red; position: relative; z-index: 2;"></div>
  </div>
  <div class="box2" style="position: relative; z-index: auto;">
    <div class="child2" style="background-color:blue; position: relative; z-index: 1; margin: -50px 0 0 50px;"></div>
  </div>
</body>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="250px" srcdoc='
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="box1" style="position: relative; z-index: auto;">
    <div class="child1" style="background-color:red; position: relative; z-index: 2;"></div>
  </div>
  <div class="box2" style="position: relative; z-index: auto;">
    <div class="child2" style="background-color:blue; position: relative; z-index: 1; margin: -50px 0 0 50px;"></div>
  </div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

`.box1/.box2`虽然设置了 `position: relative`，但是 `z-index: auto` 的情况下，这两个 `div` 还是普通元素，并没有产生层叠上下文。所以，`child1/.child2` 属于`<html></html>`元素的“根层叠上下文”中，此时，谁的 `z-index` 值大，谁在上面。

对于上面中的 `CSS` 代码，我们只把`.box1/.box2` 的 `z-index` 属性值改为数值 `0`，其余不变。

```html
<div class="box1" style="position: relative; z-index: 0;">
  <div class="child1" style="background-color:red; position: relative; z-index: 2;"></div>
</div>
<div class="box2" style="position: relative; z-index: 0;">
  <div class="child2" style="background-color:blue; position: relative; z-index: 1; margin: -50px 0 0 50px;"></div>
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="250px" srcdoc='
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="box1" style="position: relative; z-index: 0;">
    <div class="child1" style="background-color:red; position: relative; z-index: 2;"></div>
  </div>
  <div class="box2" style="position: relative; z-index: 0;">
    <div class="child2" style="background-color:blue; position: relative; z-index: 1; margin: -50px 0 0 50px;"></div>
  </div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

此时，我们发现，仅仅修改了`.box1/.box2`的 `z-index` 属性值改为数值 0，最终结果完全相反。这时`.child2` 覆盖在了`.child1` 上面。原因是什么呢？很简单：因为设置 `z-index`: 0 后，`.box1/.box2`产生了各自的层叠上下文，这时候要比较`.child1/.child2` 的层叠关系完全由父元素`.box1/.box2`的层叠关系决定。但是`.box1/.box2`的 `z-index` 值都为 0，都是块级元素（所以它们的层叠等级，层叠顺序是相同的），这种情况下，在 `DOM` 结构中后面的覆盖前面的，所以`.child2` 就在上面。

## CSS3 中的属性对层叠上下文的影响

- `CSS3` 中出现了很多新属性，其中一些属性对层叠上下文也产生了很大的影响。如下：
- 父元素的 `display` 属性值为 `flex|inline-flex`，子元素 `z-index` 属性值不为 `auto` 的时候，子元素为层叠上下文元素；
- 元素的 `opacity` 属性值不是 `1`；
- 元素的 `transform` 属性值不是 `none`；
- 元素 `mix-blend-mode` 属性值不是 `normal`；
- 元素的 `filter` 属性值不是 `none`；
- 元素的 `isolation` 属性值是 `isolate`；
- `will-change` 指定的属性值为上面任意一个；
- 元素的`-webkit-overflow-scrolling` 属性值设置为 `touch`。

CSS3 中，元素属性满足以上条件之一，就会产生层叠上下文。我们用第 1 条来做一个简单的解释说明。

```html
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="parent" style="background-color:blue;">
    <div class="child" style="background-color:red; position: relative; z-index: -1; margin: 50px 0 0 50px;"></div>
  </div>
</body>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="250px" srcdoc='
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="parent" style="background-color:blue; z-index: 1;">
    <div class="child" style="background-color:red; position: relative; z-index: -1; margin: 50px 0 0 50px;"></div>
  </div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

我们发现，`.child` 被`.parent` 覆盖了。分析一下： 虽然`.parent` 设置了 `z-index` 属性值，但是没有设置 `position` 属性，`z-index` 无效，所以没有产生层叠上下文，`.parent` 还是普通的块级元素。此时，在层叠顺序规则中，`z-index` 值小于 0 的`.child` 会被普通的 `block` 块级元素`.parent` 覆盖。

对于上面的栗子，我们只修改 `body` 的属性，设置 `display: flex`，其余属性和 `DOM` 结构不变。

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="250px" srcdoc='
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body style="display: flex;">
  <div class="parent" style="background-color:blue; z-index: 1;">
    <div class="child" style="background-color:red; position: relative; z-index: -1; margin: 50px 0 0 50px;"></div>
  </div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

当给 `body` 设置 `display: flex` 时，`.parent` 就变成层叠上下文元素，根据层叠顺序规则，层叠上下文元素的 `background/border` 的层叠等级小于 `z-index` 值小于 0 的元素的层叠等级，所以 `z-index` 值为-1 的`.child` 在`.parent` 上面。

> 这里注意，背景`background/border`和`.child`元素处在同一个层叠上下文（`.parent`）下，所以才会比较他们的层叠顺序

或者直接在 `.parent` 上增加 `css` 属性 `transform: translate(0, 0)`，也可以达到同样的效果

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="250px" srcdoc='
<style type="text/css">
  div {
    width: 200px;
    height: 100px;
    color: white;
    border: 1px solid white;
  }
</style>
<body>
  <div class="parent" style="background-color:blue; z-index: 1; transform: translate(0, 0)">
    <div class="child" style="background-color:red; position: relative; z-index: -1; margin: 50px 0 0 50px;"></div>
  </div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

## 参考

[彻底搞懂 CSS 层叠上下文、层叠等级、层叠顺序、z-index](https://blog.csdn.net/llll789789/article/details/97562099)  
[深入理解 CSS 中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
