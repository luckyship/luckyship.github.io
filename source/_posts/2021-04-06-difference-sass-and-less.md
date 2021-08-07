---
layout: post
title: less和sass的区别
tags: [css, less, sass]
categories: review
comments: true
date: 2021-04-06 22:20:21
---

`LESS` 和 `SCSS` 都属于 CSS 预处理器的范畴，也就是 CSS 的超集，但是两者的语法、如何使用和具体的功能实现还是有差异的。
<!-- more -->

## 声明和使用变量

> LESS 采用 `@` 符号，SCSS 采用 `$` 符号。

在下面的示例中，我们首先在规则外声明了一个名为 link-color 的变量，然后在名为 `#main` 的规则内声明一个名为 `width` 的变量，接着把 `width` 变量赋值给了 CSS 的 `width` 属性。

LESS:

```css
@link-color: #428bca;

#main {
  @width: 5em;
  width: @width;
}
```

SCSS:

```css
$link-color: #428bca;

#main {
  $width: 5em;
  width: $width;
}
```

## 变量插值（Variable Interpolation）

> LESS 采用 `@{xxxx}` 的形式，SCSS 采用 `#{xxxx}` 的形式。

LESS：

```css
// Variables 
@my-selector: banner;

// Usage 
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```

SCSS:

```css
// Variables 
$my-selector: banner;

// Usage 
.#{$my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```

## Mixins 的定义、使用及参数

### 定义方法

定义一个 Mixin：LESS 使用 `dot` 符号（也就是句点）来定义一个 Mixin，并且可以把任意的 CSS 规则作为 Mixin 使用；SCSS 使用 `@mixin` 指令来定义一个 Mixin。

示例 - 来自 BootStrap 的 alert-variant Mixin 的定义
LESS：

```css
.alert-variant(@background; @border; @text-color) {
  background-color: @background;
  border-color: @border;
  color: @text-color;

  hr {
    border-top-color: darken(@border, 5%);
  }

  .alert-link {
    color: darken(@text-color, 10%);
  }
}
```

SCSS:

```css
@mixin alert-variant($background, $border, $text-color) {
  background-color: $background;
  border-color: $border;
  color: $text-color;

  hr {
    border-top-color: darken($border, 5%);
  }

  .alert-link {
    color: darken($text-color, 10%);
  }
}
```

### 使用

使用 Mixin：LESS 仍是使用 `dot` 符号（句点），如果 Mixin 没有参数的话可以省略后面的圆括号；SCSS 使用 `@include` 指令来引入一个 Mixin。

示例 - 引入一个名为 center-block 的 Mixin。
LESS：

```css
.center-block() {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.a {
  .center-block;
}
```

SCSS:

```css
@mixin center-block() {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.a {
  @include center-block;
}
```

### 参数形式

如果存在多个参数的话，LESS 使用分号分隔；SCSS 使用逗号分隔。两者都支持为参数设置默认值。

示例 - 来在 BootStrap 的 form-control-validation Mixin 的使用

LESS：

```css
@state-success-text: #3c763d;
@state-success-bg: #dff0d8;
@state-success-border: darken(spin(@state-success-bg, -10), 5%);

@state-info-text: #31708f;
@state-info-bg: #d9edf7;
@state-info-border: darken(spin(@state-info-bg, -10), 7%);

@state-warning-text: #8a6d3b;
@state-warning-bg: #fcf8e3;
@state-warning-border: darken(spin(@state-warning-bg, -10), 5%);

@state-danger-text: #a94442;
@state-danger-bg: #f2dede;
@state-danger-border: darken(spin(@state-danger-bg, -10), 5%);

.box-shadow(@shadow) {
  -webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1 
  box-shadow: @shadow;
}

.form-control-validation(@text-color: #555; @border-color: #ccc; @background-color: #f5f5f5) {

  // Color the label and help text 
  .help-block,
  .control-label,
  .radio,
  .checkbox,
  .radio-inline,
  .checkbox-inline,
  &.radio label,
  &.checkbox label,
  &.radio-inline label,
  &.checkbox-inline label {
    color: @text-color;
  }

  // Set the border and box shadow on specific inputs to match 
  .form-control {
    border-color: @border-color;
    .box-shadow(inset 0 1px 1px rgba(0, 0, 0, .075)); // Redeclare so transitions work 

    &:focus {
      border-color: darken(@border-color, 10%);
      @shadow: inset 0 1px 1px rgba(0, 0, 0, .075),
      0 0 6px lighten(@border-color, 20%);
      .box-shadow(@shadow);
    }
  }

  // Set validation states also for addons 
  .input-group-addon {
    color: @text-color;
    border-color: @border-color;
    background-color: @background-color;
  }

  // Optional feedback icon 
  .form-control-feedback {
    color: @text-color;
  }
}

// Feedback states 
.has-success {
  .form-control-validation(@state-success-text; @state-success-text; @state-success-bg);
}

.has-warning {
  .form-control-validation(@state-warning-text; @state-warning-text; @state-warning-bg);
}

.has-error {
  .form-control-validation(@state-danger-text; @state-danger-text; @state-danger-bg);
}
```

