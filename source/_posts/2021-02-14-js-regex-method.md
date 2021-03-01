---
layout: post
title: js正则方法
tags: [javascript]
comments: true
date: 2021-02-14 15:08:27
---

js有很多正则方法：`test、search、match、replace、exec`，他们之间的区别时候什么呢

<!-- more -->

定义正则：
```
 var re = new RegExp(“a”);  //RegExp对象。参数就是我们想要制定的规则。当参数为变量时，可以使用这种方式
 var re = /a/;   // 简写方法 推荐使用 性能更好  不能为空 不然以为是注释 ，
```

javascript中正则表达式支持的正则表达式有三个，`g、i、m`，分别代表全局匹配、忽略大小写、多行模式。三种属性可以自由组合共存。

## test
在字符串中查找符合正则的内容，若查找到返回true,反之返回false.  
用法：`reg.test(str)`
```
var str = '374829348791';
   var re = /\D/;      //  \D代表非数字
   if (re.test(str)) {   // 返回true,代表在字符串中找到了非数字。
       console.log('不全是数字');
   } else {
       console.log('全是数字');
   }
```

## search
在字符串搜索符合正则的内容，搜索到就返回出现的位置（从0开始，如果匹配的不只是一个字母，那只会返回第一个字母的位置）， 如果搜索失败就返回 -1  
用法: str.search(reg)
```
var str = 'abcdef';

   var re = /B/i;

   //var re = new RegExp('B','i'); 也可以这样写

   console.log( str.search(re) ); // 1
```

## match
在字符串中搜索复合规则的内容，搜索成功就返回内容，格式为数组，失败就返回null。
用法：str.match(reg)，
```
var str = 'haj123sdk54hask33dkhalsd879';
   var re = /\d+/g;   
   // 每次匹配至少一个数字  且全局匹配  如果不是全局匹配，当找到数字123，它就会停止了。
   // 就只会弹出123.加上全局匹配，就会从开始到结束一直去搜索符合规则的。如果没有加号，匹配的结果就是1，2，3，5，4，3，3，8，7，9并不是我们想要的，
   // 有了加号，每次匹配的数字就是至少一个了。
   console.log( str.match(re) );   // [123，54，33，879]
```

## replace
查找符合正则的字符串，就替换成对应的字符串。返回替换后的内容。
用法： str.replace(//,新的字符串/回调函数)
第一个参数也可以是字符串

```
var str = "我爱北京天安门，天安门上太阳升。";
var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
var str2 = str.replace(re, function (str) {
    console.log(str); //用来测试：函数的第一个参数代表每次搜索到的符合正则的字符，所以第一次str指的是北京 第二次str是天安门 第三次str是天安门
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += '*';
    }
    return result; //所以搜索到了几个字就返回几个*
});
console.log(str2)  //我爱*****，***上太阳升
//整个过程就是，找到北京，替换成了两个*，找到天安门替换成了3个*，找到天安门替换成3个*。

```
replace()的第二个参数replacement是一个字符串，表示替换的文本，其中可以使用一些特殊字符串。
* $&：匹配的子字符串。
* $` ：匹配结果前面的文本。
* $'：匹配结果后面的文本。
* $n：匹配成功的第n组内容，n是从1开始的自然数。这个参数生效的前提是，第一个参数必须是正则* 表达式。
* $$：指代美元符号$。

## exec
和match方法一样，搜索符合规则的内容，并返回内容，格式为数组，失败就返回null。
```
    var testStr = "now test001 test002";
    var re = /test(\d+)/; //只匹配一次
    var r = "";
    var r = re.exec(testStr)
    console.log(r);// test001  001 返回匹配结果，以及子项
    console.log(r.length); //2   返回内容的长度
    console.log(r.input); //now test001 test002    代表每次匹配成功的字符串
    console.log(r[0]);   //test001
    console.log(r[1]);  //001    代表每次匹配成功字符串中的第一个子项 (\d+)
    console.log(r.index );   //  4   每次匹配成功的字符串中的第一个字符的位置

```

## replaceAll
es6新增，历史上，字符串的实例方法replace()只能替换第一个匹配。
```
'aabbcc'.replace('b', '_')
// 'aa_bcc'
```
上面例子中，replace()只将第一个b替换成了下划线。  
如果要替换所有的匹配，不得不使用正则表达式的g修饰符。
```
'aabbcc'.replace(/b/g, '_')
// 'aa__cc'
```
正则表达式毕竟不是那么方便和直观，ES2021 引入了replaceAll()方法，可以一次性替换所有匹配。
```
'aabbcc'.replaceAll('b', '_')
// 'aa__cc'

```
如果searchValue是一个不带有g修饰符的正则表达式，replaceAll()会报错。这一点跟replace()不同。
```
// 不报错
'aabbcc'.replace(/b/, '_')

// 报错
'aabbcc'.replaceAll(/b/, '_')
```
上面代码中，searchValue是搜索模式，可以是一个字符串，也可以是一个全局的正则表达式（带有g修饰符）。

## [matchAll](https://es6.ruanyifeng.com/#docs/regex#String-prototype-matchAll)

