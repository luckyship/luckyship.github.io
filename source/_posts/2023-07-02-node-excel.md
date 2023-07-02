---
layout: post
title: nodejs操作excel文件
tags: [javascript]
comments: true
date: 2023-07-02 10:08:48
---

# ExcelJS

读取，操作并写入电子表格数据和样式到 XLSX 和 JSON 文件。

一个 Excel 电子表格文件逆向工程项目。

<!-- more -->

# 安装

```shell
npm install exceljs
```

# 导入[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
const ExcelJS = require('exceljs');
```

## ES5 导入[⬆](#目录)<!-- Link generated with jump2header -->

要使用 ES5 编译代码，请使用 _dist/es5_ 路径。

```javascript
const ExcelJS = require('exceljs/dist/es5');
```

**注意：**ES5 版本对许多 polyfill 都具有隐式依赖，而 exceljs 不再明确添加。
您需要在依赖项中添加 `core-js` 和 `regenerator-runtime`，并在导入 `exceljs` 之前在代码中包含以下引用：

```javascript
// exceljs 所需的 polyfills
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');

const ExcelJS = require('exceljs/dist/es5');
```

对于 IE 11，您还需要一个 polyfill 以支持 unicode regex 模式。 例如，

```js
const rewritePattern = require('regexpu-core');
const {
  generateRegexpuOptions,
} = require('@babel/helper-create-regexp-features-plugin/lib/util');

const { RegExp } = global;
try {
  new RegExp('a', 'u');
} catch (err) {
  global.RegExp = function (pattern, flags) {
    if (flags && flags.includes('u')) {
      return new RegExp(
        rewritePattern(
          pattern,
          flags,
          generateRegexpuOptions({ flags, pattern })
        )
      );
    }
    return new RegExp(pattern, flags);
  };
  global.RegExp.prototype = RegExp.prototype;
}
```

## 浏览器端[⬆](#目录)<!-- Link generated with jump2header -->

ExcelJS 在 _dist/_ 文件夹内发布了两个支持浏览器的包：

一个是隐式依赖 `core-js` polyfills 的...

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.js"></script>
<script src="exceljs.js"></script>
```

另一个则没有...

```html
<script src="--your-project's-pollyfills-here--"></script>
<script src="exceljs.bare.js"></script>
```

# 接口[⬆](#目录)<!-- Link generated with jump2header -->

## 创建工作簿[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
const workbook = new ExcelJS.Workbook();
```

## 设置工作簿属性[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
```

```javascript
// 将工作簿日期设置为 1904 年日期系统
workbook.properties.date1904 = true;
```

## 设置计算属性[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 在加载时强制工作簿计算属性
workbook.calcProperties.fullCalcOnLoad = true;
```

## 工作簿视图[⬆](#目录)<!-- Link generated with jump2header -->

工作簿视图控制在查看工作簿时 Excel 将打开多少个单独的窗口。

```javascript
workbook.views = [
  {
    x: 0,
    y: 0,
    width: 10000,
    height: 20000,
    firstSheet: 0,
    activeTab: 1,
    visibility: 'visible',
  },
];
```

## 添加工作表[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
const sheet = workbook.addWorksheet('My Sheet');
```

使用 `addWorksheet` 函数的第二个参数来指定工作表的选项。

示例：

```javascript
// 创建带有红色标签颜色的工作表
const sheet = workbook.addWorksheet('My Sheet', {
  properties: { tabColor: { argb: 'FFC0000' } },
});

// 创建一个隐藏了网格线的工作表
const sheet = workbook.addWorksheet('My Sheet', {
  views: [{ showGridLines: false }],
});

// 创建一个第一行和列冻结的工作表
const sheet = workbook.addWorksheet('My Sheet', {
  views: [{ xSplit: 1, ySplit: 1 }],
});

// 使用A4设置的页面设置设置创建新工作表 - 横向
const worksheet = workbook.addWorksheet('My Sheet', {
  pageSetup: { paperSize: 9, orientation: 'landscape' },
});

// 创建一个具有页眉页脚的工作表
const sheet = workbook.addWorksheet('My Sheet', {
  headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
});

// 创建一个冻结了第一行和第一列的工作表
const sheet = workbook.addWorksheet('My Sheet', {
  views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }],
});
```

## 删除工作表[⬆](#目录)<!-- Link generated with jump2header -->

使用工作表的 `id` 从工作簿中删除工作表。

示例：

```javascript
// 创建工作表
const sheet = workbook.addWorksheet('My Sheet');

// 使用工作表 id 删除工作表
workbook.removeWorksheet(sheet.id);
```

## 访问工作表[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 遍历所有工作表
// 注意： workbook.worksheets.forEach 仍然是可以正常运行的， 但是以下的方式更好
workbook.eachSheet(function (worksheet, sheetId) {
  // ...
});

// 按 name 提取工作表
const worksheet = workbook.getWorksheet('My Sheet');

// 按 id 提取工作表
const worksheet = workbook.getWorksheet(1);
```

## 工作表状态[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 使工作表可见
worksheet.state = 'visible';

// 隐藏工作表
worksheet.state = 'hidden';

// 从“隐藏/取消隐藏”对话框中隐藏工作表
worksheet.state = 'veryHidden';
```

## 工作表属性[⬆](#目录)<!-- Link generated with jump2header -->

工作表支持属性存储，以允许控制工作表的某些功能。

```javascript
// 创建具有属性的新工作表
const worksheet = workbook.addWorksheet('sheet', {
  properties: { tabColor: { argb: 'FF00FF00' } },
});

// 创建一个具有属性的可写的新工作表
const worksheetWriter = workbookWriter.addWorksheet('sheet', {
  properties: { outlineLevelCol: 1 },
});

// 之后调整属性（工作表读写器不支持该操作）
worksheet.properties.outlineLevelCol = 2;
worksheet.properties.defaultRowHeight = 15;
```

**支持的属性**

| 属性名           | 默认值      | 描述             |
| ---------------- | ----------- | ---------------- |
| tabColor         | `undefined` | 标签的颜色       |
| outlineLevelCol  | 0           | 工作表列大纲级别 |
| outlineLevelRow  | 0           | 工作表行大纲级别 |
| defaultRowHeight | 15          | 默认行高         |
| defaultColWidth  | (optional)  | 默认列宽         |
| dyDescent        | 55          | TBD              |

### 工作表尺寸[⬆](#目录)<!-- Link generated with jump2header -->

一些新的尺寸属性已添加到工作表中...

| 属性名            | 描述                                                              |
| ----------------- | ----------------------------------------------------------------- |
| rowCount          | 文档的总行数。 等于具有值的最后一行的行号。                       |
| actualRowCount    | 具有值的行数的计数。 如果中间文档行为空，则该行将不包括在计数中。 |
| columnCount       | 文档的总列数。 等于所有行的最大单元数。                           |
| actualColumnCount | 具有值的列数的计数。                                              |

## 页面设置[⬆](#目录)<!-- Link generated with jump2header -->

所有可能影响工作表打印的属性都保存在工作表上的 `pageSetup` 对象中。

```javascript
// 使用 A4 横向的页面设置创建新工作表
const worksheet = workbook.addWorksheet('sheet', {
  pageSetup: { paperSize: 9, orientation: 'landscape' },
});

// 使用适合页面的pageSetup设置创建一个新的工作表编写器
const worksheetWriter = workbookWriter.addWorksheet('sheet', {
  pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
});

// 之后调整页面设置配置
worksheet.pageSetup.margins = {
  left: 0.7,
  right: 0.7,
  top: 0.75,
  bottom: 0.75,
  header: 0.3,
  footer: 0.3,
};

// 设置工作表的打印区域
worksheet.pageSetup.printArea = 'A1:G20';

// 通过使用 `&&` 分隔打印区域来设置多个打印区域
worksheet.pageSetup.printArea = 'A1:G10&&A11:G20';

// 在每个打印页面上重复特定的行
worksheet.pageSetup.printTitlesRow = '1:3';

// 在每个打印页面上重复特定列
worksheet.pageSetup.printTitlesColumn = 'A:C';
```

**支持的页面设置配置项**

| 属性名             | 默认值           | 描述                                                                                                                                                      |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| margins            |                  | 页面上的空白边距。 单位为英寸。                                                                                                                           |
| orientation        | `'portrait'`     | 页面方向 - 即较高 (`'portrait'`) 或者较宽 (`'landscape'`)                                                                                                 |
| horizontalDpi      | 4294967295       | 水平方向上的 DPI。默认值为 `-1`                                                                                                                           |
| verticalDpi        | 4294967295       | 垂直方向上的 DPI。默认值为 `-1`                                                                                                                           |
| fitToPage          |                  | 是否使用 `fitToWidth` 和 `fitToHeight` 或 `scale` 设置。默认基于存在于 `pageSetup` 对象中的设置-如果两者都存在，则 `scale` 优先级高（默认值为 `false`）。 |
| pageOrder          | `'downThenOver'` | 打印页面的顺序-`['downThenOver', 'overThenDown']` 之一                                                                                                    |
| blackAndWhite      | `false`          | 无色打印                                                                                                                                                  |
| draft              | `false`          | 打印质量较低（墨水）                                                                                                                                      |
| cellComments       | `'None'`         | 在何处放置批注-`['atEnd'，'asDisplayed'，'None']`中的一个                                                                                                 |
| errors             | `'displayed'`    | 哪里显示错误 -`['dash', 'blank', 'NA', 'displayed']` 之一                                                                                                 |
| scale              | 100              | 增加或减小打印尺寸的百分比值。 当 `fitToPage` 为 `false` 时激活                                                                                           |
| fitToWidth         | 1                | 纸张应打印多少页宽。 当 `fitToPage` 为 `true` 时激活                                                                                                      |
| fitToHeight        | 1                | 纸张应打印多少页高。 当 `fitToPage` 为 `true` 时激活                                                                                                      |
| paperSize          |                  | 使用哪种纸张尺寸（见下文）                                                                                                                                |
| showRowColHeaders  | false            | 是否显示行号和列字母                                                                                                                                      |
| showGridLines      | false            | 是否显示网格线                                                                                                                                            |
| firstPageNumber    |                  | 第一页使用哪个页码                                                                                                                                        |
| horizontalCentered | false            | 是否将工作表数据水平居中                                                                                                                                  |
| verticalCentered   | false            | 是否将工作表数据垂直居中                                                                                                                                  |

**示例纸张尺寸**

| 属性名                        | 值          |
| ----------------------------- | ----------- |
| Letter                        | `undefined` |
| Legal                         | 5           |
| Executive                     | 7           |
| A3                            | 8           |
| A4                            | 9           |
| A5                            | 11          |
| B5 (JIS)                      | 13          |
| Envelope #10                  | 20          |
| Envelope DL                   | 27          |
| Envelope C5                   | 28          |
| Envelope B5                   | 34          |
| Envelope Monarch              | 37          |
| Double Japan Postcard Rotated | 82          |
| 16K 197x273 mm                | 119         |

## 页眉和页脚[⬆](#目录)<!-- Link generated with jump2header -->

这是添加页眉和页脚的方法。
添加的内容主要是文本，例如时间，简介，文件信息等，您可以设置文本的样式。
此外，您可以为首页和偶数页设置不同的文本。

注意：目前不支持图片。

```javascript
// 创建一个带有页眉和页脚的工作表
var sheet = workbook.addWorksheet('My Sheet', {
  headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
});

// 创建一个带有页眉和页脚可写的工作表
var worksheetWriter = workbookWriter.addWorksheet('sheet', {
  headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
});
// 代码中出现的&开头字符对应变量，相关信息可查阅下文的变量表
// 设置页脚(默认居中),结果：“第 2 页，共 16 页”
worksheet.headerFooter.oddFooter = '第 &P 页，共 &N 页';

// 将页脚（默认居中）设置为粗体，结果是：“第2页，共16页”
worksheet.headerFooter.oddFooter = 'Page &P of &N';

// 将左页脚设置为 18px 并以斜体显示。 结果：“第2页，共16页”
worksheet.headerFooter.oddFooter = '&LPage &P of &N';

// 将中间标题设置为灰色Aril，结果为：“ 52 exceljs”
worksheet.headerFooter.oddHeader = '&C&KCCCCCC&"Aril"52 exceljs';

// 设置页脚的左，中和右文本。 结果：页脚左侧为“ Exceljs”。 页脚中心的“ demo.xlsx”。 页脚右侧的“第2页”
worksheet.headerFooter.oddFooter = '&Lexceljs&C&F&RPage &P';

// 在首页添加不同的页眉和页脚
worksheet.headerFooter.differentFirst = true;
worksheet.headerFooter.firstHeader = 'Hello Exceljs';
worksheet.headerFooter.firstFooter = 'Hello World';
```

