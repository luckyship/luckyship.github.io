---
layout: post
title: angular7基础
tags: [angular, javascript, web]
comments: true
date: 2021-05-12 22:24:02
---

## 开始准备

1. 安装 nodejs

```bash
npm -v
```

2. 安装@angular/cli

```bash
npm i -g @angular/cli
```

3. CLI 命令建立项目

```bash
ng new ng7demo
```

选择是否加入路由模块以及哪种 css 预处理器

> 可 ctrl+c 取消自动安装 node_modules，手动进入项目 npm install
> node-sass 安装不上可切换淘宝镜像库或者用 cnpm 安装

1. npm config set registry https://registry.npm.taobao.org
   npm install

or

2. npm install -g cnpm
   cnpm install

3. 启动项目

```bash
ng serve --open // 自动打开浏览器 http://localhost:4200/
```

---

<!--more-->

## 语法

### 生成组件

```bash
// 标签app-article 如果不想要或者自定义前缀可在angular.json里修改prefix属性
ng g c article
// 可添加目录
ng g s ./serveices/eventBus
//
```

### 组件引用

```html
// 标签方式引用
<app-article></app-article>
// 属性方式引用
<div app-article></div>
// 类方式引用
<div class="app-article"></div>
```

```js
// @Component装饰器标识这是一个组件
@Component({
  //selector: 'app-article',
  //selector: '[app-article]', //属性方式
  selector: '.app-article', //类方式
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
```

### 插值表达式

将业务逻辑中的数据通过插值表达式显示在模板文件，即 html 页面上，或者将 html 页面上的事件传输到业务逻辑。

```html
<p>标题是{{title}}</p>
```

### 属性绑定

```html
<img [src]="imgSrc" />
<input value="value"
```

### 插值运算 加减乘除/字符串拼接/三元/方法调用

```
{{5+3}},{{5-3}},{{5*3}},{{5/3}},{{ "a" + "b"}},{{true?1:0}}
```

### 事件绑定

```html
<button (click)="showModal('click')"></button>
<!-- 传递事件参数 -->
<input type="text" (keyup)="updateContent($event)" />
<!-- 双向绑定 视图和数据，只要一方发生变化，另一方跟着变化。 -->
<!-- 不需要在代码中手动更新视图，简化开发，增加代码内聚性，代码可读性更强。 -->
<input type="text" [(ngModel)]="title" />
<!-- 为了ngModel能够解析需要引入 import {FormsModule} from "@angular/forms"; -->
```

### 模板指令

#### 判断指令

```html
<img *ngIf="imgShow;else #p1" />
<p #p1></p>
```

#### 样式指令

```html
<p [ngClass]="{bg:true}">这段内容应用的是类样式。</p>
<p [ngStyle]="{backgroundColor:pink}">本段内容样式是内联样式。</p>
```

#### 循环指令

```html
<ul>
  <li *ngFor="let race of raceList; let i = index">{{ race.name }}-{{ i + 1 }}</li>
</ul>
```

### 管道符

```
{{currentTime | date: "yyyy-MM-dd HH:mm:ss" }}
```

#### 在 ts 中的用法

```js
import { DatePipe } from '@angular/common';

constructor(
        private datePipe: DatePipe,
    ) {}

this.datePipe.transform()
```

#### 自定义管道

```bash
ng g p search
```

为了节省性能，`angular` 内部对管道进行了优化，参数 `pure` 为 `true` 时(纯管道)，当只有数据变化时，才会触发管道的执行，
基于这样的机制，`angular` 管道无法检测到数组，对象这样复杂数据类型的值的变化，所以针对这样的数据 `pure` 应设为 `false`(非纯管道)

```js
@Pipe({
  name: 'flyingHeroesImpure',
  pure: false,
})
export class FlyingHeroesImpurePipe extends FlyingHeroesPipe {}
```