SCSS:

```css
$state-success-text: #3c763d;
$state-success-bg: #dff0d8;
$state-success-border: darken(adjust_hue($state-success-bg, -10), 5%);

$state-info-text: #31708f;
$state-info-bg: #d9edf7;
$state-info-border: darken(adjust_hue($state-info-bg, -10), 7%);

$state-warning-text: #8a6d3b;
$state-warning-bg: #fcf8e3;
$state-warning-border: darken(adjust_hue($state-warning-bg, -10), 5%);

$state-danger-text: #a94442;
$state-danger-bg: #f2dede;
$state-danger-border: darken(adjust_hue($state-danger-bg, -10), 5%);

@mixin box-shadow($shadow) {
  -webkit-box-shadow: $shadow; // iOS <4.3 & Android <4.1 
  box-shadow: $shadow;
}

@mixin form-control-validation($text-color: #555, $border-color: #ccc, $background-color: #f5f5f5) {

  // Color the label and help text 
  .help-block,
  .control-label,
  .radio,
  .checkbox,
  .radio-inline,
  .checkbox-inline,
  &.radio label,
  &.checkbox label,
  &.radio-inline label,
  &.checkbox-inline label {
    color: $text-color;
  }

  // Set the border and box shadow on specific inputs to match 
  .form-control {
    border-color: $border-color;
    @include box-shadow(inset 0 1px 1px rgba(0, 0, 0, .075)); // Redeclare so transitions work 

    &:focus {
      border-color: darken($border-color, 10%);
      $shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px lighten($border-color, 20%);
      @include box-shadow($shadow);
    }
  }

  // Set validation states also for addons 
  .input-group-addon {
    color: $text-color;
    border-color: $border-color;
    background-color: $background-color;
  }

  // Optional feedback icon 
  .form-control-feedback {
    color: $text-color;
  }
}

// Feedback states 
.has-success {
  @include form-control-validation($state-success-text, $state-success-text, $state-success-bg);
}

.has-warning {
  @include form-control-validation($state-warning-text, $state-warning-text, $state-warning-bg);
}

.has-error {
  @include form-control-validation($state-danger-text, $state-danger-text, $state-danger-bg);
}
```

## 函数的使用

### 字符串函数

LESS 使用 e 或者 `~"xxxx"` 这种语法进行 CSS 转义；SCSS 本身并没有提供 CSS 转义的函数，要达到相同的效果可以使用变量插值（Variable Interpolation）实现。

LESS:

```css
@input-border-focus: #66afe9;

.box-shadow(@shadow) {
  -webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1 
  box-shadow: @shadow;
}

.form-control-focus(@color: @input-border-focus) {
  @color-rgba: rgba(red(@color), green(@color), blue(@color), .6);

  &:focus {
    border-color: @color;
    outline: 0;
    .box-shadow(~"inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px @{color-rgba}");
    //或者
    @str: "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px @{color-rgba}"
    .box-shadow(e(@str));
  }
}

.form-control {
  .form-control-focus();
}
```

SCSS:

```css
$input-border-focus: #66afe9;

@mixin box-shadow($shadow) {
  -webkit-box-shadow: $shadow; // iOS <4.3 & Android <4.1 
  box-shadow: $shadow;
}

@mixin form-control-focus($color: $input-border-focus) {
  $color-rgba: rgba(red($color), green($color), blue($color), .6);

  &:focus {
    border-color: $color;
    outline: 0;
    @include box-shadow(#{inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px $color-rgba});
  }
}

.form-control {
  @include form-control-focus();
}
```

### 颜色函数

调节色相，LESS 使用名为 `spin()` 的函数；SCSS 使用名为 `adjust_hue()` 的函数。

LESS:

```css
@state-success-border: darken(spin(@state-success-bg, -10), 5%);
```

SCSS:

```css
$state-success-border: darken(adjust_hue($state-success-bg, -10), 5%);
```

### 数学函数

LESS 提供了一些 SCSS 中并不具备的数学函数，在 SCSS 中只能通过自定义函数实现，然后通过 node-sass 的接口传递给编译器。

SCSS：

```css
// rotate for ie8 and blow
@mixin ie-rotate($rotation) {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=@{rotation})";
}

// rotate for ie8 and blow
// degrees unit
@mixin ie-rotate-via-degrees($degrees) {
  /* IE6-IE8 */
  $radians: parseInt("#{$degrees}") * PI() * 2 / 360;
  $costheta: cos("#{$radians}");
  $sintheta: sin("#{$radians}");
  $negsintheta: "#{$sintheta}"* -1;
  -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=@{costheta}, M12=@{negsintheta}, M21=@{sintheta}, M22=@{costheta})";
  zoom: 1;

  :root & {
    filter: none;
  }
}

// support rotate for all browsers
@mixin cross-rotate($degrees) {
  @include rotate($degrees);
  @include ie-rotate-via-degrees($degrees);
}

// Placeholder text
@mixin placeholder($color: $input-placeholder-color) {

  // Firefox
  &::-moz-placeholder {
    color: $color;
    opacity: 1; // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526
  }

  // Internet Explorer 10+
  &:-ms-input-placeholder {
    color: $color;
  }

  // Safari and Chrome
  &::-webkit-input-placeholder {
    color: $color;
  }
}
```

