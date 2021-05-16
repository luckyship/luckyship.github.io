---
title: "使用hexo在github上搭建博客"
date: 2020-10-07
excerpt: "hexo搭建博客流程，开发过程介绍."
tags: [hexo, web]
---

## 环境准备
* npm >= 6.14.8
* hexo >= 4.2.0
* hexo主题[yilia](https://github.com/luckyship/myblog.git)

## 部署应用
创建目录`hexo`，进入目录，执行命令
```
$ hexo init
$ ls
_config.yml  node_modules/  package-lock.json  scaffolds/  themes/
db.json      package.json   public/            source/
```
修改`_config.yml`，将其中的`theme`字段修改为`lucky`
```
$ cat _config.yml
theme: lucky
```
进入`themes`目录，克隆hexo主题仓库（注意名字为theme字段的修改值）
```
git clone https://github.com/luckyship/myblog.git ./lucky
```
退回hexo主目录，执行
```
hexo generate
hexo sever
```
即可看到web服务已经启动，端口默认为4000，访问`localhost:4000`即可

## 开发应用
### 修改主题代码
例如`css,js,html`等，需要重新打包主题代码
```
$ npm run dev
```
再清除hexo缓存，重新打包到hexo上
```
$ hexo c // 清除所有缓存
$ hexo g // 打包格式化md文件
$ hexo s // 本地环境
```
### 添加md文件
添加的文件可以实时显现到web上
```
$ hexo s -g --debug
```
### 上传至github
安装包
```
npm install hexo-deployer-git --save
```
在`_config.yml`中添加
```
deploy:
  type: git
  repo: git@github.com:luckyship/luckyship.github.io.git
  branch: main
  message: 'collect new post'
```
执行命令，`deploy`上传的每次`generate`过后的文件，所以上传之前需要`generate`
```
$ hexo g
$ hexo deploy
```

## 修改代码高亮配置
### Highlight.js
```
# _config.yml
highlight:
  enable: true
  auto_detect: false
  line_number: true
  tab_replace: '  '
  wrap: true
  hljs: false
prismjs:
  enable: false
```
highlight.js 默认开启，用作 Hexo 的服务端高亮组件。如果你需要在浏览器端运行 highlight.js，请把它关闭。
> 「服务端高亮」指语法高亮在 hexo generate 或 hexo server 时完成。

#### auto_detect
auto_detect 是 highlight.js 的特性，能够自动检测代码块的语言。
> 提示：如果你想使用「子语言高亮」功能（例如在高亮 HTML 时同时高亮内部嵌入的 JavaScript 代码），请开启 auto_detect，并且在文章中插入代码块时不要标注语言。
> 警告！auto_detect 十分耗费资源。 如果你不需要使用「子语言高亮」功能，或者不介意在书写代码块时标记语言，请不要启用此功能。

#### line_number
highlight.js 不支持行号显示。  
Hexo 通过用 `<figure>` 和 `<table>` 包裹其代码块为其添加了行号显示支持:
```
<figure class="highlight yaml">
<table>
<tbody>
<tr>
  <td class="gutter">
    <pre><span class="line">1</span><br></pre>
  </td>
  <td class="code">
    <pre><span class="line"><span class="attr">hello:</span><span class="string">hexo</span></span><br></pre>
  </td>
</tr>
</tbody>
</table>
</figure>
```
这不是 highlight.js 的行为，因此需要为 `<figure>` 和 `<table>` 添加自定义 CSS 代码。部分主题对此提供内建支持。
你大概也注意到了，所有代码块的 class 都没有 hljs- 前缀

#### tab_replace
用代码内的 tab (\t) 替换为给定值，默认值是两个空格。

#### wrap
为了支持行号显示，Hexo 将输出包裹在了 `<figure>` 和 `<table>` 内部。如果要保持 highlight.js 原来的行为，你需要将 line_number 和 wrap 全部关闭。
```
<pre><code class="yaml">
<span class="comment"># _config.yml</span>
<span class="attr">hexo:</span> <span class="string">hexo</span>
</code></pre>
```
> 警告！因为 line_number 功能依赖 wrap，你无法在配置中关闭 wrap 而又开启 line_number。如果你将 line_number 设置为 true 的话，wrap 将被自动开启。

#### hljs
当 hljs 设置为 true 时，所有代码块的 HTML 输出均会给 class 添加 hljs- 前缀（无论 wrap 是否开启）：
```
<pre><code class="yaml hljs">
<span class="hljs-comment"># _config.yml</span>
<span class="hljs-attr">hexo:</span> <span class="hljs-string">hexo</span>
</code></pre>
```
> 提示：当 line_number 和 wrap 为 false，hljs 为 true 的时候，你可以在站点上直接应用 highlight.js 的主题_blank。

### PrismJS
```
# _config.yml
highlight:
  enable: false
prismjs:
  enable: true
  preprocess: true
  line_number: true
  tab_replace: ''
```
PrismJS 默认禁用。启用 PrimeJS 前应设置 highlight.enable 为 false。

#### preprocess
Hexo 内建的 PrismJS 支持浏览器端高亮（preprocess 设置为 false）和服务器端高亮（preprocess 设置为 true）两种方式。

使用服务器端高亮时（preprocess 设置为 true），只需要在站点引入 Prismjs 的主题（CSS 样式表）即可；而使用浏览器端高亮时（preprocess 设置为 false），需要将 JavaScript 文件也引入。

PrismJS 主要是面向浏览器的。因此，在服务器端高亮模式下只有部分插件可用：

* 行号显示：需要引入prism-line-numbers.css，无需引入prism-line-numbers.js。Hexo 将生成其所需的 HTML 代码片段。
* 语言显示：当代码块有标注语言时，Hexo 总会添加 data-language 属性。
* Hexo 也支持其它不需要特殊 HTML 代码格式的 PrismJS 插件，不过你需要引入它们的 JavaScript 文件

preprocess 设置为 false 时所有 primejs 插件均可用，只需额外注意以下几点：

* 行号显示：当 preprocess 设置为 false 时，Hexo 不会生成插件所需的 HTML 代码格式。prism-line-numbers.css 和 prism-line-numbers.js均需被引入。
* 语言显示：当代码块有标注语言时，Hexo 总会添加 data-language 属性。
* 高亮特定行: Hexo 的代码块标签插件和反引号代码块标签插件都支持高亮特定行的语法（即 mark 选项）。当 mark 项被设置时，Hexo 将生成其所需的 HTML 代码格式。

#### line_number
当 preprocess 与 line_number 均设置为 true 时，只需要引入 prism-line-numbers.css 即可启用行号显示。如果 preprocess 和 line_number 均被关闭，则需要将 prism-line-numbers.css 和 prism-line-numbers.js 都引入才能启用行号显示。

#### tab_replace
用代码内的 tab (\t) 替换为给定值，默认值是两个空格。

### 参考
[Hexo 代码高亮](https://www.w3cschool.cn/hexodocument/hexodocument-6m483cn4.html)
#### 其他参考
[Highlight.js](https://highlightjs.readthedocs.io/en/latest/)  
[PrismJS](https://prismjs.com/)  
Hexo 语法高亮部分的源码可参见：  
[Highlight.js 工具函数](https://github.com/hexojs/hexo-util/blob/master/lib/highlight.js)  
[PrismJS 工具函数](https://github.com/hexojs/hexo-util/blob/master/lib/prism.js)  
[代码块标签插件](https://github.com/hexojs/hexo/blob/master/lib/plugins/tag/code.js)  
[反引号代码块标签插件](https://github.com/hexojs/hexo/blob/master/lib/plugins/filter/before_post_render/backtick_code_block.js)

## 实现搜索功能
hexo在deploy生成文章的时候，会生成一个content.json的文件，里面保存着所有的文章信息，我们可以在网页加载完毕后，利用ajax请求获得该文件的信息，实现搜索功能

### 配置生成`content.json`文件
在`_config.yaml`中加入`jsonContent`
```
jsonContent:
  meta: false
  pages: false
  posts:
    title: true
    date: true
    path: true
    text: true
    raw: false
    content: true
    slug: false
    updated: true
    comments: false
    link: false
    permalink: false
    excerpt: true
    categories: false
    tags: true
```
参数意义可以[参考](https://github.com/alexbruno/hexo-generator-json-content)
```
meta: {
  title: hexo.config.title,
  subtitle: hexo.config.subtitle,
  description: hexo.config.description,
  author: hexo.config.author,
  url: hexo.config.url
},
pages: [{ //-> all pages
  title: page.title,
  slug: page.slug,
  date: page.date,
  updated: page.updated,
  comments: page.comments,
  permalink: page.permalink,
  path: page.path,
  excerpt: page.excerpt, //-> only text ;)
  keywords: null, //-> it needs settings
  text: page.content, //-> only text minified ;)
  raw: page.raw, //-> original MD content
  content: page.content, //-> final HTML content
  author: page.author,
  categories: [{
    name: category.name,
    slug: category.slug,
    permalink: category.permalink
  }],
  tags: [{
    name: tag.name,
    slug: tag.slug,
    permalink: tag.permalink
  }]
}],
posts: [{ //-> only published posts
  title: post.title,
  slug: post.slug,
  date: post.date,
  updated: post.updated,
  comments: post.comments,
  permalink: post.permalink,
  path: post.path,
  excerpt: post.excerpt, //-> only text minified ;)
  description: post.description, //-> only text minified ;)
  keywords: null, //-> it needs settings
  text: post.content, //-> only text minified ;)
  raw: post.raw, //-> original MD content
  content: post.content, //-> final HTML content
  author: post.author,
  categories: [{
    name: category.name,
    slug: category.slug,
    permalink: category.permalink
  }],
  tags: [{
    name: tag.name,
    slug: tag.slug,
    permalink: tag.permalink
  }]
}],
categories: [{ //-> Posts categories index ;)
  name: category.name,
  slug: category.slug,
  permalink: category.permalink
}],
tags: [{ //-> Posts tags index ;)
  name: tag.name,
  slug: tag.slug,
  permalink: tag.permalink
}]
```

