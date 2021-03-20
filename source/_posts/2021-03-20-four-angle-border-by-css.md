---
layout: post
title: 使用css实现4个角边框
tags: [css]
comments: true
date: 2021-03-20 17:45:39
---

目前发现2种实现方式，使用`css3 background` 或者使用伪元素
<!-- more -->
## css3 background实现
```
.rect {
    position: absolute; 
    top: 20px;
    left: 20px; 
    width: 100px; 
    height: 100px; 
    background: linear-gradient(to left, #f00, #f00) left top no-repeat, 
                linear-gradient(to bottom, #f00, #f00) left top no-repeat, 
                linear-gradient(to left, #f00, #f00) right top no-repeat,
                linear-gradient(to bottom, #f00, #f00) right top no-repeat, 
                linear-gradient(to left, #f00, #f00) left bottom no-repeat,
                linear-gradient(to bottom, #f00, #f00) left bottom no-repeat,
                linear-gradient(to left, #f00, #f00) right bottom no-repeat,
                linear-gradient(to left, #f00, #f00) right bottom no-repeat;
    background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;  
}
```
```
<div class="rect"></div>
```
<iframe width="100%" height="150px" srcdoc="
<style type='text/css'>
.rect {
    position: absolute; 
    top: 20px;
    left: 20px; 
    width: 100px; 
    height: 100px; 
    background: linear-gradient(to left, #f00, #f00) left top no-repeat, 
                linear-gradient(to bottom, #f00, #f00) left top no-repeat, 
                linear-gradient(to left, #f00, #f00) right top no-repeat,
                linear-gradient(to bottom, #f00, #f00) right top no-repeat, 
                linear-gradient(to left, #f00, #f00) left bottom no-repeat,
                linear-gradient(to bottom, #f00, #f00) left bottom no-repeat,
                linear-gradient(to left, #f00, #f00) right bottom no-repeat,
                linear-gradient(to left, #f00, #f00) right bottom no-repeat;
    background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;  
}
</style>
<div class='rect'></div>
">
</iframe>


## 伪元素实现
```
#border{
  width: 100px;
  height: 50px;
  position: relative;
}
#border:after{
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-left: 1px solid black;
  border-top: 1px solid black;
}
#border:before{
  position: absolute;
  top: 0;
  right: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-right: 1px solid black;
  border-top: 1px solid black;
}
#border2{
  width: 100px;
  height: 50px;
  position: relative;
}
#border2:after{
  position: absolute;
  bottom: 0;
  left: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}
#border2:before{
  position: absolute;
  bottom: 0;
  right: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}
```
```
<div id='border'></div>
<div id='border2'></div>
```
<iframe width="100%" height="150px" srcdoc="
<style type='text/css'>
#border{
  width: 100px;
  height: 50px;
  position: relative;
}
#border:after{
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-left: 1px solid black;
  border-top: 1px solid black;
}
#border:before{
  position: absolute;
  top: 0;
  right: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-right: 1px solid black;
  border-top: 1px solid black;
}
#border2{
  width: 100px;
  height: 50px;
  position: relative;
}
#border2:after{
  position: absolute;
  bottom: 0;
  left: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}
#border2:before{
  position: absolute;
  bottom: 0;
  right: 0;
  content: '';
  display: block;
  height: 25%;
  width: 25%;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
<div id='border'></div>
<div id='border2'></div>
">
</iframe>

## 参考
[div只有四个角有边框怎么实现？](https://segmentfault.com/q/1010000011882269)