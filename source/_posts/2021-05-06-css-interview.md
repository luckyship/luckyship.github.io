---
layout: post
title: css常用知识
tags: [css, web]
categories: review
comments: true
date: 2021-05-06 10:35:44
---

## 什么是盒子模型

盒模型分为标准盒模型和怪异盒模型（IE）

```css
box-sizing : content-box //标准盒模型
box-sizing : border-box //怪异盒模型
```

- 标准盒模型: 这种盒模型设置`width`的时候的值是内容区的宽度, 如果再设置`padding`和`margin`, `border`的话盒子的实际宽度会增大；
- 怪异盒模型: 这种盒子的`width`设置的值为盒子实际的宽度, `border`和`padding`的设置不会影响盒子的实际宽度和高度

## CSS 新特性

```
transition //过渡
transform //旋转、缩放、移动或者倾斜
animation //动画
gradient //渐变
shadow //阴影
border-radius //圆角
```

<!-- more -->

## 显示省略号样式

```css
overflow: hidden;
text-overflow: ellipsis;
```

## link 和 @import 的区别

- link 属于 HTML 标签，而@import 是 CSS 提供的。
- 页面加载的时候，link 会同时被加载，而@import 引用的 CSS 会等到页面被加载完再加载。
- import 只在 IE5 以上才能识别，而 link 是 HTML 标签，无兼容问题。
- link 样式的权重高于@import 样式的权重。

## 介绍一下标准的 CSS 的盒子模型？与低版本 IE 的盒子模型有什么不同的？

标准盒子模型：宽度=内容的宽度 `（content）+ border + padding + margin`

低版本 IE 盒子模型：宽度=内容宽度 `（content+border+padding）+ margin`

## box-sizing 属性？

用来控制元素的盒子模型的解析模式，默认为 content-box
context-box：W3C 的标准盒子模型，设置元素的 height/width 属性指的是 content 部分的高/宽
border-box：IE 传统盒子模型。设置元素的 height/width 属性指的是 border + padding + content 部分的高/宽

## CSS 选择器有哪些？哪些属性可以继承？

CSS 选择符：id 选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（\*）、属性选择器（a[rel=”external”]）、伪类选择器（a:hover, li:nth-child）

可继承的属性： `font-size, font-family, color`

不可继承的样式： `border, padding, margin, width, height`

优先级（就近原则）：!important > [ id > class > tag ]

> !important 比内联优先级高

## CSS 优先级算法如何计算？

- 元素选择符： 1
- class 选择符： 10
- id 选择符：100
- 元素标签：1000

`!important` 声明的样式优先级最高，如果冲突再进行计算。
如果优先级相同，则选择最后出现的样式。
继承得到的样式的优先级最低。

## CSS3 新增伪类有那些?

- p:first-of-type 选择属于其父元素的首个元素
- p:last-of-type 选择属于其父元素的最后元素
- p:only-of-type 选择属于其父元素唯一的元素
- p:only-child 选择属于其父元素的唯一子元素
- p:nth-child(2) 选择属于其父元素的第二个子元素
- :enabled :disabled 表单控件的禁用状态。
- :checked 单选框或复选框被选中。

## display 有哪些值？说明他们的作用?

- inline（默认）–内联
- none–隐藏
- block–块显示
- table–表格显示
- list-item–项目列表
- inline-block

## position 的值

- static（默认）：按照正常文档流进行排列；
- relative（相对定位）：不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定\* 位；
- absolute(绝对定位)：参考距其最近一个不为 static 的父级元素通过 top, bottom, left, right \* 定位；
- fixed(固定定位)：所固定的参照对像是可视窗口。

## CSS3 有哪些新特性

- RGBA 和透明度
- background-image background-origin(content-box/padding-box/border-box) \* background-size background-repeat
- word-wrap（对长的不可分割单词换行）word-wrap：break-word
- 文字阴影：text-shadow： 5px 5px 5px #FF0000; （水平阴影，垂直阴影，模糊距离，阴影颜色）
- font-face 属性：定义自己的字体
- 圆角（边框半径）：border-radius 属性用于创建圆角
- 边框图片：border-image: url(border.png) 30 30 round
- 盒阴影：box-shadow: 10px 10px 5px #888888
- 媒体查询：定义两套 css，当浏览器的尺寸变化时会采用不同的属性

## 用纯 CSS 创建一个三角形的原理是什么