[参考](https://angular.cn/guide/pipes#transforming-data-with-parameters-and-chained-pipes)

#### 内置管道

|                          管道名                          |                               用途                               |
| :------------------------------------------------------: | :--------------------------------------------------------------: |
|      [date](https://angular.cn/api/common/DatePipe)      |                       日期管道，格式化日期                       |
| [json](https://angular.cn/api/common/JsonPipe)(非纯管道) | 将输入数据对象经过，`JSON.stringify()`方法转换后输出对象的字符串 |
|                        uppercase                         |                 将文本所有小写字母转换成大写字母                 |
|                        lowercase                         |                 将文本所有大写字母转换成小写字母                 |
|   [number](https://angular.cn/api/common/DecimalPipe)    |                    将数值按特定的格式显示文本                    |
|                         percent                          |                        将数值转百分比格式                        |
| [currentcy](https://angular.cn/api/common/CurrencyPipe)  |                     将数值进行货币格式化处理                     |
|                     slice(非纯管道)                      |                   将数组或者字符串裁剪成新子集                   |
|                           i18n                           |                             翻译管道                             |

### 父子组件通信

```js
// 输入
<child title = "我的子组件"> </child>
@Input
public title: string = "";
// 输出
<child title="我的子组件" #child (follow) = "getFollow($event)" > </child>

@Output()
public follow = new EventEmitter();
this.follow.emit("子组件传来的数据");
```

### 服务总线

1. 注册服务

```js
ng g s. / services / eventBus
import {
  Injectable
} from "@angular/core";
import {
  Observable,
  Subject
} from "rxjs";
// 服务总线 组件间分享数据
@Injectable({
  providedIn: "root"
})
export class EventBusService {
  public eventBus: Subject < string > = new Subject();
  constructor() {}
}
```

2. 组件内发射数据

```javascript
this.eventBusService.eventBus.next('child组件发送的数据');
```

3. 组件接收数据

```javascript
this.eventBusService.eventBus.subscribe(arg => {
  console.log(`接收到事件${arg}`);
});
```

### 标签变量引用

```html
<child title="我的子组件" #child (follow)="getFollow($event)"></child>
<button (click)="child.sayHello()">子组件说话</button>
```

### 组件注册

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
// import部分是模块以及装饰器的引入。
// declarations部分是声明模块的内部成员。
// imports部分是导入其它模块。
// providers指定应用程序根级别需要使用的service。
// bootstrap是app启动的根组件。
// export控制将那些内部成员暴露给外部使用。
```

### 路由导航

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';
import { ChildComponent } from "./child/child.component";
import { BrotherComponent } from "./brother/brother.component";

const routes: Routes = [{
    path: '',
    component: ChildComponent
  },
  {
    path: 'brother',
    component: BrotherComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

//RouterOutlet 相当于一个占位符, 在Angular中根据路由状态动态插入视图
<a [routerLink]="['/']" > child </a><br/>
<a [routerLink]="['/brother']"> brother </a>
<router-outlet></router-outlet>
```

### http 服务

```js
// app.module.ts
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// services
import { Headers } from '@angular/http';
import { HttpClient, HttpResponse } from '@angular/common/http';

this.httpClient.request(UserService.METHOD_POST, url, options).subscribe(
  next => {},
  error => {},
  complete => {} // 指next完成后，会执行complete, 并不是finally的意思
);
```

#### 集中处理 http 的 error

```js
class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    // do something with the exception
  }
}

@NgModule({
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
})
class MyModule {}
```

[参考](https://angular.cn/api/core/ErrorHandler)

## angular 通过 ip 访问

绑定到`0.0.0.0`上

```bash
# ng serve --host 0.0.0.0 --port 4200
```

## ng7 的新特性

```js
// angular.json
"budgets": [{
  "type": "initial",
  "maximumWarning": "2mb",
  "maximumError": "5mb"
}]
// 这个配置适用于打包文件限制 ng build --prod
// 打包生成生产环境时如果包大于2MB,那么CLI工具会提示waning,如果大于5MB,中断打包。
```

## 参考

[angular7](https://mydearest.cn/)