**支持的 headerFooter 设置**

| 属性名           | 默认值  | 描述                                                                       |
| ---------------- | ------- | -------------------------------------------------------------------------- |
| differentFirst   | `false` | 将 `differentFirst` 的值设置为 `true`，这表示第一页的页眉/页脚与其他页不同 |
| differentOddEven | `false` | 将 `differentOddEven` 的值设置为 `true`，表示奇数页和偶数页的页眉/页脚不同 |
| oddHeader        | `null`  | 设置奇数（默认）页面的标题字符串，可以设置格式化字符串                     |
| oddFooter        | `null`  | 设置奇数（默认）页面的页脚字符串，可以设置格式化字符串                     |
| evenHeader       | `null`  | 设置偶数页的标题字符串，可以设置格式化字符串                               |
| evenFooter       | `null`  | 为偶数页设置页脚字符串，可以设置格式化字符串                               |
| firstHeader      | `null`  | 设置首页的标题字符串，可以设置格式化字符串                                 |
| firstFooter      | `null`  | 设置首页的页脚字符串，可以设置格式化字符串                                 |

**脚本命令**

| 命令         | 描述                    |
| ------------ | ----------------------- |
| &L           | 将位置设定在左侧        |
| &C           | 将位置设置在中心        |
| &R           | 将位置设定在右边        |
| &P           | 当前页码                |
| &N           | 总页数                  |
| &D           | 当前日期                |
| &T           | 当前时间                |
| &G           | 照片                    |
| &A           | 工作表名称              |
| &F           | 文件名称                |
| &B           | 加粗文本                |
| &I           | 斜体文本                |
| &U           | 文本下划线              |
| &"font name" | 字体名称，例如＆“ Aril” |
| &font size   | 字体大小，例如 12       |
| &KHEXCode    | 字体颜色，例如 &KCCCCCC |

## 工作表视图[⬆](#目录)<!-- Link generated with jump2header -->

现在，工作表支持视图列表，这些视图控制 Excel 如何显示工作表：

- `frozen` - 顶部和左侧的许多行和列被冻结在适当的位置。 仅右下部分会滚动
- `split` - 该视图分为 4 个部分，每个部分可半独立滚动。

每个视图还支持各种属性：

| 属性名            | 默认值      | 描述                                                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- |
| state             | `'normal'`  | 控制视图状态 - `'normal'`, `'frozen'` 或者 `'split'` 之一                                |
| rightToLeft       | `false`     | 将工作表视图的方向设置为从右到左                                                         |
| activeCell        | `undefined` | 当前选择的单元格                                                                         |
| showRuler         | `true`      | 在页面布局中显示或隐藏标尺                                                               |
| showRowColHeaders | `true`      | 显示或隐藏行标题和列标题（例如，顶部的 A1，B1 和左侧的 1,2,3）                           |
| showGridLines     | `true`      | 显示或隐藏网格线（针对未定义边框的单元格显示）                                           |
| zoomScale         | 100         | 用于视图的缩放比例                                                                       |
| zoomScaleNormal   | 100         | 正常缩放视图                                                                             |
| style             | `undefined` | 演示样式- `pageBreakPreview` 或 `pageLayout` 之一。 注意：页面布局与 `frozen` 视图不兼容 |

### 冻结视图[⬆](#目录)<!-- Link generated with jump2header -->

冻结视图支持以下额外属性：

| 属性名      | 默认值  | 描述                                                                                 |
| ----------- | ------- | ------------------------------------------------------------------------------------ |
| xSplit      | 0       | 冻结多少列。要仅冻结行，请将其设置为 `0` 或 `undefined`                              |
| ySplit      | 0       | 冻结多少行。要仅冻结列，请将其设置为 `0` 或 `undefined`                              |
| topLeftCell | special | 哪个单元格将在右下窗格中的左上角。注意：不能是冻结单元格。默认为第一个未冻结的单元格 |

```javascript
worksheet.views = [
  {
    state: 'frozen',
    xSplit: 2,
    ySplit: 3,
    topLeftCell: 'G10',
    activeCell: 'A1',
  },
];
```

### 拆分视图[⬆](#目录)<!-- Link generated with jump2header -->

拆分视图支持以下额外属性：

| 属性名      | 默认值      | 描述                                                                                 |
| ----------- | ----------- | ------------------------------------------------------------------------------------ |
| xSplit      | 0           | 从左侧多少个点起，以放置拆分器。要垂直拆分，请将其设置为 `0` 或 `undefined`          |
| ySplit      | 0           | 从顶部多少个点起，放置拆分器。要水平拆分，请将其设置为 `0` 或 `undefined`            |
| topLeftCell | `undefined` | 哪个单元格将在右下窗格中的左上角。                                                   |
| activePane  | `undefined` | 哪个窗格将处于活动状态-`topLeft`，`topRight`，`bottomLeft` 和 `bottomRight` 中的一个 |

```javascript
worksheet.views = [
  {
    state: 'split',
    xSplit: 2000,
    ySplit: 3000,
    topLeftCell: 'G10',
    activeCell: 'A1',
  },
];
```

## 自动筛选器[⬆](#目录)<!-- Link generated with jump2header -->

可以对工作表应用自动筛选器。

```javascript
worksheet.autoFilter = 'A1:C1';
```

尽管范围字符串是 `autoFilter` 的标准形式，但工作表还将支持以下值：

```javascript
// 将自动筛选器设置为从 A1 到 C1
worksheet.autoFilter = {
  from: 'A1',
  to: 'C1',
};

// 将自动筛选器设置为从第3行第1列的单元格到第5行第12列的单元格
worksheet.autoFilter = {
  from: {
    row: 3,
    column: 1,
  },
  to: {
    row: 5,
    column: 12,
  },
};

// 将自动筛选器设置为从D3到第7行第5列中的单元格
worksheet.autoFilter = {
  from: 'D3',
  to: {
    row: 7,
    column: 5,
  },
};
```

## 列[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 添加列标题并定义列键和宽度
// 注意：这些列结构仅是构建工作簿的方便之处，除了列宽之外，它们不会完全保留。
worksheet.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32 },
  { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 },
];

// 通过键，字母和基于1的列号访问单个列
const idCol = worksheet.getColumn('id');
const nameCol = worksheet.getColumn('B');
const dobCol = worksheet.getColumn(3);

// 设置列属性

// 注意：将覆盖 C1 单元格值
dobCol.header = 'Date of Birth';

// 注意：这将覆盖 C1:C2 单元格值
dobCol.header = ['Date of Birth', 'A.K.A. D.O.B.'];

// 从现在开始，此列将以 “dob” 而不是 “DOB” 建立索引
dobCol.key = 'dob';

dobCol.width = 15;

// 如果需要，隐藏列
dobCol.hidden = true;

// 为列设置大纲级别
worksheet.getColumn(4).outlineLevel = 0;
worksheet.getColumn(5).outlineLevel = 1;

// 列支持一个只读字段，以指示基于 `OutlineLevel` 的折叠状态
expect(worksheet.getColumn(4).collapsed).to.equal(false);
expect(worksheet.getColumn(5).collapsed).to.equal(true);

// 遍历此列中的所有当前单元格
dobCol.eachCell(function (cell, rowNumber) {
  // ...
});

// 遍历此列中的所有当前单元格，包括空单元格
dobCol.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  // ...
});

// 添加一列新值
worksheet.getColumn(6).values = [1, 2, 3, 4, 5];

// 添加稀疏列值
worksheet.getColumn(7).values = [, , 2, 3, , 5, , 7, , , , 11];

// 剪切一列或多列（右边的列向左移动）
// 如果定义了列属性，则会相应地对其进行切割或移动
// 已知问题：如果拼接导致任何合并的单元格移动，结果可能是不可预测的
worksheet.spliceColumns(3, 2);

// 删除一列，再插入两列。
// 注意：第4列及以上的列将右移1列。
// 另外：如果工作表中的行数多于列插入项中的值，则行将仍然被插入，就好像值存在一样。
const newCol3Values = [1, 2, 3, 4, 5];
const newCol4Values = ['one', 'two', 'three', 'four', 'five'];
worksheet.spliceColumns(3, 1, newCol3Values, newCol4Values);
```

## 行[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 获取一个行对象。如果尚不存在，则将返回一个新的空对象
const row = worksheet.getRow(5);

// Get multiple row objects. If it doesn't already exist, new empty ones will be returned
const rows = worksheet.getRows(5, 2); // start, length (>0, else undefined is returned)

// 获取工作表中的最后一个可编辑行（如果没有，则为 `undefined`）
const row = worksheet.lastRow;

// 设置特定的行高
row.height = 42.5;

// 隐藏行
row.hidden = true;

// 为行设置大纲级别
worksheet.getRow(4).outlineLevel = 0;
worksheet.getRow(5).outlineLevel = 1;

// 行支持一个只读字段，以指示基于 `OutlineLevel` 的折叠状态
expect(worksheet.getRow(4).collapsed).to.equal(false);
expect(worksheet.getRow(5).collapsed).to.equal(true);

row.getCell(1).value = 5; // A5 的值设置为5
row.getCell('name').value = 'Zeb'; // B5 的值设置为 “Zeb” - 假设第2列仍按名称键入
row.getCell('C').value = new Date(); // C5 的值设置为当前时间

// 获取行并作为稀疏数组返回
// 注意：接口更改：worksheet.getRow(4) ==> worksheet.getRow(4).values
row = worksheet.getRow(4).values;
expect(row[5]).toEqual('Kyle');

// 通过连续数组分配行值（其中数组元素 0 具有值）
row.values = [1, 2, 3];
expect(row.getCell(1).value).toEqual(1);
expect(row.getCell(2).value).toEqual(2);
expect(row.getCell(3).value).toEqual(3);

// 通过稀疏数组分配行值（其中数组元素 0 为 `undefined`）
const values = [];
values[5] = 7;
values[10] = 'Hello, World!';
row.values = values;
expect(row.getCell(1).value).toBeNull();
expect(row.getCell(5).value).toEqual(7);
expect(row.getCell(10).value).toEqual('Hello, World!');

// 使用列键按对象分配行值
row.values = {
  id: 13,
  name: 'Thing 1',
  dob: new Date(),
};

// 在该行下方插入一个分页符
row.addPageBreak();

// 遍历工作表中具有值的所有行
worksheet.eachRow(function (row, rowNumber) {
  console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
});

// 遍历工作表中的所有行（包括空行）
worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
  console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
});

// 连续遍历所有非空单元格
row.eachCell(function (cell, colNumber) {
  console.log('Cell ' + colNumber + ' = ' + cell.value);
});

// 遍历一行中的所有单元格（包括空单元格）
row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
  console.log('Cell ' + colNumber + ' = ' + cell.value);
});

// 提交给流一个完成的行
row.commit();

// 行尺寸
const rowSize = row.cellCount;
const numValues = row.actualCellCount;
```

## Add Rows[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Add a couple of Rows by key-value, after the last current row, using the column keys
worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

// Add a row by contiguous Array (assign to columns A, B & C)
worksheet.addRow([3, 'Sam', new Date()]);

// Add a row by sparse Array (assign to columns A, E & I)
const rowValues = [];
rowValues[1] = 4;
rowValues[5] = 'Kyle';
rowValues[9] = new Date();
worksheet.addRow(rowValues);

