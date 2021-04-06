---
layout: post
title: css中的换行
tags: [css, web]
comments: true
date: 2021-04-06 14:58:25
---

强制不换行:

`p { white-space:nowrap; }
`

自动换行:

`p { word-wrap:break-word; }
`

强制英文单词断行:

`p { word-break:break-all; }
`

> 注意：设置强制将英文单词断行，需要将行内元素设置为块级元素。
<!-- more -->

超出显示省略号:

```
p{text-overflow:ellipsis;overflow:hidden;}
```

## `white-space: normal|pre|nowrap|pre-wrap|pre-line|inherit;` 
* white-space: 属性设置如何处理元素内的空白
* normal: 默认。空白会被浏览器忽略。
* pre: 空白会被浏览器保留。其行为方式类似 HTML 中的 pre 标签。
* nowrap: 文本不会换行，文本会在在同一行上继续，直到遇到 br 标签为止。
* pre-wrap: 保留空白符序列，但是正常地进行换行。
* pre-line: 合并空白符序列，但是保留换行符。
* inherit: 规定应该从父元素继承 white-space 属性的值。

## `word-wrap: normal|break-word; `
* word-wrap: 属性用来标明是否允许浏览器在单词内进行断句，这是为了防止当一个字符串太长而找不到它的自然断句点时产生溢出现象。
* normal: 只在允许的断字点换行(浏览器保持默认处理)
* break-word: 在长单词或URL地址内部进行换行

## `word-break: normal|break-all|keep-all;`
* word-break 属性用来标明怎么样进行单词内的断句。
* normal：使用浏览器默认的换行规则。
* break-all:允许再单词内换行
* keep-all:只能在半角空格或连字符处换行

## 实例
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>菜鸟教程(runoob.com)</title>
<style>
    .word{background:#E4FFE9;width:250px;margin:50px auto;padding:20px;font-family:"microsoft yahei";}

    /* 强制不换行 */
    .nowrap{white-space:nowrap;}

    /* 允许单词内断句，首先会尝试挪到下一行，看看下一行的宽度够不够，
    不够的话就进行单词内的断句 */
    .breakword{word-wrap: break-word;}

    /* 断句时，不会把长单词挪到下一行，而是直接进行单词内的断句 */
    .breakAll{word-break:break-all;}  

    /* 超出部分显示省略号 */
    .ellipsis{text-overflow:ellipsis;overflow:hidden;}
</style>
</head>
<body>
<div class = "word">
    <p class = "normal">wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivfsa</p>
    <p class = "nowrap">wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivfs</p>          
    <p class = "breakword">wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihui</p>
    <p class = "breakAll">wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivf</p>
    <p class = "ellipsis">wordwrap:breakword;absavhsafhuafdfbjhfvsalguvfaihuivfsab</p>
</div>
</body>
</html>
```

<iframe width="100%" height="450px" srcdoc="
<style type='text/css'>
    .word{background:#E4FFE9;width:250px;margin:50px auto;padding:20px;font-family:'microsoft yahei';}
    .nowrap{white-space:nowrap;}
    .breakword{word-wrap: break-word;}
    .breakAll{word-break:break-all;}  
    .ellipsis{text-overflow:ellipsis;overflow:hidden;}
</style>
<body>
<div class = 'word'>
    <p class = 'normal'>wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivfsa</p>
    <p class = 'nowrap'>wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivfs</p>          
    <p class = 'breakword'>wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihui</p>
    <p class = 'breakAll'>wordwrap:break-word;absavhsafhuafdfbjhfvsalguvfaihuivf</p>
    <p class = 'ellipsis'>wordwrap:breakword;absavhsafhuafdfbjhfvsalguvfaihuivfsab</p>
</div>
</body>
">
</iframe>