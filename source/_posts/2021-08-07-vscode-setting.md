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
    "markdownFormatter.fullWidthTurnHalfWidth": "auto"
  }
}
```

`prettier` 配置

```json
{
  // 使能每一种语言默认格式化规则
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  /*  prettier的配置 */
  "prettier.printWidth": 100, // 超过最大值换行
  "prettier.tabWidth": 4, // 缩进字节数
  "prettier.useTabs": false, // 缩进不使用tab，使用空格
  "prettier.semi": true, // 句尾添加分号
  "prettier.singleQuote": true, // 使用单引号代替双引号
  "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  "prettier.arrowParens": "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  "prettier.disableLanguages": ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
  "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
  "prettier.eslintIntegration": false, //不让prettier使用eslint的代码格式进行校验
  "prettier.htmlWhitespaceSensitivity": "ignore",
  "prettier.ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  "prettier.jsxBracketSameLine": false, // 在jsx中把'>' 是否单独放一行
  "prettier.jsxSingleQuote": false, // 在jsx中使用单引号代替双引号
  "prettier.parser": "babylon", // 格式化的解析器，默认是babylon
  "prettier.requireConfig": false, // Require a 'prettierconfig' to format prettier
  "prettier.stylelintIntegration": false, //不让prettier使用stylelint的代码格式进行校验
  "prettier.trailingComma": "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  "prettier.tslintIntegration": false // 不让prettier使用tslint的代码格式进行校验
}
```

<!-- more -->
