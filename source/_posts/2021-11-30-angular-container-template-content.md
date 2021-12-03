---
layout: post
title: ng-template、ng-container、ng-content 的用法
tags: [javascript, angular]
comments: true
date: 2021-11-30 16:51:34
---

### ng-container

**ng-container**：此标签不渲染成 DOM；默认显示标签内部内容，也可以使用结构型指令（ngIf、ngFor...）

官网详细介绍：[https://angular.cn/guide/structural-directives](https://angular.cn/guide/structural-directives)

eg：代码块

```html
<ng-container> <p>Hello World !!!</p></ng-container>
```

网页渲染结果

```html
<p _ngcontent-vkg-c0="">Hello World !!!</p>
```

<!-- more -->

### ng-content

**ng-content：**父组件调用子组件时，将父组件内容投射到子组件指定位置（子组件中 ng-content 所在位置）；类似 VUE 中的插槽。分为默认投射，具名投射。

1）默认投射 - 子组件中只有一个 ng-content 时：eg

父组件中引入子组件

```html
<app-child-com> <p>- parent component content !!! -</p></app-child-com>
```

子组件

```html
<p>child component content - begin</p>
<ng-content></ng-content>
<p>child component content - end</p>
```

显示效果

```
child component content - begin
- parent component content !!!
- child component content - end
```

2）具名投射 - 子组件有多个 ng-content，需要指定名字进行指定位置投射：eg

父组件内容

```html
<app-child-com>
  <header>header - parent component content !!! -</header>
  <div id="demo">id selector - parent component content !!! -</div>
  <div name="demo">name - parent component content !!! -</div>
</app-child-com>
```

子组件内容

```html
<p>child component content</p>
<ng-content select="header"></ng-content>
<p>child component content</p>
<ng-content select="#demo"></ng-content>
<p>child component content</p>
<ng-content select="[name=demo]"></ng-content>
```

使用 select 属性，支持 CSS 选择器

### ng-template

**ng-template：**模板元素，默认情况内部元素不可见。使用方法：

#### 方法一：使用 ngIf 属性，值为 true 显示内容

```html
<ng-template [ngIf]="condition"> <p>Hello World !!!</p></ng-template>
```

扩展：以下代码会转换为以上代码显示

```html
<p *ngIf="condition">Hello World !!!</p>
```

#### 方法二： 使用  ViewContainerRef，TemplateRef，ViewChild：eg

组件 HTML

```html
<!-- myTpl：模板引用变量；name1：模板输入变量；name：输入变量值；foo：默认输入变量 -->
<ng-template #myTpl let-name1="name" let-foo> <p>调用的模板数据：{{ name1 }} -- {{ foo }}</p></ng-template>
```

组件 TS，以上代码默认不起任何作用，不会渲染 DOM

```js
// Angular8 必填 {static: boolean} 属性true：变更检测之前解析查询结果；反之 // 获取指定模板（myTpl）引用 tpl
@ViewChild('myTpl', {static: true}) tpl: TemplateRef<any>;
constructor(  private viewContainer: ViewContainerRef) { }// $implicit：默认输入变量取值
ngOnInit() {  this.viewContainer.createEmbeddedView(this.tpl, { $implicit: "Hello", name: 'World' });}
```

效果，显示模板内容

#### 方法三：使用  ngTemplateOutlet 结构型指令：eg

组件 HTML

```html
<!-- myTpl：模板引用变量；context：输入对象数据 -->
<div><ng-container *ngTemplateOutlet="myTpl; context: context"></ng-container></div>
<!-- myTpl：模板引用变量；name1：模板输入变量；name：输入变量值；foo：默认输入变量 -->
<ng-template #myTpl let-name1="name" let-foo> <p>调用的模板数据：{{ name1 }} -- {{ foo }}</p></ng-template>
```

组件 TS

```js
context = { $implicit: "World", name: "liyq" };
```

可以将指定模板插入到指定位置，TS 中只需要定义数据

#### 方法四：使用自定义结构型指令，和 ngIf 类似：eg

1）ng g d unless 创建一个名为 unless 的结构型指令

unless.directive.ts

```js
import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({  selector: '[appUnless]'})
export class UnlessDirective {
  constructor(    private templateRef: TemplateRef<any>,    private viewContainer: ViewContainerRef  ) { }

  // 必须使用 set 方法
  @Input() set appUnless(condition: boolean) {
    if(!condition) {
      // 下面是渲染模板数据的核心
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

组件 HTML

```html
<!-- 模板渲染结果和 condition 的 Boolean 值没有关系，主要的作用为作为参数传递给自定义的结构指令 -->
<ng-template [appUnless]="condition"> <p>使用结构型指令调用模板</p></ng-template>
```