// Add a row with inherited style
// This new row will have same style as last row
// And return as row object
const newRow = worksheet.addRow(rowValues, 'i');

// Add an array of rows
const rows = [
  [5, 'Bob', new Date()], // row by array
  { id: 6, name: 'Barbara', dob: new Date() },
];
// add new rows and return them as array of row objects
const newRows = worksheet.addRows(rows);

// Add an array of rows with inherited style
// These new rows will have same styles as last row
// and return them as array of row objects
const newRowsStyled = worksheet.addRows(rows, 'i');
```

| Parameter | Description                                                               | Default Value |
| --------- | ------------------------------------------------------------------------- | ------------- |
| value/s   | The new row/s values                                                      |               |
| style     | 'i' for inherit from row above, 'i+' to include empty cells, 'n' for none | _'n'_         |

## 处理单个单元格[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
const cell = worksheet.getCell('C3');

// 修改/添加单个单元格
cell.value = new Date(1968, 5, 1);

// 查询单元格的类型
expect(cell.type).toEqual(Excel.ValueType.Date);

// 使用单元格的字符串值
myInput.value = cell.text;

// 使用 html 安全的字符串进行渲染...
const html = '<div>' + cell.html + '</div>';
```

## 合并单元格[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 合并一系列单元格
worksheet.mergeCells('A4:B5');

// ...合并的单元格被链接起来了
worksheet.getCell('B5').value = 'Hello, World!';
expect(worksheet.getCell('B5').value).toBe(worksheet.getCell('A4').value);
expect(worksheet.getCell('B5').master).toBe(worksheet.getCell('A4'));

// ...合并的单元格共享相同的样式对象
expect(worksheet.getCell('B5').style).toBe(worksheet.getCell('A4').style);
worksheet.getCell('B5').style.font = myFonts.arial;
expect(worksheet.getCell('A4').style.font).toBe(myFonts.arial);

// 取消单元格合并将打破链接的样式
worksheet.unMergeCells('A4');
expect(worksheet.getCell('B5').style).not.toBe(worksheet.getCell('A4').style);
expect(worksheet.getCell('B5').style.font).not.toBe(myFonts.arial);

// 按左上，右下合并
worksheet.mergeCells('K10', 'M12');

// 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
worksheet.mergeCells(10, 11, 12, 13);
```

## Insert Rows[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
insertRow(pos, value, (style = 'n'));
insertRows(pos, values, (style = 'n'));

// Insert a couple of Rows by key-value, shifting down rows every time
worksheet.insertRow(1, { id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
worksheet.insertRow(1, { id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

// Insert a row by contiguous Array (assign to columns A, B & C)
worksheet.insertRow(1, [3, 'Sam', new Date()]);

// Insert a row by sparse Array (assign to columns A, E & I)
var rowValues = [];
rowValues[1] = 4;
rowValues[5] = 'Kyle';
rowValues[9] = new Date();
// insert new row and return as row object
const insertedRow = worksheet.insertRow(1, rowValues);

// Insert a row, with inherited style
// This new row will have same style as row on top of it
// And return as row object
const insertedRowInherited = worksheet.insertRow(1, rowValues, 'i');

// Insert a row, keeping original style
// This new row will have same style as it was previously
// And return as row object
const insertedRowOriginal = worksheet.insertRow(1, rowValues, 'o');

// Insert an array of rows, in position 1, shifting down current position 1 and later rows by 2 rows
var rows = [
  [5, 'Bob', new Date()], // row by array
  { id: 6, name: 'Barbara', dob: new Date() },
];
// insert new rows and return them as array of row objects
const insertedRows = worksheet.insertRows(1, rows);

// Insert an array of rows, with inherited style
// These new rows will have same style as row on top of it
// And return them as array of row objects
const insertedRowsInherited = worksheet.insertRows(1, rows, 'i');

// Insert an array of rows, keeping original style
// These new rows will have same style as it was previously in 'pos' position
const insertedRowsOriginal = worksheet.insertRows(1, rows, 'o');
```

| Parameter | Description                                                                                                                      | Default Value |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| pos       | Row number where you want to insert, pushing down all rows from there                                                            |               |
| value/s   | The new row/s values                                                                                                             |               |
| style     | 'i' for inherit from row above, , 'i+' to include empty cells, 'o' for original style, 'o+' to include empty cells, 'n' for none | _'n'_         |

## Splice[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Cut one or more rows (rows below are shifted up)
// Known Issue: If a splice causes any merged cells to move, the results may be unpredictable
worksheet.spliceRows(4, 3);

// remove one row and insert two more.
// Note: rows 4 and below will be shifted down by 1 row.
const newRow3Values = [1, 2, 3, 4, 5];
const newRow4Values = ['one', 'two', 'three', 'four', 'five'];
worksheet.spliceRows(3, 1, newRow3Values, newRow4Values);

// Cut one or more cells (cells to the right are shifted left)
// Note: this operation will not affect other rows
row.splice(3, 2);

// remove one cell and insert two more (cells to the right of the cut cell will be shifted right)
row.splice(4, 1, 'new value 1', 'new value 2');
```

| Parameter  | Description                    | Default Value |
| ---------- | ------------------------------ | ------------- |
| start      | Starting point to splice from  |               |
| count      | Number of rows/cells to remove |               |
| ...inserts | New row/cell values to insert  |               |

## 重复行[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
duplicateRow(start, (amount = 1), (insert = true));

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('duplicateTest');
ws.getCell('A1').value = 'One';
ws.getCell('A2').value = 'Two';
ws.getCell('A3').value = 'Three';
ws.getCell('A4').value = 'Four';

// 该行将重复复制第一行两次，但将替换第二行和第三行
// 如果第三个参数为 true，则它将插入2个新行，其中包含行 “One” 的值和样式
ws.duplicateRow(1, 2, false);
```

| 参数   | 描述                                                             | 默认值 |
| ------ | ---------------------------------------------------------------- | ------ |
| start  | 要复制的行号（Excel 中的第一个是 1）                             |        |
| amount | 您要复制行的次数                                                 | 1      |
| insert | 如果要为重复项插入新行，则为 `true`，否则为 `false` 将替换已有行 | `true` |

## 定义名称[⬆](#目录)<!-- Link generated with jump2header -->

单个单元格（或多个单元格组）可以为它们分配名称。名称可用于公式和数据验证（可能还有更多）。

```javascript
// 为单元格分配（或获取）名称（将覆盖该单元具有的其他任何名称）
worksheet.getCell('A1').name = 'PI';
expect(worksheet.getCell('A1').name).to.equal('PI');

// 为单元格分配（或获取）一组名称（单元可以具有多个名称）
worksheet.getCell('A1').names = ['thing1', 'thing2'];
expect(worksheet.getCell('A1').names).to.have.members(['thing1', 'thing2']);

// 从单元格中删除名称
worksheet.getCell('A1').removeName('thing1');
expect(worksheet.getCell('A1').names).to.have.members(['thing2']);
```

## 数据验证[⬆](#目录)<!-- Link generated with jump2header -->

单元格可以定义哪些值有效或无效，并提示用户以帮助指导它们。

验证类型可以是以下之一：

| 类型       | 描述                                                               |
| ---------- | ------------------------------------------------------------------ |
| list       | 定义一组离散的有效值。Excel 将在下拉菜单中提供这些内容，以便于输入 |
| whole      | 该值必须是整数                                                     |
| decimal    | 该值必须是十进制数                                                 |
| textLength | 该值可以是文本，但长度是受控的                                     |
| custom     | 自定义公式控制有效值                                               |

对于 `list` 或 `custom` 以外的其他类型，以下运算符会影响验证：

| 运算符             | 描述                     |
| ------------------ | ------------------------ |
| between            | 值必须介于公式结果之间   |
| notBetween         | 值不能介于公式结果之间   |
| equal              | 值必须等于公式结果       |
| notEqual           | 值不能等于公式结果       |
| greaterThan        | 值必须大于公式结果       |
| lessThan           | 值必须小于公式结果       |
| greaterThanOrEqual | 值必须大于或等于公式结果 |
| lessThanOrEqual    | 值必须小于或等于公式结果 |

```javascript
// 指定有效值的列表（One，Two，Three，Four）。
// Excel 将提供一个包含这些值的下拉列表。
worksheet.getCell('A1').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['"One,Two,Three,Four"'],
};

// 指定范围内的有效值列表。
// Excel 将提供一个包含这些值的下拉列表。
worksheet.getCell('A1').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['$D$5:$F$5'],
};

// 指定单元格必须为非5的整数。
// 向用户显示适当的错误消息（如果他们弄错了）
worksheet.getCell('A1').dataValidation = {
  type: 'whole',
  operator: 'notEqual',
  showErrorMessage: true,
  formulae: [5],
  errorStyle: 'error',
  errorTitle: 'Five',
  error: 'The value must not be Five',
};

// 指定单元格必须为1.5到7之间的十进制数字。
// 添加“工具提示”以帮助指导用户
worksheet.getCell('A1').dataValidation = {
  type: 'decimal',
  operator: 'between',
  allowBlank: true,
  showInputMessage: true,
  formulae: [1.5, 7],
  promptTitle: 'Decimal',
  prompt: 'The value must between 1.5 and 7',
};

// 指定单元格的文本长度必须小于15
worksheet.getCell('A1').dataValidation = {
  type: 'textLength',
  operator: 'lessThan',
  showErrorMessage: true,
  allowBlank: true,
  formulae: [15],
};

// 指定单元格必须是2016年1月1日之前的日期
worksheet.getCell('A1').dataValidation = {
  type: 'date',
  operator: 'lessThan',
  showErrorMessage: true,
  allowBlank: true,
  formulae: [new Date(2016, 0, 1)],
};
```

## 单元格注释[⬆](#目录)<!-- Link generated with jump2header -->

将旧样式的注释添加到单元格

```javascript
// 纯文字笔记
worksheet.getCell('A1').note = 'Hello, ExcelJS!';

// 彩色格式化的笔记
ws.getCell('B1').note = {
  texts: [
    {
      font: {
        size: 12,
        color: { theme: 0 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: 'This is ',
    },
    {
      font: {
        italic: true,
        size: 12,
        color: { theme: 0 },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'a',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' ',
    },
    {
      font: {
        size: 12,
        color: { argb: 'FFFF6600' },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'colorful',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' text ',
    },
    {
      font: {
        size: 12,
        color: { argb: 'FFCCFFCC' },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'with',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' in-cell ',
    },
    {
      font: {
        bold: true,
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: 'format',
    },
  ],
  margins: {
    insetmode: 'custom',
    inset: [0.25, 0.25, 0.35, 0.35],
  },
  protection: {
    locked: True,
    lockText: False,
  },
  editAs: 'twoCells',
};
```

### 单元格批注属性[⬆](#目录)<!-- Link generated with jump2header -->

下表定义了单元格注释已支持的属性。

| Field      | Required | Default Value | Description                                    |
| ---------- | -------- | ------------- | ---------------------------------------------- |
| texts      | Y        |               | 评论文字                                       |
| margins    | N        | {}            | 确定自动或自定义设置单元格注释的边距值         |
| protection | N        | {}            | 可以使用保护属性来指定对象和对象文本的锁定状态 |
| editAs     | N        | 'absolute'    | 可以使用'editAs'属性来指定注释如何锚定到单元格 |

### 单元格批注页边距[⬆](#目录)<!-- Link generated with jump2header -->

确定单元格批注的页面距设置模式，自动或者自定义模式。

```javascript
ws.getCell('B1').note.margins = {
  insetmode: 'custom',
  inset: [0.25, 0.25, 0.35, 0.35],
};
```

### 已支持的页边距属性[⬆](#目录)<!-- Link generated with jump2header -->

| Property  | Required | Default Value            | Description                                            |
| --------- | -------- | ------------------------ | ------------------------------------------------------ |
| insetmode | N        | 'auto'                   | 确定是否自动设置注释边距，并且值是'auto' 或者 'custom' |
| inset     | N        | [0.13, 0.13, 0.25, 0.25] | 批注页边距的值，单位是厘米, 方向是左-上-右-下          |

