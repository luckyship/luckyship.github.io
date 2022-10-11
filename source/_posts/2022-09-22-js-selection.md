---
layout: post
title: 使用js选中元素，移动光标
tags: [javascript]
comments: true
date: 2022-09-22 09:58:25
---

```javascript
// 删除之前所有的选区
window.getSelection().removeAllRanges();

let selection = window.getSelection();
let range = document.createRange();

range.selectNode(ele); // 需要选中的element
selection.addRange(range);
```

如果需要移动光标，可以使用:

```javascript
selection.collapseToEnd();
selection.collapseToStart();
```

如果需要选中所有子元素，可以使用:

```javascript
selection.selectAllChildren(ele);
```
