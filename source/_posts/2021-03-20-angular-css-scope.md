---
layout: post
title: angular css样式作用域
tags: [javascript, angular]
comments: true
date: 2021-03-20 16:56:01
---

在使用`angular`时，我们发现每个组件的`css`作用域都是独立的，且无法修改引用组件的样式，这是因为：  

<!-- more -->
在封装组件的时候，组件会分配一个唯一的属性，并将这个属性添加到组件内的每一个标签上，封装后的样式表的选择器中会加上属性选择器，从而形成了一个样式表的作用域，域内样式不会影响外部  
这与`Vue`中的`scoped`属性原理一样，我们引入`ViewEncapsulation `类就可以解决这个问题

## ViewEncapsulation
```
enum ViewEncapsulation {
  Emulated
  Native
  None
}
```
`ViewEncapsulation` 的值是用来指定，在封装Angular组件的时候，如何处理样式和标签之间的关系，默认值是：`ViewEncapsulation.Emulated`;
用法是：
```
import { ViewEncapsulation } from "@angular/core";

@Component({
  templateUrl: "./login.html",
  styleUrls: ['./login.css','/bootstrap/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.Emulated
})
```
### ViewEncapsulation.Emulated
这种方式在封装组件的时候，会给组件分配一个唯一的属性，并将这个属性添加到组件内的每一个标签上，封装后的样式表的选择器中会加上属性选择器，从而形成了一个样式表的作用域，域内样式不会影响外部，但是组件会受到父级样式的影响



### ViewEncapsulation.Native
这种方式把组件封装成一个shadow DOM；


### ViewEncapsulation.None
这种方法的样式表为全局的作用域，组件中声明的样式既可以影响到本组件，同时也会影响全局样式表；反过来，该组件收全局样式表的影响。

两种情况：
1、外部样式表作用的标签是静态的（如`bootstrap`）:

直接在组件元数据中引入，使用默认方式：
```
@Component({
  templateUrl: "./login.html",
  styleUrls: ['./login.css','/bootstrap/css/bootstrap.min.css']
})
```
2、样式表作用于动态创建的标签（如创建一个富文本编辑器`CKEditor`，`wangEditor`等）：

因为标签是动态创建的，也就是说打包组件的时候，引入的外部样式表作用的标签尚未存在（代码运行的时候，new一个Editor之后才会创建标签），而打包的时候却给所有选择器都添加了一个属性选择器，因此，动态创建的标签就不会被引入的样式表影响。也就是说新创建的标签不属于组件这个作用域。为了避免这种情况，只能在打包组件的时候，不给这个组件创建作用于：
```
import { ViewEncapsulation } from "@angular/core";

@Component({
  templateUrl: "./login.html",
  styleUrls: ['./login.css','/bootstrap/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})
```

## 参考
[在Angular组件中引入外部样式](https://blog.csdn.net/u011135260/article/details/78196516)