注意：只有当 `insetmode`的值设置为'custom'时，`inset`的设置才生效。

### 单元格批注保护[⬆](#目录)<!-- Link generated with jump2header -->

可以使用保护属性来修改单元级别保护。

```javascript
ws.getCell('B1').note.protection = {
  locked: 'False',
  lockText: 'False',
};
```

### 已支持的保护属性[⬆](#目录)<!-- Link generated with jump2header -->

| Property | Required | Default Value | Description                        |
| -------- | -------- | ------------- | ---------------------------------- |
| locked   | N        | 'True'        | 此元素指定在保护工作表时对象已锁定 |
| lockText | N        | 'True'        | 该元素指定对象的文本已锁定         |

### 单元格批注对象位置属性[⬆](#目录)<!-- Link generated with jump2header -->

单元格注释还可以具有属性 'editAs'，该属性将控制注释如何锚定到单元格。
它可以具有以下值之一：

```javascript
ws.getCell('B1').note.editAs = 'twoCells';
```

| Value    | Description                              |
| -------- | ---------------------------------------- |
| twoCells | 它指定注释的大小、位置随单元格而变       |
| oneCells | 它指定注释的大小固定，位置随单元格而变   |
| absolute | 这是默认值，它指定注释的大小、位置均固定 |

## 表格[⬆](#目录)<!-- Link generated with jump2header -->

表允许表格内数据的表内操作。

要将表添加到工作表，请定义表模型并调用 `addTable`：

```javascript
// 将表格添加到工作表
ws.addTable({
  name: 'MyTable',
  ref: 'A1',
  headerRow: true,
  totalsRow: true,
  style: {
    theme: 'TableStyleDark3',
    showRowStripes: true,
  },
  columns: [
    { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
    { name: 'Amount', totalsRowFunction: 'sum', filterButton: false },
  ],
  rows: [
    [new Date('2019-07-20'), 70.1],
    [new Date('2019-07-21'), 70.6],
    [new Date('2019-07-22'), 70.1],
  ],
});
```

注意：将表格添加到工作表将通过放置表格的标题和行数据来修改工作表。
结果就是表格覆盖的工作表上的所有数据（包括标题和所有的）都将被覆盖。

### 表格属性[⬆](#目录)<!-- Link generated with jump2header -->

下表定义了表格支持的属性。

| 表属性      | 描述               | 是否需要 | 默认值  |
| ----------- | ------------------ | -------- | ------- |
| name        | 表格名称           | Y        |         |
| displayName | 表格的显示名称     | N        | `name`  |
| ref         | 表格的左上方单元格 | Y        |         |
| headerRow   | 在表格顶部显示标题 | N        | true    |
| totalsRow   | 在表格底部显示总计 | N        | `false` |
| style       | 额外的样式属性     | N        | {}      |
| columns     | 列定义             | Y        |         |
| rows        | 数据行             | Y        |         |

### 表格样式属性[⬆](#目录)<!-- Link generated with jump2header -->

下表定义了表格中支持的属性样式属性。

| 样式属性          | 描述                     | 是否需要 | 默认值                |
| ----------------- | ------------------------ | -------- | --------------------- |
| theme             | 桌子的颜色主题           | N        | `'TableStyleMedium2'` |
| showFirstColumn   | 突出显示第一列（粗体）   | N        | `false`               |
| showLastColumn    | 突出显示最后一列（粗体） | N        | `false`               |
| showRowStripes    | 用交替的背景色显示行     | N        | `false`               |
| showColumnStripes | 用交替的背景色显示列     | N        | `false`               |

### 表格列属性[⬆](#目录)<!-- Link generated with jump2header -->

下表定义了每个表格列中支持的属性。

| 列属性            | 描述                           | 是否需要 | 默认值    |
| ----------------- | ------------------------------ | -------- | --------- |
| name              | 列名，也用在标题中             | Y        |           |
| filterButton      | 切换标题中的过滤器控件         | N        | false     |
| totalsRowLabel    | 用于描述统计行的标签（第一列） | N        | `'Total'` |
| totalsRowFunction | 统计函数名称                   | N        | `'none'`  |
| totalsRowFormula  | 自定义函数的可选公式           | N        |           |

### 统计函数[⬆](#目录)<!-- Link generated with jump2header -->

下表列出了由列定义的 `totalsRowFunction` 属性的有效值。如果使用 `'custom'` 以外的任何值，则无需包括关联的公式，因为该公式将被表格插入。

| 统计函数  | 描述                                            |
| --------- | ----------------------------------------------- |
| none      | 此列没有统计函数                                |
| average   | 计算列的平均值                                  |
| countNums | 统计数字条目数                                  |
| count     | 条目数                                          |
| max       | 此列中的最大值                                  |
| min       | 此列中的最小值                                  |
| stdDev    | 该列的标准偏差                                  |
| var       | 此列的方差                                      |
| sum       | 此列的条目总数                                  |
| custom    | 自定义公式。 需要关联的 `totalsRowFormula` 值。 |

### 表格样式主题[⬆](#目录)<!-- Link generated with jump2header -->

有效的主题名称遵循以下模式：

- "TableStyle[Shade][Number]"

Shades（阴影），Number（数字）可以是以下之一：

- Light, 1-21
- Medium, 1-28
- Dark, 1-11

对于无主题，请使用值 `null`。

注意：exceljs 尚不支持自定义表格主题。

### 修改表格[⬆](#目录)<!-- Link generated with jump2header -->

表格支持一组操作函数，这些操作函数允许添加或删除数据以及更改某些属性。由于这些操作中的许多操作可能会对工作表产生副作用，因此更改必须在完成后立即提交。

表中的所有索引值均基于零，因此第一行号和第一列号为 `0`。

**添加或删除标题和统计**

```javascript
const table = ws.getTable('MyTable');

// 打开标题行
table.headerRow = true;

// 关闭统计行
table.totalsRow = false;

// 将表更改提交到工作表中
table.commit();
```

**重定位表**

```javascript
const table = ws.getTable('MyTable');

// 表格左上移至 D4
table.ref = 'D4';

// 将表更改提交到工作表中
table.commit();
```

**添加和删除行**

```javascript
const table = ws.getTable('MyTable');

// 删除前两行
table.removeRows(0, 2);

// 在索引 5 处插入新行
table.addRow([new Date('2019-08-05'), 5, 'Mid'], 5);

// 在表格底部追加新行
table.addRow([new Date('2019-08-10'), 10, 'End']);

// 将表更改提交到工作表中
table.commit();
```

**添加和删除列**

```javascript
const table = ws.getTable('MyTable');

// 删除第二列
table.removeColumns(1, 1);

// 在索引 1 处插入新列（包含数据）
table.addColumn(
  {
    name: 'Letter',
    totalsRowFunction: 'custom',
    totalsRowFormula: 'ROW()',
    totalsRowResult: 6,
    filterButton: true,
  },
  ['a', 'b', 'c', 'd'],
  2
);

// 将表更改提交到工作表中
table.commit();
```

**更改列属性**

```javascript
const table = ws.getTable('MyTable');

// 获取第二列的列包装器
const column = table.getColumn(1);

// 设置一些属性
column.name = 'Code';
column.filterButton = true;
column.style = { font: { bold: true, name: 'Comic Sans MS' } };
column.totalsRowLabel = 'Totals';
column.totalsRowFunction = 'custom';
column.totalsRowFormula = 'ROW()';
column.totalsRowResult = 10;

// 将表更改提交到工作表中
table.commit();
```

## 样式[⬆](#目录)<!-- Link generated with jump2header -->

单元格，行和列均支持一组丰富的样式和格式，这些样式和格式会影响单元格的显示方式。

通过分配以下属性来设置样式：

- <a href="#数字格式">numFmt</a>
- <a href="#字体">font</a>
- <a href="#对齐">alignment</a>
- <a href="#边框">border</a>
- <a href="#填充">fill</a>

```javascript
// 为单元格分配样式
ws.getCell('A1').numFmt = '0.00%';

// 将样式应用于工作表列
ws.columns = [
  { header: 'Id', key: 'id', width: 10 },
  {
    header: 'Name',
    key: 'name',
    width: 32,
    style: { font: { name: 'Arial Black' } },
  },
  { header: 'D.O.B.', key: 'DOB', width: 10, style: { numFmt: 'dd/mm/yyyy' } },
];

// 将第3列设置为“货币格式”
ws.getColumn(3).numFmt = '"£"#,##0.00;[Red]-"£"#,##0.00';

// 将第2行设置为 Comic Sans。
ws.getRow(2).font = {
  name: 'Comic Sans MS',
  family: 4,
  size: 16,
  underline: 'double',
  bold: true,
};
```

将样式应用于行或列时，它将应用于该行或列中所有当前存在的单元格。另外，创建的任何新单元格都将从其所属的行和列继承其初始样式。

如果单元格的行和列都定义了特定的样式（例如，字体），则该单元格所在行样式比列样式具有更高优先级。但是，如果行和列定义了不同的样式（例如 `column.numFmt` 和 `row.font`），则单元格将继承行的字体和列的 `numFmt`。

注意：以上所有属性（`numFmt`（字符串）除外）都是 JS 对象结构。如果将同一样式对象分配给多个电子表格实体，则每个实体将共享同一样式对象。如果样式对象后来在电子表格序列化之前被修改，则所有引用该样式对象的实体也将被修改。此行为旨在通过减少创建的 JS 对象的数量来优先考虑性能。如果希望样式对象是独立的，则需要先对其进行克隆，然后再分配它们。同样，默认情况下，如果电子表格实体共享相似的样式，则从文件（或流）中读取文档时，它们也将引用相同的样式对象。

### 数字格式[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 将值显示为“ 1 3/5”
ws.getCell('A1').value = 1.6;
ws.getCell('A1').numFmt = '# ?/?';

// 显示为“ 1.60％”
ws.getCell('B1').value = 0.016;
ws.getCell('B1').numFmt = '0.00%';
```

### 字体

```javascript
// for the wannabe graphic designers out there
ws.getCell('A1').font = {
  name: 'Comic Sans MS',
  family: 4,
  size: 16,
  underline: true,
  bold: true,
};

// for the graduate graphic designers...
ws.getCell('A2').font = {
  name: 'Arial Black',
  color: { argb: 'FF00FF00' },
  family: 2,
  size: 14,
  italic: true,
};

// 垂直对齐
ws.getCell('A3').font = {
  vertAlign: 'superscript',
};

// 注意：该单元格将存储对分配的字体对象的引用。
// 如果之后更改了字体对象，则单元字体也将更改。
const font = { name: 'Arial', size: 12 };
ws.getCell('A3').font = font;
font.size = 20; // 单元格 A3 现在具有20号字体！

// 从文件或流中读取工作簿后，共享相似字体的单元格可能引用相同的字体对象
```

| 字体属性  | 描述                               | 示例值                                                                          |
| --------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| name      | 字体名称。                         | 'Arial', 'Calibri', etc.                                                        |
| family    | 备用字体家族。整数值。             | 1 - Serif, 2 - Sans Serif, 3 - Mono, Others - unknown                           |
| scheme    | 字体方案。                         | 'minor', 'major', 'none'                                                        |
| charset   | 字体字符集。整数值。               | 1, 2, etc.                                                                      |
| size      | 字体大小。整数值。                 | 9, 10, 12, 16, etc.                                                             |
| color     | 颜色描述，一个包含 ARGB 值的对象。 | { argb: 'FFFF0000'}                                                             |
| bold      | 字体 **粗细**                      | true, false                                                                     |
| italic    | 字体 _倾斜_                        | true, false                                                                     |
| underline | 字体 <u>下划线</u> 样式            | true, false, 'none', 'single', 'double', 'singleAccounting', 'doubleAccounting' |
| strike    | 字体 <strike>删除线</strike>       | true, false                                                                     |
| outline   | 字体轮廓                           | true, false                                                                     |
| vertAlign | 垂直对齐                           | 'superscript', 'subscript'                                                      |

### 对齐[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 将单元格对齐方式设置为左上，中间居中，右下
ws.getCell('A1').alignment = { vertical: 'top', horizontal: 'left' };
ws.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
ws.getCell('C1').alignment = { vertical: 'bottom', horizontal: 'right' };

// 将单元格设置为自动换行
ws.getCell('D1').alignment = { wrapText: true };

// 将单元格缩进设置为1
ws.getCell('E1').alignment = { indent: 1 };

// 将单元格文本旋转设置为向上30deg，向下45deg和垂直文本
ws.getCell('F1').alignment = { textRotation: 30 };
ws.getCell('G1').alignment = { textRotation: -45 };
ws.getCell('H1').alignment = { textRotation: 'vertical' };
```

