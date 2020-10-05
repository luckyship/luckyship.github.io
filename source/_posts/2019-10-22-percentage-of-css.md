---
layout: post
title: "css中的百分比"
date: 2019-10-22
excerpt: "margin, padding, top等的百分比"
tags: [mongo, ruby]
comments: true
---

## css中的百分比
CSS支持多种单位形式，如百分比、px、pt、rem等，百分比和px是常用的单位，随着移动端和响应式的流行，rem、vh、vw也开始普遍使用。   
那么元素的百分比到底是怎样计算出来的？

### margin, padding
```
<div style="width: 20px">
    <div id="temp1" style="margin-top: 50%">Test top</div>
    <div id="temp2" style="margin-right: 25%">Test right</div>
    <div id="temp3" style="margin-bottom: 75%">Test bottom</div>
    <div id="temp4" style="margin-left: 100%">Test left</div>
</div>
```
得到的offset如下：
```
temp1.marginTop = 20px * 50% = 10px;
temp2.marginRight = 20px * 25% = 5px;
temp3.marginBottom = 20px * 75% = 15px;
temp4.marginLeft = 20px * 100% = 20px;
```
当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，```元素竖向的百分比设定也是相对于容器的宽度，而不是高度```

### 定位元素 top
```
<div style="height: 100px; width: 50px">
    <div id="temp1" style="position: relative; top: 50%">Test top</div>
    <div id="temp2" style="position: relative; right: 25%">Test right</div>
    <div id="temp3" style="position: relative; bottom: 75%">Test bottom</div>
    <div id="temp4" style="position: relative; left: 100%">Test left</div>
</div>
```
得到的offset如下：
```
temp1.top = 100px * 50% = 50px;
temp2.right = 50px * 25% = 12.5px;
temp3.bottom = 100px * 75% = 75px;
temp4.left = 50px * 100% = 50px;
```
所以，可以看到，当为定位元素时，top、bottom、right、left是按父元素对应的宽度和高度计算的。

### 补充
当我们改变书写模式为垂直的时候，margin等的参照就变为高度了
```
#demo{
    -webkit-writing-mode: vertical-rl; /* for browsers of webkit engine */
    writing-mode: tb-rl; /* for ie */
}
```
你是否觉得这不符合常规的感性认知？感性认知更多感觉应该横向参照包含块宽度，纵向参照包含块高度。   
其实这是为了要横向和纵向2个方向都创建相同的 margin，如果它们的参照物不一致，那就无法得到两个方向相同的留白。
#### 你可能会问那为什么要选择宽度做参照而不是高度呢？
这其实更多的要从 CSS 设计意图上去想，因为CSS的基础需求是排版，而通常我们所见的横排文字，其水平宽度一定（仔细回想一下，如果没有显式的定义宽度或者强制一行显示，都会遇到边界换行，而不是水平延展），垂直方向可以无限延展。但当书写模式为纵向时，其参照就变成了高度而不再是宽度了。
## 参考
[css中的百分比计算方法](https://www.runoob.com/w3cnote/css-percentage-calculation.html)