上述 Math 实现所需的 JS 文件：

```js
module.exports = {
  'parseInt($str)': function(str) {
    return parseInt(str, 10);
  },
  'Math.sin($degree)': function(degree) {
    return Math.sin(degree);
  },
  'Math.cos($degree)': function(degree) {
    return Math.cos(degree);
  },
  'Math.PI': Math.PI
}
```

有关函数的区别还有：
LESS 的 `fade()` 函数在 SCSS 中只能使用 `rgba()` 之类的实现，因为 SCSS 也没有这个函数。

## @import 的实现

> 像 `@media` , `@import` 这些带 @ 符号的在 CSS 中都称为 At-rules。

值的一提的是 LESS 和 SCSS 对 `@import` 实现的区别。

### LESS

* 如果扩展名为 `.css`，将文件识别为 CSS 文件
* 其他任何扩展名都将被作为 LESS 文件处理
* 没有扩展名会被附加一个 `.less` 的扩展名并且作为 LESS 文件处理

### SCSS

* 默认情况下，SCSS 的 @import 实现会试图寻找一个 Sass 文件进行导入。
* 但是在下列情况出现时，@import 会直接被编译为 CSS 的 @import at-rule 
* * 文件扩展名是 `.css`
* * 文件以 `http://` 开头
* * 文件名是一个 `url()`
* * `@import` 具有媒体查询
* SCSS 按约定认为下划线开始的文件是内联文件，不会被编译为单独的 CSS 文件输出。

示例

LESS:

```css
@import "foo";
@import "bar.less";
@import "foo.php"; // 当成 LESS 文件处理
@import "foo.css";
```

SCSS:

```css
@import "foo";
@import "foo.scss";
```

都会导入 foo.scss 文件。

## 其他区别

> LESS 和 SCSS 均使用 `&` 符号表示父选择器引用，但是 SCSS 的 `&` 符号只能出现在一个组合选择器的开始位置，LESS 则没有这个限制。

示例

LESS：

```css
.bg-variant(@color) {
  background-color: @color;

  a&:hover,
  a&:focus {
    background-color: darken(@color, 10%);
  }
}
```

SCSS:

```css
a {
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  body.firefox & {
    font-weight: normal;
  }
}
```

> SCSS 不支持 LESS 中的 `CSS Guard` 功能，比如 `if, when ...` ，在 SCSS 中需要换种方式实现。

LESS 示例：

```css
.my-optional-style() when (@my-option =true) {
  button {
    color: white;
  }
}

.my-optional-style();
```

Note：SCSS 需要换一种写法实现同样的功能。

> SCSS 支持 !default，一般是用在基础 Rule 的声明中，告诉使用者这是可以被覆盖的。

SCSS 示例：

```css
$primary: $blue !default;
$secondary: $gray-600 !default;
```

> SCSS支持 `if, else, for, each` 等方法, LESS不支持

SCSS:

```css
$type: monster;

p {
  @if $type==ocean {
    color: blue;
  }

  @else if $type==matador {
    color: red;
  }

  @else if $type==monster {
    color: green;
  }

  @else {
    color: black;
  }
}

@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}

@each $animal in puma,
sea-slug,
egret,
salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

> SCSS 不像 LESS 一样默认可以把 rule 作为 Mixin 使用，但是 SCSS 有类似的 `@extend` 指令；而 LESS 的 extend 语法看起来则像是伪类一样。

示例：

LESS:

```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}

.seriousError {
  @extend .error;
  border-width: 3px;
}
```

SCSS:

```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}

.seriousError {
  @extend .error;
  border-width: 3px;
}
```

集成 JavaScript 功能的方式：LESS 使用 @functions 指令，可以把 js 代码直接放到 ~ `xxx` 中间即可；SCSS 可以把 JS 代码放到一个单独的文件中，然后使用 node-sass编译的时候指定参数传给 node-sass。

LESS 示例：[ant-design/ant-design](https://github.com/ant-design/ant-design/blob/7fa05996957ef0eded21d810d71364d294ea947d/components/style/color/tinyColor.less)

SCSS 示例：  
命令

```bash
node-sass --output-style expanded --source-map true --precision 6 --functions components/style/custom.js components/button/style/index.scss components/button/style/index.css
```

* LESS 支持 lazy evaluation，但是  SCSS 不支持，所以在 LESS 中可以先使用再定义，但是在 SCSS 中一定要先定义再使用。
* SCSS 是不支持 Mixin 重载的, 也就是说 LESS 可以有同名但是参数个数不同的几个 Mixins, SCSS 同样名字的 Mixin 只能有一个.

## 参考

[less和sass或者scss 有什么区别吗？
](https://www.zhihu.com/question/270862074?sort=created)  
[LESS官网](https://less.bootcss.com/)  
[SASS官网](https://www.sass.hk/)