**有效的对齐属性值**

| 水平的           | 垂直        | 文本换行 | 自适应 | 缩进    | 阅读顺序 | 文本旋转  |
| ---------------- | ----------- | -------- | ------ | ------- | -------- | --------- |
| left             | top         | true     | true   | integer | rtl      | 0 to 90   |
| center           | middle      | false    | false  |         | ltr      | -1 to -90 |
| right            | bottom      |          |        |         |          | vertical  |
| fill             | distributed |          |        |         |          |           |
| justify          | justify     |          |        |         |          |           |
| centerContinuous |             |          |        |         |          |           |
| distributed      |             |          |        |         |          |           |

### 边框[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 在A1周围设置单个细边框
ws.getCell('A1').border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

// 在A3周围设置双细绿色边框
ws.getCell('A3').border = {
  top: { style: 'double', color: { argb: 'FF00FF00' } },
  left: { style: 'double', color: { argb: 'FF00FF00' } },
  bottom: { style: 'double', color: { argb: 'FF00FF00' } },
  right: { style: 'double', color: { argb: 'FF00FF00' } },
};

// 在A5中设置厚红十字边框
ws.getCell('A5').border = {
  diagonal: {
    up: true,
    down: true,
    style: 'thick',
    color: { argb: 'FFFF0000' },
  },
};
```

**有效边框样式**

- thin
- dotted
- dashDot
- hair
- dashDotDot
- slantDashDot
- mediumDashed
- mediumDashDotDot
- mediumDashDot
- medium
- double
- thick

### 填充[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 用红色深色垂直条纹填充A1
ws.getCell('A1').fill = {
  type: 'pattern',
  pattern: 'darkVertical',
  fgColor: { argb: 'FFFF0000' },
};

// 在A2中填充深黄色格子和蓝色背景
ws.getCell('A2').fill = {
  type: 'pattern',
  pattern: 'darkTrellis',
  fgColor: { argb: 'FFFFFF00' },
  bgColor: { argb: 'FF0000FF' },
};

// 从左到右用蓝白蓝渐变填充A3
ws.getCell('A3').fill = {
  type: 'gradient',
  gradient: 'angle',
  degree: 0,
  stops: [
    { position: 0, color: { argb: 'FF0000FF' } },
    { position: 0.5, color: { argb: 'FFFFFFFF' } },
    { position: 1, color: { argb: 'FF0000FF' } },
  ],
};

// 从中心开始用红绿色渐变填充A4
ws.getCell('A4').fill = {
  type: 'gradient',
  gradient: 'path',
  center: { left: 0.5, top: 0.5 },
  stops: [
    { position: 0, color: { argb: 'FFFF0000' } },
    { position: 1, color: { argb: 'FF00FF00' } },
  ],
};
```

#### 填充模式[⬆](#目录)<!-- Link generated with jump2header -->

| 属性    | 是否需要 | 描述                                                              |
| ------- | -------- | ----------------------------------------------------------------- |
| type    | Y        | 值: `'pattern'`<br/>指定此填充使用模式                            |
| pattern | Y        | 指定模式类型 (查看下面 <a href="#有效模式类型">有效模式类型</a> ) |
| fgColor | N        | 指定图案前景色。默认为黑色。                                      |
| bgColor | N        | 指定图案背景色。默认为白色。                                      |

**有效模式类型**

- none
- solid
- darkGray
- mediumGray
- lightGray
- gray125
- gray0625
- darkHorizontal
- darkVertical
- darkDown
- darkUp
- darkGrid
- darkTrellis
- lightHorizontal
- lightVertical
- lightDown
- lightUp
- lightGrid
- lightTrellis

#### 渐变填充[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 是否需要 | 描述                                                                                                               |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| type     | Y        | 值: `'gradient'`<br/>指定此填充使用渐变                                                                            |
| gradient | Y        | 指定渐变类型。`['angle'，'path']` 之一                                                                             |
| degree   | angle    | 对于“角度”渐变，指定渐变的方向。`0` 是从左到右。值从 1-359 顺时针旋转方向                                          |
| center   | path     | 对于“路径”渐变。指定路径起点的相对坐标。“左”和“顶”值的范围是 0 到 1                                                |
| stops    | Y        | 指定渐变颜色序列。是包含位置和颜色（从位置 0 开始到位置 1 结束）的对象的数组。中间位置可用于指定路径上的其他颜色。 |

**注意事项**

使用上面的接口，可能会创建使用 XLSX 编辑器程序无法实现的渐变填充效果。例如，Excel 仅支持 0、45、90 和 135 的角度梯度。类似地，stops 的顺序也可能受到 UI 的限制，其中位置 [0,1] 或[0,0.5,1] 是唯一的选择。请谨慎处理此填充，以确保目标 XLSX 查看器支持该填充。

### 富文本[⬆](#目录)<!-- Link generated with jump2header -->

现在，单个单元格支持 RTF 文本或单元格格式化。富文本值可以控制文本值内任意数量的子字符串的字体属性。有关支持哪些字体属性的详细信息，请参见<a href="font">字体</a>。

```javascript
ws.getCell('A1').value = {
  richText: [
    {
      font: {
        size: 12,
        color: { theme: 0 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: 'This is ',
    },
    {
      font: {
        italic: true,
        size: 12,
        color: { theme: 0 },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'a',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' ',
    },
    {
      font: {
        size: 12,
        color: { argb: 'FFFF6600' },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'colorful',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' text ',
    },
    {
      font: {
        size: 12,
        color: { argb: 'FFCCFFCC' },
        name: 'Calibri',
        scheme: 'minor',
      },
      text: 'with',
    },
    {
      font: {
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: ' in-cell ',
    },
    {
      font: {
        bold: true,
        size: 12,
        color: { theme: 1 },
        name: 'Calibri',
        family: 2,
        scheme: 'minor',
      },
      text: 'format',
    },
  ],
};

expect(ws.getCell('A1').text).to.equal(
  'This is a colorful text with in-cell format'
);
expect(ws.getCell('A1').type).to.equal(Excel.ValueType.RichText);
```

### 单元格保护[⬆](#目录)<!-- Link generated with jump2header -->

可以使用保护属性来修改单元级别保护。

```javascript
ws.getCell('A1').protection = {
  locked: false,
  hidden: true,
};
```

**支持的保护属性**

| 属性   | 默认值  | 描述                                           |
| ------ | ------- | ---------------------------------------------- |
| locked | `true`  | 指定在工作表受保护的情况下是否将单元格锁定。   |
| hidden | `false` | 指定如果工作表受保护，则单元格的公式是否可见。 |

## 条件格式化[⬆](#目录)<!-- Link generated with jump2header -->

条件格式化允许工作表根据单元格值或任意公式显示特定的样式，图标等。

条件格式设置规则是在工作表级别添加的，通常会覆盖一系列单元格。

可以将多个规则应用于给定的单元格范围，并且每个规则都将应用自己的样式。

如果多个规则影响给定的单元格，则规则优先级值将确定如果竞争样式冲突，则哪个规则胜出。优先级值较低的规则获胜。如果没有为给定规则指定优先级值，ExcelJS 将按升序分配它们。

注意：目前，仅支持条件格式设置规则的子集。具体来说，只有格式规则不需要 &lt;extLst&gt 元素内的 XML 呈现。这意味着不支持数据集和三个特定的图标集（3Triangles，3Stars，5Boxes）。

```javascript
// 根据行和列为偶数或奇数向 A1:E7 添加一个棋盘图案
worksheet.addConditionalFormatting({
  ref: 'A1:E7',
  rules: [
    {
      type: 'expression',
      formulae: ['MOD(ROW()+COLUMN(),2)=0'],
      style: {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          bgColor: { argb: 'FF00FF00' },
        },
      },
    },
  ],
});
```

**支持的条件格式设置规则类型**

| 类型         | 描述                                           |
| ------------ | ---------------------------------------------- |
| expression   | 任何自定义功能均可用于激活规则。               |
| cellIs       | 使用指定的运算符将单元格值与提供的公式进行比较 |
| top10        | 将格式化应用于值在顶部（或底部）范围内的单元格 |
| aboveAverage | 将格式化应用于值高于（或低于）平均值的单元格   |
| colorScale   | 根据其值在范围内的位置将彩色背景应用于单元格   |
| iconSet      | 根据值将一系列图标之一添加到单元格             |
| containsText | 根据单元格是否为特定文本来应用格式             |
| timePeriod   | 根据单元格日期时间值是否在指定范围内应用格式   |

### 表达式[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 可选 | 默认值       | 描述                                                                      |
| -------- | ---- | ------------ | ------------------------------------------------------------------------- |
| type     |      |              | `'expression'`                                                            |
| priority | Y    | &lt;auto&gt; | 确定样式的优先顺序                                                        |
| formulae |      |              | 1 个包含真/假值的公式字符串数组。要引用单元格值，请使用左上角的单元格地址 |
| style    |      |              | 公式返回 `true` 时要应用的样式结构                                        |

### Cell Is[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 可选 | 默认值       | 描述                                               |
| -------- | ---- | ------------ | -------------------------------------------------- |
| type     |      |              | `'cellIs'`                                         |
| priority | Y    | &lt;auto&gt; | 确定样式的优先顺序                                 |
| operator |      |              | 如何将单元格值与公式结果进行比较                   |
| formulae |      |              | 1 个公式字符串数组，返回要与每个单元格进行比较的值 |
| style    |      |              | 如果比较返回 `true`，则应用样式结构                |

**Cell Is 运算符**

| 运算        | 描述                                                   |
| ----------- | ------------------------------------------------------ |
| equal       | 如果单元格值等于公式值，则应用格式                     |
| greaterThan | 如果单元格值大于公式值，则应用格式                     |
| lessThan    | 如果单元格值小于公式值，则应用格式                     |
| between     | 如果单元格值在两个公式值之间（包括两个值），则应用格式 |

### Top 10[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 可选 | 默认值       | 描述                                          |
| -------- | ---- | ------------ | --------------------------------------------- |
| type     |      |              | `'top10'`                                     |
| priority | Y    | &lt;auto&gt; | 确定样式的优先顺序                            |
| rank     | Y    | 10           | 指定格式中包含多少个顶部（或底部）值          |
| percent  | Y    | `false`      | 如果为 true，则等级字段为百分比，而不是绝对值 |
| bottom   | Y    | `false`      | 如果为 true，则包含最低值而不是最高值         |
| style    |      |              | 如果比较返回 true，则应用样式结构             |

### 高于平均值[⬆](#目录)<!-- Link generated with jump2header -->

| 属性         | 可选 | 默认值       | 描述                                          |
| ------------ | ---- | ------------ | --------------------------------------------- |
| type         |      |              | `'aboveAverage'`                              |
| priority     | Y    | &lt;auto&gt; | 确定样式的优先顺序                            |
| aboveAverage | Y    | `false`      | 如果为 true，则等级字段为百分比，而不是绝对值 |
| style        |      |              | 如果比较返回 true，则应用样式结构             |

### 色阶[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 可选 | 默认值       | 描述                                                  |
| -------- | ---- | ------------ | ----------------------------------------------------- |
| type     |      |              | `'colorScale'`                                        |
| priority | Y    | &lt;auto&gt; | 确定样式的优先顺序                                    |
| cfvo     |      |              | 2 到 5 个条件格式化值对象的数组，指定值范围内的航路点 |
| color    |      |              | 在给定的航路点使用的相应颜色数组                      |
| style    |      |              | 如果比较返回 true，则应用样式结构                     |