首先，需要把元素的宽度、高度设为 0。然后设置边框样式。

## CSS 里的 visibility 属性有个 collapse 属性值？在不同浏览器下以后什么区别？

当一个元素的 `visibility` 属性被设置成 `collapse` 值后，对于一般的元素，它的表现跟 hidden 是一样的。

chrome 中，使用 `collapse` 值和使用 `hidden` 没有区别。
firefox，opera 和 IE，使用 `collapse` 值和使用 `display：none` 没有什么区别。

## display:none 与 visibility：hidden 的区别？

`display：none` 不显示对应的元素，在文档布局中不再分配空间（回流+重绘）
`visibility：hidden` 隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

## position 跟 display、overflow、float 这些特性相互叠加后会怎么样

`display` 属性规定元素应该生成的框的类型； `position` 属性规定元素的定位类型； `float` 属性是一种布局方式，定义元素在哪个方向浮动。
类似于优先级机制： `position：absolute/fixed` 优先级最高，有他们在时， `float` 不起作用， `display` 值需要调整。 `float` 或者 `absolute` 定位的元素，只能是块元素或表格。

## 对 BFC 规范(块级格式化上下文：block formatting context)的理解？

BFC 规定了内部的 Block Box 如何布局。
定位方案：

- 内部的 Box 会在垂直方向上一个接一个放置。
- Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触。
- BFC 的区域不会与 float box 重叠。
- BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。
- 计算 BFC 的高度时，浮动元素也会参与计算。
  满足下列条件之一就可触发 BFC
- 根元素，即 html
- float 的值不为 none（默认）
- overflow 的值不为 visible（默认）
- display 的值为 inline-block、table-cell、table-caption
- position 的值为 absolute 或 fixed

## 浏览器是怎样解析 CSS 选择器的？

CSS 选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。  
而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。

### [参考](https://luckyship.gitee.io/2021/01/16/2021-01-16-css-match-principle/)

## 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

### [参考](https://luckyship.gitee.io/2019/10/22/2019-10-22-percentage-of-css/)

## 全屏滚动的原理是什么？用到了 CSS 的哪些属性？

原理：有点类似于轮播，整体的元素一直排列下去，假设有 5 个需要展示的全屏页面，那么高度是 500%，只是展示 100%，剩下的可以通过 transform 进行 y 轴定位，也可以通过 margin-top 实现
overflow：hidden；transition：all 1000ms ease；

## 什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的 IE？

响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。  
基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
页面头部必须有 meta 声明的 viewport。

## ::before 和 :after 中双冒号和单冒号有什么区别？解释一下这 2 个伪元素的作用

单冒号(:)用于 CSS3 伪类，双冒号(::)用于 CSS3 伪元素。  
`::` before 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于 dom 之中，只存在在页面之中。

## 你对 line-height 是如何理解的？

行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS 中起高度作用的是 height 和 `line-height` ，没有定义 height 属性，最终其表现作用一定是 `line-height` 。
单行文本垂直居中：把 `line-height` 值设置为 height 一样大小的值可以实现单行文字的垂直居中，其实也可以把 height 删除。
多行文本垂直居中：需要设置 display 属性为 `inline-block` 。

## 怎么让 Chrome 支持小于 12px 的文字

```
	font-size: 12px;
	transform: 0.8; // 缩小比例
```

## 如果需要手动写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为 1/60＊1000ms ＝ 16.7ms

## li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符, 这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为 0，就没有空格了。
解决方法：

- 可以将`<li>`代码全部写在一排
- 浮动 li 中 float：left
- 在 ul 中用 font-size：0（谷歌不支持）；可以使用 letter-space：-3px

## display:inline-block 什么时候会显示间隙？

- 有空格时候会有间隙 解决：移除空格
- margin 正值的时候 解决：margin 使用负值
- 使用 font-size 时候 解决：font-size:0、letter-spacing、word-spacing

## 有一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度?

外层 div 使用 position：relative；高度要求自适应的 div 使用 position: absolute; top: 100px; bottom: 0; left: 0

## style 标签写在 body 后与 body 前有什么区别？

页面加载自上而下 当然是先加载样式。
写在 body 标签后由于浏览器以逐行方式对 HTML 文档进行解析，当解析到写在尾部的样式表（外联或写在 style 标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在 windows 的 IE 下可能会出现 FOUC 现象（即样式失效导致的页面闪烁问题）
