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
ng generate component article
// 可添加目录
ng generate service ./serveices/eventBus
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

<input value="value" />
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

constructor(private datePipe: DatePipe) {}

this.datePipe.transform()
```

#### 自定义管道

```bash
ng generate pipe search
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

// declarations部分是声明模块的内部成员。（可以是组件、管道、指令）
// imports部分是导入其它模块。
// providers指定应用程序根级别需要使用的service。（一般是service）
// bootstrap是app启动的根组件。

// export控制将那些内部成员暴露给外部使用。
```

### 防抖方法实现

```ts
withRefresh = false;
packages$!: Observable<NpmPackageInfo[]>;
private searchText$ = new Subject<string>();

search(packageName: string) {
  this.searchText$.next(packageName);
}

ngOnInit() {
  this.packages$ = this.searchText$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(packageName =>
      this.searchService.search(packageName, this.withRefresh))
  );
}

constructor(private searchService: PackageSearchService) { }

```

`searchText$` 是来自用户的搜索框值的序列。它被定义为 RxJS `Subject` 类型，这意味着它是一个多播 `Observable`，它还可以通过调用 `next(value)` 来自行发出值，就像在 `search()` 方法中一样。

除了把每个 `searchText` 的值都直接转发给 `PackageSearchService` 之外，`ngOnInit()` 中的代码还通过下列三个操作符对这些搜索值进行*管道*处理，以便只有当它是一个新值并且用户已经停止输入时，要搜索的值才会抵达该服务。

- `debounceTime(500)`⁠—等待用户停止输入（本例中为 1/2 秒）。
- `distinctUntilChanged()`⁠—等待搜索文本发生变化。
- `switchMap()`⁠—将搜索请求发送到服务。

## 父子组件通信

### Input、Output 传值

```js
// 输入
<child title = "我的子组件"> </child>
@Input
public title: string = "";
// 输出
<child title="我的子组件" (follow)="getFollow($event)" #child ></child>

@Output()
public follow = new EventEmitter();
this.follow.emit("子组件传来的数据");
```

### 服务总线

1. 注册服务

```bash
ng g s ./services/eventBus
```

```js
import {
  Injectable
} from "@angular/core";
import {
  Observable,
  Subject
} from "rxjs";

// 服务总线 组件间分享数据
@Injectable({
  providedIn: "root" // 在所有组件共享数据
})
export class EventBusService {
  public eventBus: Subject < string > = new Subject();
  constructor() {}
}
```

`service` 也可以指定在某个某块生效，比如下方 `service` 就只在`UserModule`中生效

```js
import { Injectable } from '@angular/core';
import { UserModule } from './user.module';

@Injectable({
  providedIn: UserModule,
})
export class UserService {}
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

## 路由导航

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildComponent } from './child/child.component';
import { BrotherComponent } from './brother/brother.component';

const routes: Routes = [
  {
    path: '',
    component: ChildComponent,
  },
  {
    path: 'brother',
    component: BrotherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

```html
<!-- RouterOutlet 相当于一个占位符, 在Angular中根据路由状态动态插入视图  -->
<a [routerLink]="['/']"> child </a><br />
<a [routerLink]="['/brother']"> brother </a>
<router-outlet></router-outlet>
```

### 路由懒加载

使用`loadChildren`可以配置路由懒加载

```js
const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule),
  },
];
```

## http 服务

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

如果想使用`async`语法，可以把`angular`观察对象转成`promise`

```js
this.httpClient.request(UserService.METHOD_POST, url, options).toPromise();
```

### 集中处理 http 的 error

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

## angular.json

```json
// angular.json
"budgets": [{
  "type": "initial",
  "maximumWarning": "2mb",
  "maximumError": "5mb"
}]
// 这个配置适用于打包文件限制 ng build --prod
// 打包生成生产环境时如果包大于2MB,那么CLI工具会提示waning,如果大于5MB,中断打包。

{
  "project": {
    "name": "ng-admin", //项目名称
    "ejected": false // 标记该应用是否已经执行过eject命令把webpack配置释放出来
  },
  "apps": [
    {
      "root": "src", // 源码根目录
      "outDir": "dist", // 编译后的输出目录，默认是dist/
      "assets": [
        // 记录资源文件夹，构建时复制到`outDir`指定的目录
        "assets",
        "favicon.ico"
      ],
      "index": "index.html", // 指定首页文件，默认值是"index.html"
      "main": "main.ts", // 指定应用的入门文件
      "polyfills": "polyfills.ts", // 指定polyfill文件
      "test": "test.ts", // 指定测试入门文件
      "tsconfig": "tsconfig.app.json", // 指定tsconfig文件
      "testTsconfig": "tsconfig.spec.json", // 指定TypeScript单测脚本的tsconfig文件
      "tsconfig": "tsconfig.app.json",
      "prefix": "app", // 使用`ng generate`命令时，自动为selector元数据的值添加的前缀名
      "deployUrl": "//cdn.com.cn", // 指定站点的部署地址，该值最终会赋给webpack的output.publicPath，常用于CDN部署
      "styles": [
        // 引入全局样式，构建时会打包进来，常用于第三方库引入的样式
        "styles.css"
      ],
      "scripts": [
        // 引入全局脚本，构建时会打包进来，常用语第三方库引入的脚本
      ],
      "environmentSource": "environments/environment.ts", // 基础环境配置
      "environments": {
        // 子环境配置文件
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ],
  "e2e": {
    "protractor": {
      "config": "./protractor.conf.js"
    }
  },
  "lint": [
    {
      "project": "src/tsconfig.app.json"
    },
    {
      "project": "src/tsconfig.spec.json"
    },
    {
      "project": "e2e/tsconfig.e2e.json"
    }
  ],
  "test": {
    "karma": {
      "config": "./karma.conf.js"
    }
  },
  "defaults": {
    // 执行`ng generate`命令时的一些默认值
    "styleExt": "scss", // 默认生成的样式文件后缀名
    "component": {
      "flat": false, // 生成组件时是否新建文件夹包装组件文件，默认为false（即新建文件夹）
      "spec": true, // 是否生成spec文件，默认为true
      "inlineStyle": false, // 新建时是否使用内联样式，默认为false
      "inlineTemplate": false, // 新建时是否使用内联模板，默认为false
      "viewEncapsulation": "Emulated", // 指定生成的组件的元数据viewEncapsulation的默认值
      "changeDetection": "OnPush" // 指定生成的组件的元数据changeDetection的默认值
    }
  }
}
```

[官网参考](https://angular.cn/guide/workspace-config)