### 图标集[⬆](#目录)<!-- Link generated with jump2header -->

| 属性      | 可选 | 默认值         | 描述                                                                                                |
| --------- | ---- | -------------- | --------------------------------------------------------------------------------------------------- |
| type      |      |                | `'iconSet'`                                                                                         |
| priority  | Y    | &lt;auto&gt;   | 确定样式的优先顺序                                                                                  |
| iconSet   | Y    | 3TrafficLights | 设置使用的图标名称                                                                                  |
| showValue |      | true           | 指定应用范围内的单元格是显示图标和单元格值，还是仅显示图标                                          |
| reverse   |      | false          | 指定是否以保留顺序显示 `iconSet` 中指定的图标集中的图标。 如果 `custom` 等于 `true`，则必须忽略此值 |
| custom    |      | false          | 指定是否使用自定义图标集                                                                            |
| cfvo      |      |                | 2 到 5 个条件格式化值对象的数组，指定值范围内的航路点                                               |
| style     |      |                | 如果比较返回 true，则应用样式结构                                                                   |

### 数据条[⬆](#目录)<!-- Link generated with jump2header -->

| 字段                                 | 可选 | 默认值        | 描述                                                       |
| ------------------------------------ | ---- | ------------- | ---------------------------------------------------------- |
| type                                 |      |               | `'dataBar'`                                                |
| priority                             | Y    | &lt;auto&gt;  | 确定样式的优先顺序                                         |
| minLength                            |      | 0             | 指定此条件格式范围内最短数据条的长度                       |
| maxLength                            |      | 100           | 指定此条件格式范围内最长数据条的长度                       |
| showValue                            |      | true          | 指定条件格式范围内的单元格是否同时显示数据条和数值或数据条 |
| gradient                             |      | true          | 指定数据条是否具有渐变填充                                 |
| border                               |      | true          | 指定数据条是否有边框                                       |
| negativeBarColorSameAsPositive       |      | true          | 指定数据条是否具有与正条颜色不同的负条颜色                 |
| negativeBarBorderColorSameAsPositive |      | true          | 指定数据条的负边框颜色是否不同于正边框颜色                 |
| axisPosition                         |      | 'auto'        | 指定数据条的轴位置                                         |
| direction                            |      | 'leftToRight' | 指定数据条的方向                                           |
| cfvo                                 |      |               | 2 到 5 个条件格式化值对象的数组，指定值范围内的航路点      |
| style                                |      |               | 如果比较返回 true，则应用样式结构                          |

### 包含文字[⬆](#目录)<!-- Link generated with jump2header -->

| 属性     | 可选 | 默认值       | 描述                              |
| -------- | ---- | ------------ | --------------------------------- |
| type     |      |              | `'containsText'`                  |
| priority | Y    | &lt;auto&gt; | 确定样式的优先顺序                |
| operator |      |              | 文本比较类型                      |
| text     |      |              | 要搜索的文本                      |
| style    |      |              | 如果比较返回 true，则应用样式结构 |

**包含文本运算符**

| 运算符            | 描述                                                 |
| ----------------- | ---------------------------------------------------- |
| containsText      | 如果单元格值包含在 `text` 字段中指定的值，则应用格式 |
| containsBlanks    | 如果单元格值包含空格，则应用格式                     |
| notContainsBlanks | 如果单元格值不包含空格，则应用格式                   |
| containsErrors    | 如果单元格值包含错误，则应用格式                     |
| notContainsErrors | 如果单元格值不包含错误，则应用格式                   |

### 时间段[⬆](#目录)<!-- Link generated with jump2header -->

| 属性       | 可选 | 默认值       | 描述                              |
| ---------- | ---- | ------------ | --------------------------------- |
| type       |      |              | `'timePeriod'`                    |
| priority   | Y    | &lt;auto&gt; | 确定样式的优先顺序                |
| timePeriod |      |              | 比较单元格值的时间段              |
| style      |      |              | 如果比较返回 true，则应用样式结构 |

**时间段**

| 时间段    | 描述                                    |
| --------- | --------------------------------------- |
| lastWeek  | 如果单元格值落在最后一周内，则应用格式  |
| thisWeek  | 如果单元格值在本周下降，则应用格式      |
| nextWeek  | 如果单元格值在下一周下降，则应用格式    |
| yesterday | 如果单元格值等于昨天，则应用格式        |
| today     | 如果单元格值等于今天，则应用格式        |
| tomorrow  | 如果单元格值等于明天，则应用格式        |
| last7Days | 如果单元格值在过去 7 天之内，则应用格式 |
| lastMonth | 如果单元格值属于上个月，则应用格式      |
| thisMonth | 如果单元格值在本月下降，则应用格式      |
| nextMonth | 如果单元格值在下个月下降，则应用格式    |

## 大纲级别[⬆](#目录)<!-- Link generated with jump2header -->

Excel 支持大纲；行或列可以根据用户希望查看的详细程度展开或折叠。

大纲级别可以在列设置中定义：

```javascript
worksheet.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32 },
  { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 },
];
```

或直接在行或列上

```javascript
worksheet.getColumn(3).outlineLevel = 1;
worksheet.getRow(3).outlineLevel = 1;
```

工作表大纲级别可以在工作表上设置

```javascript
// 设置列大纲级别
worksheet.properties.outlineLevelCol = 1;

// 设置行大纲级别
worksheet.properties.outlineLevelRow = 1;
```

注意：调整行或列上的大纲级别或工作表上的大纲级别将产生副作用，即还修改受属性更改影响的所有行或列的折叠属性。 例如。：

```javascript
worksheet.properties.outlineLevelCol = 1;

worksheet.getColumn(3).outlineLevel = 1;
expect(worksheet.getColumn(3).collapsed).to.be.true;

worksheet.properties.outlineLevelCol = 2;
expect(worksheet.getColumn(3).collapsed).to.be.false;
```

大纲属性可以在工作表上设置

```javascript
worksheet.properties.outlineProperties = {
  summaryBelow: false,
  summaryRight: false,
};
```

## 图片[⬆](#目录)<!-- Link generated with jump2header -->

将图像添加到工作表是一个分为两个步骤的过程。首先，通过 `addImage()` 函数将图像添加到工作簿中，该函数还将返回 `imageId` 值。然后，使用 `imageId`，可以将图像作为平铺背景或覆盖单元格区域添加到工作表中。

注意：从此版本开始，不支持调整或变换图像。

### 将图片添加到工作簿[⬆](#目录)<!-- Link generated with jump2header -->

`Workbook.addImage` 函数支持按文件名或按 `Buffer` 添加图像。请注意，在两种情况下，都必须指定扩展名。有效的扩展名包括 “jpeg”，“png”，“gif”。

```javascript
// 通过文件名将图像添加到工作簿
const imageId1 = workbook.addImage({
  filename: 'path/to/image.jpg',
  extension: 'jpeg',
});

// 通过 buffer 将图像添加到工作簿
const imageId2 = workbook.addImage({
  buffer: fs.readFileSync('path/to.image.png'),
  extension: 'png',
});

// 通过 base64  将图像添加到工作簿
const myBase64Image = 'data:image/png;base64,iVBORw0KG...';
const imageId2 = workbook.addImage({
  base64: myBase64Image,
  extension: 'png',
});
```

### 将图片添加到工作表背景[⬆](#目录)<!-- Link generated with jump2header -->

使用 `Workbook.addImage` 中的图像 `ID`，可以使用 `addBackgroundImage` 函数设置工作表的背景

```javascript
// 设置背景
worksheet.addBackgroundImage(imageId1);
```

### 在一定范围内添加图片[⬆](#目录)<!-- Link generated with jump2header -->

使用 `Workbook.addImage` 中的图像 `ID`，可以将图像嵌入工作表中以覆盖一定范围。从该范围计算出的坐标将覆盖从第一个单元格的左上角到第二个单元格的右下角。

```javascript
// 在 B2:D6 上插入图片
worksheet.addImage(imageId2, 'B2:D6');
```

使用结构而不是范围字符串，可以部分覆盖单元格。

请注意，为此使用的坐标系基于零，因此 A1 的左上角将为 `{col：0，row：0}`。单元格的分数可以通过使用浮点数来指定，例如 A1 的中点是 `{col：0.5，row：0.5}`。

```javascript
// 在 B2:D6 的一部分上插入图像
worksheet.addImage(imageId2, {
  tl: { col: 1.5, row: 1.5 },
  br: { col: 3.5, row: 5.5 },
});
```

单元格区域还可以具有属性 `"editAs"`，该属性将控制将图像锚定到单元格的方式。它可以具有以下值之一：

| 值          | 描述                                             |
| ----------- | ------------------------------------------------ |
| `undefined` | 它指定使图像将根据单元格移动和调整其大小         |
| `oneCell`   | 这是默认值。图像将与单元格一起移动，但大小不变动 |
| `absolute`  | 图像将不会随着单元格移动或调整大小               |

```javascript
ws.addImage(imageId, {
  tl: { col: 0.1125, row: 0.4 },
  br: { col: 2.101046875, row: 3.4 },
  editAs: 'oneCell',
});
```

### 将图片添加到单元格[⬆](#目录)<!-- Link generated with jump2header -->

您可以将图像添加到单元格，然后以 96dpi 定义其宽度和高度（以像素为单位）。

```javascript
worksheet.addImage(imageId2, {
  tl: { col: 0, row: 0 },
  ext: { width: 500, height: 200 },
});
```

### 添加带有超链接的图片[⬆](#目录)<!-- Link generated with jump2header -->

您可以将带有超链接的图像添加到单元格，并在图像范围内定义超链接。

```javascript
worksheet.addImage(imageId2, {
  tl: { col: 0, row: 0 },
  ext: { width: 500, height: 200 },
  hyperlinks: {
    hyperlink: 'http://www.somewhere.com',
    tooltip: 'http://www.somewhere.com',
  },
});
```

## 工作表保护[⬆](#目录)<!-- Link generated with jump2header -->

可以通过添加密码来保护工作表免受修改。

```javascript
await worksheet.protect('the-password', options);
```

工作表保护也可以删除：

```javascript
worksheet.unprotect();
```

有关如何修改单个单元格保护的详细信息请查看 <a href="#单元格保护">单元格保护</a>。

**注意：** 当 `protect()` 函数返回一个 Promise 代表它是异步的，当前的实现在主线程上运行，并且在 CPU 上将使用平均大约 600 毫秒。可以通过设置 `spinCount` 进行调整，该值可用于使过程更快或更有弹性。

### 工作表保护选项[⬆](#目录)<!-- Link generated with jump2header -->

| 属性                | 默认值  | 描述                               |
| ------------------- | ------- | ---------------------------------- |
| selectLockedCells   | `true`  | 允许用户选择锁定的单元格           |
| selectUnlockedCells | `true`  | 允许用户选择未锁定的单元格         |
| formatCells         | `false` | 允许用户格式化单元格               |
| formatColumns       | `false` | 允许用户格式化列                   |
| formatRows          | `false` | 允许用户格式化行                   |
| insertRows          | `false` | 允许用户插入行                     |
| insertColumns       | `false` | 允许用户插入列                     |
| insertHyperlinks    | `false` | 允许用户插入超链接                 |
| deleteRows          | `false` | 允许用户删除行                     |
| deleteColumns       | `false` | 允许用户删除列                     |
| sort                | `false` | 允许用户对数据进行排序             |
| autoFilter          | `false` | 允许用户过滤表中的数据             |
| pivotTables         | `false` | 允许用户使用数据透视表             |
| spinCount           | 100000  | 保护或取消保护时执行的哈希迭代次数 |

## 文件 I/O[⬆](#目录)<!-- Link generated with jump2header -->

### XLSX[⬆](#目录)<!-- Link generated with jump2header -->

#### 读 XLSX[⬆](#目录)<!-- Link generated with jump2header -->

