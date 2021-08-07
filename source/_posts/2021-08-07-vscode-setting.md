---
layout: post
title: vscode配置项
tags: [base]
comments: true
date: 2021-08-07 17:15:37
---

```json
{
  // markdownFormatter
  "markdownFormatter.formatOpt": {
    "indent_size": 2
  },
  "[markdown]": {
    // 自动补全
    "editor.quickSuggestions": {
      "other": true,
      "comments": true,
      "strings": true
    },
    // 将未指明语言类型的代码区转化为js代码块,
    // "markdownFormatter.codeAreaToBlock": "js",
    // snippet 提示优先
    "editor.snippetSuggestions": "top",
    "editor.tabCompletion": "on",
    // 使用enter 接受提示
    "editor.acceptSuggestionOnEnter": "on",
    // 默认格式化工具为本工具
    "editor.defaultFormatter": "mervin.markdown-formatter",
    // 自动格式化标点
    "markdownFormatter.fullWidthTurnHalfWidth": "auto",
  }
}
```

<!-- more -->
