---
layout: post
title: import和require的区别
tags: [javascript]
comments: true
date: 2021-01-02 15:43:34
---

我们在使用前端框架、es6语法时，常常会用到`require`和`import`，那么他们的区别时什么呢

<!-- more -->

## 区别
### 遵循规范
* require 是 AMD规范引入方式
* import是es6的一个语法标准，如果要兼容浏览器的话必须转化成es5的语法

### 调用时间
* require是运行时调用，所以require理论上可以运用在代码的任何地方
* import是编译时调用，所以必须放在文件开头

### 本质
* require是赋值过程，其实require的结果就是对象、数字、字符串、函数等，再把require的结果赋值给某个变量
* import是解构过程，但是目前所有的引擎都还没有实现import，我们在node中使用babel支持ES6，也仅仅是将ES6转码为ES5再执行，import语法会被转码为require

## import的用法
### import导入模块
import的语法跟require不同，而且import必须放在文件的最开始，且前面不允许有其他逻辑代码，这和其他所有编程语言风格一致。

import的使用和export一样，也挺复杂，可以在 这里 大致了解。举几个例子：
```
import $ from 'jquery';
import * as _ from '_';
import {a,b,c} from './a';
import {default as alias, a as a_a, b, c} from './a';
```
`import`后面跟上花括号的形式是最基本的用法，花括号里面的变量与`export`后面的变量一一对应。这里，你必须了解 对象的解构赋值 的知识，没这知识，你根本没法在这里装逼。了解了解构赋值，这里的"一一对应"的关系就能具体理解了。

### as关键字
编程的同学对as都容易理解，简单的说就是取一个别名。`export`中可以用，`import`中其实可以用：
```
// a.js
var a = function() {};
export {a as fun};

// b.js
import {fun as a} from './a';
a();
```
上面这段代码，`export`的时候，对外提供的接口是`fun`，它是`a.js`内部a这个函数的别名，但是在模块外面，认不到a，只能认到`fun`。

`import`中的`as`就很简单，就是你在使用模块里面的方法的时候，给这个方法取一个别名，好在当前的文件里面使用。之所以是这样，是因为有的时候不同的两个模块可能通过相同的接口，比如有一个c.js也通过了`fun`这个接口：
```
// c.js
export function fun() {};
```
如果在b.js中同时使用a和c这两个模块，就必须想办法解决接口重名的问题，as就解决了。

### default关键字
其他人写教程什么的，都把`default`放到`export`那个部分，我觉得不利于理解。在`export`的时候，可能会用到`default`，说白了，它其实是别名的语法糖：
```
// d.js
export default function() {}

// 等效于：
function a() {};
export {a as default};
```
在import的时候，可以这样用：
```
import a from './d';

// 等效于，或者说就是下面这种写法的简写，是同一个意思
import {default as a} from './d';
```

这个语法糖的好处就是`import`的时候，可以省去花括号`{}`。简单的说，如果`import`的时候，你发现某个变量没有花括号括起来（没有*号），那么你在脑海中应该把它还原成有花括号的`as`语法。

所以，下面这种写法你也应该理解了吧：
```
import $,{each,map} from 'jquery';
import后面第一个 $ 是 {defalut as $} 的替代写法。
```
### *符号
*就是代表所有，只用在import中，我们看下两个例子：
```
import * as _ from '';
```
在意义上和 `import _ from '';` 是不同的，虽然实际上后面的使用方法是一样的。它表示的是把 '_' 模块中的所有接口挂载到 _ 这个对象上，所以可以用 `_.each` 调用某个接口。

另外还可以通过*号直接继承某一个模块的接口：
```
export * from '_';

// 等效于：
import * as all from '_';
export all;
```
*符号尽可能少用，它实际上是使用所有`export`的接口，但是很有可能你的当前模块并不会用到所有接口，可能仅仅是一个，所以最好的建议是使用花括号，用一个加一个。

### 该用require还是import？
`require`的使用非常简单，它相当于`module.exports`的传送门，`module.exports`后面的内容是什么，`require`的结果就是什么，对象、数字、字符串、函数……再把`require`的结果赋值给某个变量，相当于把`require`和`module.exports`进行平行空间的位置重叠。

而且`require`理论上可以运用在代码的任何地方，甚至不需要赋值给某个变量之后再使用，比如：
```
require('./a')(); // a模块是一个函数，立即执行a模块函数
var data = require('./a').data; // a模块导出的是一个对象
var a = require('./a')[0]; // a模块导出的是一个数组
```
你在使用时，完全可以忽略模块化这个概念来使用`require`，仅仅把它当做一个`node`内置的全局函数，它的参数甚至可以是表达式：
```
require(process.cwd() + '/a');
```
但是`import`则不同，它是编译时的（`require`是运行时的），它必须放在文件开头，而且使用格式也是确定的，不容置疑。它不会将整个模块运行后赋值给某个变量，而是只选择`import`的接口进行编译，这样在性能上比`require`好很多。

从理解上，`require`是赋值过程，`import`是解构过程，当然，`require`也可以将结果解构赋值给一组变量，但是`import`在遇到`default`时，和`require`则完全不同：` var $ = require('jquery'); `和 `import $ from 'jquery'` 是完全不同的两种概念。

上面完全没有回答"改用require还是import？"这个问题，因为这个问题就目前而言，根本没法回答，因为目前所有的引擎都还没有实现import，我们在node中使用babel支持ES6，也仅仅是将ES6转码为ES5再执行，import语法会被转码为require。这也是为什么在模块导出时使用module.exports，在引入模块时使用import仍然起效，因为本质上，import会被转码为require去执行。

但是，我们要知道这样一个道理，ES7很快也会发布，js引擎们会尽快实现ES6标准的规定，如果一个引擎连标准都实现不了，就会被淘汰， ES6是迟早的事 。如果你现在仍然在代码中部署require，那么等到ES6被引擎支持时，你必须升级你的代码，而如果现在开始部署import，那么未来可能只需要做很少的改动。

## 参考
[浅谈require和import](https://blog.csdn.net/weixin_42966484/article/details/82889608)