```javascript
// 从文件读取
const workbook = new Excel.Workbook();
await workbook.xlsx.readFile(filename);
// ... 使用 workbook

// 从流读取
const workbook = new Excel.Workbook();
await workbook.xlsx.read(stream);
// ... 使用 workbook

// 从 buffer 加载
const workbook = new Excel.Workbook();
await workbook.xlsx.load(data);
// ... 使用 workbook
```

#### 写 XLSX

```javascript
// 写入文件
const workbook = createAndFillWorkbook();
await workbook.xlsx.writeFile(filename);

// 写入流
await workbook.xlsx.write(stream);

// 写入 buffer
const buffer = await workbook.xlsx.writeBuffer();
```

### CSV[⬆](#目录)<!-- Link generated with jump2header -->

#### 读 CSV[⬆](#目录)<!-- Link generated with jump2header -->

读取 CSV 文件时支持的选项。

| 属性          | 是否需要 | 类型     | 描述                                                                                                      |
| ------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| dateFormats   | N        | Array    | 指定 dayjs 的日期编码格式。                                                                               |
| map           | N        | Function | 自定义`Array.prototype.map()` 回调函数，用于处理数据。                                                    |
| sheetName     | N        | String   | 指定工作表名称。                                                                                          |
| parserOptions | N        | Object   | [parseOptions 选项](https://c2fo.io/fast-csv/docs/parsing/options) @fast-csv/format 模块以写入 csv 数据。 |

```javascript
// 从文件读取
const workbook = new Excel.Workbook();
const worksheet = await workbook.csv.readFile(filename);
// ... 使用 workbook 或 worksheet

// 从流中读取
const workbook = new Excel.Workbook();
const worksheet = await workbook.csv.read(stream);
// ... 使用 workbook 或 worksheet

// 从带有欧洲日期的文件中读取
const workbook = new Excel.Workbook();
const options = {
  dateFormats: ['DD/MM/YYYY'],
};
const worksheet = await workbook.csv.readFile(filename, options);
// ... 使用 workbook 或 worksheet

// 从具有自定义值解析的文件中读取
const workbook = new Excel.Workbook();
const options = {
  map(value, index) {
    switch (index) {
      case 0:
        // 第1列是字符串
        return value;
      case 1:
        // 第2列是日期
        return new Date(value);
      case 2:
        // 第3列是公式值的JSON
        return JSON.parse(value);
      default:
        // 其余的是数字
        return parseFloat(value);
    }
  },
  // https://c2fo.io/fast-csv/docs/parsing/options
  parserOptions: {
    delimiter: '\t',
    quote: false,
  },
};
const worksheet = await workbook.csv.readFile(filename, options);
// ... 使用 workbook 或 worksheet
```

CSV 解析器使用 [fast-csv](https://www.npmjs.com/package/fast-csv) 读取 CSV 文件。传递给上述写入函数的选项中的 `formatterOptions` 将传递给 @fast-csv/format 模块以写入 csv 数据。 有关详细信息，请参阅 fast-csv README.md。

使用 npm 模块 [dayjs](https://www.npmjs.com/package/dayjs) 解析日期。如果未提供 `dateFormats` 数组，则使用以下 dateFormats：

- 'YYYY-MM-DD\[T\]HH:mm:ss'
- 'MM-DD-YYYY'
- 'YYYY-MM-DD'

请参阅 [dayjs CustomParseFormat 插件](https://github.com/iamkun/dayjs/blob/HEAD/docs/en/Plugin.md#customparseformat)，以获取有关如何构造 `dateFormat` 的详细信息。

#### 写 CSV[⬆](#目录)<!-- Link generated with jump2header -->

写入 CSV 文件时支持的选项。

| 属性             | 是否需要 | 类型     | 描述                                                                                                            |
| ---------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| dateFormat       | N        | String   | 指定 dayjs 的日期编码格式。                                                                                     |
| dateUTC          | N        | Boolean  | 指定 ExcelJS 是否使用`dayjs.utc()`转换时区以解析日期。                                                          |
| encoding         | N        | String   | 指定文件编码格式。                                                                                              |
| includeEmptyRows | N        | Boolean  | 指定是否可以写入空行。                                                                                          |
| map              | N        | Function | 自定义`Array.prototype.map()` 回调函数，用于处理行值。                                                          |
| sheetName        | N        | String   | 指定工作表名称。                                                                                                |
| sheetId          | N        | Number   | 指定工作表 ID。                                                                                                 |
| formatterOptions | N        | Object   | [formatterOptions 选项](https://c2fo.io/fast-csv/docs/formatting/options/) @fast-csv/format 模块写入 csv 数据。 |

```javascript
// 写入文件
const workbook = createAndFillWorkbook();
await workbook.csv.writeFile(filename);

// 写入流
// 请注意，您需要提供 sheetName 或 sheetId 以正确导入到 csv
await workbook.csv.write(stream, { sheetName: 'Page name' });

// 使用欧洲日期时间写入文件
const workbook = new Excel.Workbook();
const options = {
  dateFormat: 'DD/MM/YYYY HH:mm:ss',
  dateUTC: true, // 呈现日期时使用 utc
};
await workbook.csv.writeFile(filename, options);

// 使用自定义值格式写入文件
const workbook = new Excel.Workbook();
const options = {
  map(value, index) {
    switch (index) {
      case 0:
        // 第1列是字符串
        return value;
      case 1:
        // 第2列是日期
        return dayjs(value).format('YYYY-MM-DD');
      case 2:
        // 第3列是一个公式，只写结果
        return value.result;
      default:
        // 其余的是数字
        return value;
    }
  },
  // https://c2fo.io/fast-csv/docs/formatting/options
  formatterOptions: {
    delimiter: '\t',
    quote: false,
  },
};
await workbook.csv.writeFile(filename, options);

// 写入新 buffer
const buffer = await workbook.csv.writeBuffer();
```

CSV 解析器使用 [fast-csv](https://www.npmjs.com/package/fast-csv) 编写 CSV 文件。传递给上述写入函数的选项中的 `formatterOptions` 将传递给 @fast-csv/format 模块以写入 csv 数据。有关详细信息，请参阅 fast-csv README.md。

日期使用 npm 模块 [dayjs](https://www.npmjs.com/package/dayjs) 格式化。如果未提供 `dateFormat`，则使用 `dayjs.ISO_8601`。编写 CSV 时，您可以提供布尔值 `dateUTC` 为 `true`，以使 ExcelJS 解析日期，而无需使用 `dayjs.utc()` 自动转换时区。

### 流式 I/O[⬆](#目录)<!-- Link generated with jump2header -->

上面记录的文件 I/O 需要在内存中建立整个工作簿，然后才能写入文件。虽然方便，但是由于所需的内存量，它可能会限制文档的大小。

流写入器（或读取器）在生成工作簿或工作表数据时对其进行处理，然后将其转换为文件形式。通常，这在内存上效率要高得多，因为最终的内存占用量，甚至中间的内存占用量都比文档版本要紧凑得多，尤其是当您考虑到行和单元格对象一旦提交就被销毁时，尤其如此。

流式工作簿和工作表的接口几乎与文档版本相同，但实际存在一些细微差别：

- 将工作表添加到工作簿后，将无法将其删除。
- 提交行后，将无法再访问该行，因为该行将从工作表中删除。
- 不支持 `unMergeCells()`。

请注意，可以在不提交任何行的情况下构建整个工作簿。提交工作簿后，所有添加的工作表（包括所有未提交的行）将自动提交。但是，在这种情况下，与文档版本相比收效甚微。

#### 流式 XLSX[⬆](#目录)<!-- Link generated with jump2header -->

##### 流式 XLSX 写入器[⬆](#目录)<!-- Link generated with jump2header -->

流式 XLSX 写入器在 `ExcelJS.stream.xlsx` 命名空间中可用。

构造函数采用带有以下字段的可选 `options` 对象：

| 字段             | 描述                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stream           | 指定要写入 XLSX 工作簿的可写流。                                                                                                                                  |
| filename         | 如果未指定流，则此字段指定要写入 XLSX 工作簿的文件的路径。                                                                                                        |
| useSharedStrings | 指定是否在工作簿中使用共享字符串。默认为 `false`                                                                                                                  |
| useStyles        | 指定是否将样式信息添加到工作簿。样式会增加一些性能开销。默认为 `false`                                                                                            |
| zip              | ExcelJS 内部传递给 [Archiver](https://github.com/archiverjs/node-archiver) 的 [Zip 选项](https://www.archiverjs.com/global.html#ZipOptions)。默认值为 `undefined` |

如果在选项中未指定 `stream` 或 `filename`，则工作簿编写器将创建一个 StreamBuf 对象，该对象将 XLSX 工作簿的内容存储在内存中。可以通过属性 `workbook.stream` 访问此 StreamBuf 对象，该对象可用于通过 `stream.read()` 直接访问字节，或将内容通过管道传输到另一个流。

```javascript
// 使用样式和共享字符串构造流式 XLSX 工作簿编写器
const options = {
  filename: './streamed-workbook.xlsx',
  useStyles: true,
  useSharedStrings: true,
};
const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
```

通常，流式 XLSX 写入器的接口与上述文档工作簿（和工作表）相同，实际上行，单元格和样式对象是相同的。

但是有一些区别...

**构造**

如上所示，WorkbookWriter 通常将要求在构造函数中指定输出流或文件。

**提交数据**

当工作表行准备就绪时，应将其提交，以便可以释放行对象和内容。通常，这将在添加每一行时完成...

```javascript
worksheet
  .addRow({
    id: i,
    name: theName,
    etc: someOtherDetail,
  })
  .commit();
```

WorksheetWriter 在添加行时不提交行的原因是允许单元格跨行合并：

```javascript
worksheet.mergeCells('A1:B2');
worksheet.getCell('A1').value = 'I am merged';
worksheet.getCell('C1').value = 'I am not';
worksheet.getCell('C2').value = 'Neither am I';
worksheet.getRow(2).commit(); // now rows 1 and two are committed.
```

每个工作表完成后，还必须提交：

```javascript
// 完成添加数据。 提交工作表
worksheet.commit();
```

要完成 XLSX 文档，必须提交工作簿。 如果未提交工作簿中的任何工作表，则将在工作簿提交中自动提交它们。

```javascript
// 完成 workbook.
await workbook.commit();
// ... 流已被写入
```

##### 流式 XLSX 阅读器[⬆](#目录)<!-- Link generated with jump2header -->

流式 XLSX 工作簿阅读器可以在 ExcelJS.stream.xlsx 命名空间中找到。

构造函数包含必需的输入参数和可选的 options 参数:

| Argument              | Description                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| input (必需的)        | 指定从中读取 XLSX 工作簿的文件或可读流的名称                                                                                                                                             |
| options (可选的)      | 指定如何处理读取解析期间发生的事件类型                                                                                                                                                   |
| options.entries       | 指定是否去触发事件(`'emit'`)或者不发出事件(`'ignore'`)，默认值是`'emit'`                                                                                                                 |
| options.sharedStrings | 指定是否去缓存(`'cache'`)共享字符串，将其插入到相应的单元格值中，或者是否去触发(`'emit'`)或忽略(`'ignore'`)它们，在这两种情况下，单元格值都将是对共享字符串索引的引用。默认值是`'cache'` |
| options.hyperlinks    | 指定是否去缓存超链接(`'cache'`)，将其插入到相应的单元格值中，是否去触发(`'emit'`)或忽略(`'ignore'`)它们。默认值是`'cache'`                                                               |
| options.styles        | 指定是否去缓存样式(`'cache'`)，将其插入到相应的行或单元格值中，或是否忽略(`'忽略'`)它们。默认值是`'cache'`                                                                               |
| options.worksheets    | 指定是否去触发(`'emit'`)或忽略(`'ignore'`)工作表。默认值是`'emit'`                                                                                                                       |

```js
const workbook = new ExcelJS.stream.xlsx.WorkbookReader('./file.xlsx');
for await (const worksheetReader of workbookReader) {
  for await (const row of worksheetReader) {
    // ...
  }
}
```

请注意，由于性能原因，`worksheetReader`返回一个行数组，而不是单独返回每一行: https://github.com/nodejs/node/issues/31979

###### 迭代遍历所有事件[⬆](#目录)<!-- Link generated with jump2header -->

工作簿上的事件是 'worksheet'、'shared-strings' 和 'hyperlinks'。 工作表上的事件是 'row' 和 'hyperlinks'.

```js
const options = {
  sharedStrings: 'emit',
  hyperlinks: 'emit',
  worksheets: 'emit',
};
const workbook = new ExcelJS.stream.xlsx.WorkbookReader('./file.xlsx', options);
for await (const { eventType, value } of workbook.parse()) {
  switch (eventType) {
    case 'shared-strings':
    // 值是共享字符串
    case 'worksheet':
    // 值是worksheetReader
    case 'hyperlinks':
    // 值是hyperlinksReader
  }
}
```

###### 可读流[⬆](#目录)<!-- Link generated with jump2header -->

我们强烈建议使用异步迭代，但我们也公开了流接口以实现向后兼容性。

```js
const options = {
  sharedStrings: 'emit',
  hyperlinks: 'emit',
  worksheets: 'emit',
};
const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(
  './file.xlsx',
  options
);
workbookReader.read();

workbookReader.on('worksheet', worksheet => {
  worksheet.on('row', row => {});
});

workbookReader.on('shared-strings', sharedString => {
  // ...
});

workbookReader.on('hyperlinks', hyperlinksReader => {
  // ...
});

workbookReader.on('end', () => {
  // ...
});
workbookReader.on('error', err => {
  // ...
});
```

# 浏览器[⬆](#目录)<!-- Link generated with jump2header -->

该库的一部分已被隔离，并经过测试可在浏览器环境中使用。

由于工作簿读写器的流式传输性质，因此未包括这些内容。只能使用基于文档的工作簿（有关详细信息，请参见 <a href="#创建工作簿">创建工作簿</a>）。

例如，在浏览器中使用 ExcelJS 的代码可查看 github 中的<a href="https://github.com/exceljs/exceljs/tree/master/spec/browser"> spec / browser </a>文件夹。

## 预捆绑[⬆](#目录)<!-- Link generated with jump2header -->

以下文件已预先捆绑在一起，并包含在 _dist_ 文件夹中。

- exceljs.js
- exceljs.min.js

# 值类型[⬆](#目录)<!-- Link generated with jump2header -->

支持以下值类型。

## Null 值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Null`

空值表示没有值，通常在写入文件时将不存储（合并的单元格除外）。可用于从单元格中删除该值。例如：

```javascript
worksheet.getCell('A1').value = null;
```

## 合并单元格[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Merge`

合并单元格是其值绑定到另一个“主”单元格的单元格。分配给合并单元将导致修改单元格。

## 数字值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Number`

一个数字值。

例如：

```javascript
worksheet.getCell('A1').value = 5;
worksheet.getCell('A2').value = 3.14159;
```

## 字符串值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.String`

一个简单的文本字符串。

例如：

```javascript
worksheet.getCell('A1').value = 'Hello, World!';
```

## 日期值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Date`

日期值，由 JavaScript Date 类型表示。

例如：

```javascript
worksheet.getCell('A1').value = new Date(2017, 2, 15);
```

## 超链接值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Hyperlink`

具有文本和链接值的 URL。

例如：

```javascript
// 链接到网络
worksheet.getCell('A1').value = {
  text: 'www.mylink.com',
  hyperlink: 'http://www.mylink.com',
  tooltip: 'www.mylink.com',
};

// 内部链接
worksheet.getCell('A1').value = { text: 'Sheet2', hyperlink: "#'Sheet2'!A1" };
```

## 公式值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Formula`

一个 Excel 公式，用于即时计算值。请注意，虽然单元格类型将为“公式”，但该单元格可能具有一个有效类型值，该值将从结果值中得出。

请注意，ExcelJS 无法处理公式以生成结果，必须提供该公式。

例如：

```javascript
worksheet.getCell('A3').value = { formula: 'A1+A2', result: 7 };
```

单元格还支持便捷的获取器，以访问公式和结果：

```javascript
worksheet.getCell('A3').formula === 'A1+A2';
worksheet.getCell('A3').result === 7;
```

### 共享公式[⬆](#目录)<!-- Link generated with jump2header -->

共享的公式通过减少工作表 xml 中文本的重复来增强 xlsx 文档的压缩。范围中左上角的单元格是指定的母版，它将保留该范围内的所有其他单元格都将引用的公式。然后，其他“从属”单元格可以引用此主单元格，而不必再次重新定义整个公式。请注意，主公式将以常用的 Excel 方式转换为从属单元格，以便对其他单元格的引用将根据从属单元相对于主单元的偏移量向右下移。例如：如果主单元格 A2 具有引用 A1 的公式，则如果单元格 B2 共享 A2 的公式，则它将引用 B1。

可以将主公式与该范围内的从属单元格一起分配给该单元格

```javascript
worksheet.getCell('A2').value = {
  formula: 'A1',
  result: 10,
  shareType: 'shared',
  ref: 'A2:B3',
};
```

可以使用新的值形式将共享公式分配给单元格：

```javascript
worksheet.getCell('B2').value = { sharedFormula: 'A2', result: 10 };
```

这指定单元格 B2 是将从 A2 中的公式派生的公式，其结果为 10。

公式便捷获取器会将 A2 中的公式转换为 B2 中应具有的公式：

```javascript
expect(worksheet.getCell('B2').formula).to.equal('B1');
```

可以使用 `fillFormula` 方法将共享的公式分配到工作表中：

```javascript
// 将 A1 设置为起始编号
worksheet.getCell('A1').value = 1;

// 从 A1 开始以递增计数将 A2 填充到 A10
worksheet.fillFormula('A2:A10', 'A1+1', [2, 3, 4, 5, 6, 7, 8, 9, 10]);
```

`fillFormula` 也可以使用回调函数来计算每个单元格的值

```javascript
// 从A1开始以递增计数将 A2 填充到 A100
worksheet.fillFormula('A2:A100', 'A1+1', (row, col) => row);
```

### 公式类型[⬆](#目录)<!-- Link generated with jump2header -->

要区分真正的和转换后的公式单元格，请使用 FormulaType getter：

```javascript
worksheet.getCell('A3').formulaType === Enums.FormulaType.Master;
worksheet.getCell('B3').formulaType === Enums.FormulaType.Shared;
```

公式类型具有以下值：

| 名称                     | 值  |
| ------------------------ | --- |
| Enums.FormulaType.None   | 0   |
| Enums.FormulaType.Master | 1   |
| Enums.FormulaType.Shared | 2   |

### 数组公式[⬆](#目录)<!-- Link generated with jump2header -->

在 Excel 中表示共享公式的一种新方法是数组公式。以这种形式，主单元格是唯一包含与公式有关的任何信息的单元格。它包含 shareType 'array' 以及适用于其的单元格范围以及将要复制的公式。其余单元格是具有常规值的常规单元格。

注意：数组公式不会以共享公式的方式转换。因此，如果主单元 A2 引用 A1，则从单元 B2 也将引用 A1。

例如：

```javascript
// 将数组公式分配给 A2:B3
worksheet.getCell('A2').value = {
  formula: 'A1',
  result: 10,
  shareType: 'array',
  ref: 'A2:B3',
};

// 可能没有必要填写工作表中的其余值
```

`fillFormula` 方法也可以用于填充数组公式

```javascript
// 用数组公式 "A1" 填充 A2:B3
worksheet.fillFormula('A2:B3', 'A1', [1, 1, 1, 1], 'array');
```

## 富文本值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.RichText`

样式丰富的文本。

例如：

```javascript
worksheet.getCell('A1').value = {
  richText: [{ text: 'This is ' }, { font: { italic: true }, text: 'italic' }],
};
```

## 布尔值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Boolean`

例如：

```javascript
worksheet.getCell('A1').value = true;
worksheet.getCell('A2').value = false;
```

## 错误值[⬆](#目录)<!-- Link generated with jump2header -->

Enum: `Excel.ValueType.Error`

例如：

```javascript
worksheet.getCell('A1').value = { error: '#N/A' };
worksheet.getCell('A2').value = { error: '#VALUE!' };
```

当前有效的错误文本值为：

| 名称                           | 值      |
| ------------------------------ | ------- |
| Excel.ErrorValue.NotApplicable | #N/A    |
| Excel.ErrorValue.Ref           | #REF!   |
| Excel.ErrorValue.Name          | #NAME?  |
| Excel.ErrorValue.DivZero       | #DIV/0! |
| Excel.ErrorValue.Null          | #NULL!  |
| Excel.ErrorValue.Value         | #VALUE! |
| Excel.ErrorValue.Num           | #NUM!   |

# 接口变化[⬆](#目录)<!-- Link generated with jump2header -->

我们会尽一切努力创建一个良好的，一致的接口，该接口不会在版本之间不兼容，但令人遗憾的是，为了实现更大的利益，有时需要进行一些更改。

## 0.1.0[⬆](#目录)<!-- Link generated with jump2header -->

### Worksheet.eachRow[⬆](#目录)<!-- Link generated with jump2header -->

在 `Worksheet.eachRow` 的回调函数中的参数已被交换和更改；它是 `function(rowNumber，rowValues)`，现在是 `function(row，rowNumber)`，使它的外观更像 _underscore(`_.each`)方法，并且行对象优先于行号。_

### Worksheet.getRow[⬆](#目录)<!-- Link generated with jump2header -->

此函数已从返回稀疏的单元格数组更改为返回 `Row` 对象。这样可以访问行属性，并有助于管理行样式等。

仍可通过 `Worksheet.getRow(rowNumber).values;` 获得稀疏的单元格值的数组。

## 0.1.1[⬆](#目录)<!-- Link generated with jump2header -->

### cell.model[⬆](#目录)<!-- Link generated with jump2header -->

`cell.styles` 重命名为 `cell.style`

## 0.2.44[⬆](#目录)<!-- Link generated with jump2header -->

从 Bluebird 切换到 Node 原生 Promise 的函数返回的 Promise 如果依赖 Bluebird 的额外功能，则可能会破坏调用代码。

为了减少这种情况的出现，在 0.3.0 中添加了以下两个更改：

- 默认情况下使用功能更全且仍与浏览器兼容的 promise lib。 该库支持 Bluebird 的许多功能，但占用空间少得多。
- 注入其他 Promise 实现的选项。有关更多详细信息，请参见<a href="#配置">配置</a>部分。

# 配置[⬆](#目录)<!-- Link generated with jump2header -->

ExcelJS 现在支持对 Promise 库的依赖项注入。您可以通过在模块中包含以下代码来还原 Bluebird Promise。

```javascript
ExcelJS.config.setValue('promise', require('bluebird'));
```

请注意：我已经使用 bluebird 专门测试了 ExcelJS（直到最近，这是它使用的库）。根据我所做的测试，它不适用于 Q。

# 注意事项[⬆](#目录)<!-- Link generated with jump2header -->

## Dist 文件夹[⬆](#目录)<!-- Link generated with jump2header -->

在发布此模块之前，先对源代码进行编译和其他处理，然后再将它们放置在 _dist/_ 文件夹中。该自述文件标识两个文件-浏览器捆绑和压缩版本。除了在 package.json 中指定为 `"main"` 的文件外，不能保证 _dist/_ 文件夹的其他内容。

# 已知的问题[⬆](#目录)<!-- Link generated with jump2header -->

## 使用 Puppeteer 进行测试[⬆](#目录)<!-- Link generated with jump2header -->

该 lib 中包含的测试套件包括一个在无头浏览器中执行的小脚本，以验证捆绑的软件包。 在撰写本文时，其表现出该测试在 Windows Linux 子系统中不能很好地进行。

因此，可以通过存在名为 _.disable-test-browser_ 的文件来禁用浏览器测试。

```bash
sudo apt-get install libfontconfig
```

## 拼接与合并[⬆](#目录)<!-- Link generated with jump2header -->

如果任何 `splice` 操作影响合并的单元格，则合并组将无法正确移动