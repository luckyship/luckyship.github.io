---
layout: post
title: angular7基础
tags: [angular, javascript, web]
comments: true
date: 2021-05-12 22:24:02
---

## 开始准备
1. 安装nodejs
```
npm -v
```

2. 安装@angular/cli
```
npm i -g @angular/cli
```

3. CLI命令建立项目
```
ng new ng7demo
```
选择是否加入路由模块以及哪种css预处理器

> 可ctrl+c取消自动安装node_modules，手动进入项目npm install
> node-sass安装不上可切换淘宝镜像库或者用cnpm安装
1. npm config set registry https://registry.npm.taobao.org 
   npm install

or 

2. npm install -g cnpm 
   cnpm install 

4. 启动项目
```javascript
ng serve --open // 自动打开浏览器 http://localhost:4200/
```
---
<!--more-->

## 语法
### 生成组件
```
// 标签app-article 如果不想要或者自定义前缀可在angular.json里修改prefix属性
ng g c article
// 可添加目录
ng g s ./serveices/eventBus
// 
```
### 组件引用
```
// 标签方式引用
<app-article></app-article>
// 属性方式引用
<div app-article></div>
// 类方式引用
<div class="app-article"></div>
```

```
// @Component装饰器标识这是一个组件
@Component({
  //selector: 'app-article',
  //selector: '[app-article]', //属性方式
    selector: '.app-article',//类方式
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
```

### 插值表达式
将业务逻辑中的数据通过插值表达式显示在模板文件，即html页面上，或者将html页面上的事件传输到业务逻辑。

```
<p>标题是{{title}}</p>
```
### 属性绑定
```
<img [src]="imgSrc" />
<input value="value"
```

### 插值运算 加减乘除/字符串拼接/三元/方法调用
```
{{5+3}},{{5-3}},{{5*3}},{{5/3}},{{ "a" + "b"}},{{true?1:0}}
```
### 事件绑定
```
<button (click)="showModal('click')"><button>
// 传递事件参数
<input type="text" (keyup) = "updateContent($event)"/>
// 双向绑定 视图和数据，只要一方发生变化，另一方跟着变化。
// 不需要在代码中手动更新视图，简化开发，增加代码内聚性，代码可读性更强。
<input type="text" [(ngModel)]="title"/>
// 为了ngModel能够解析需要引入import {FormsModule} from "@angular/forms";
```

### 模板指令
#### 判断指令
```
<img *ngIf="imgShow;else #p1"/>
<p #p1></p>
```
#### 样式指令
```
<p [ngClass]="{bg:true}">这段内容应用的是类样式。</p>
<p [ngStyle]="{backgroundColor:pink}">本段内容样式是内联样式。</p>
```
#### 循环指令
```
<ul>
    <li *ngFor="let race of raceList; let i = index">
    {{ race.name }}-{{ i + 1 }}
    </li>
</ul>
```

### 管道符
```
{{currentTime | date: "yyyy-MM-dd HH:mm:ss" }}
```
### 父子组件通信
```
// 输入
<child title="我的子组件"></child>
@Input
public title:string =""
// 输出
<child title="我的子组件" #child (follow)="getFollow($event)"></child>
@Output()
public follow = new EventEmitter();
this.follow.emit("子组件传来的数据");
```
### localsStorage

### 服务总线
1. 注册服务
```
ng g s ./services/eventBus
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
// 服务总线 组件间分享数据
@Injectable({
  providedIn: "root"
})
export class EventBusService {
  public eventBus: Subject<string> = new Subject();
  constructor() {}
}
```

2. 组件内发射数据
```javascript
this.eventBusService.eventBus.next("child组件发送的数据");
```

3. 组件接收数据
```javascript
this.eventBusService.eventBus.subscribe(arg => {
    console.log(`接收到事件${arg}`);
});
```

### 标签变量引用
```
<child title="我的子组件" #child (follow)="getFollow($event)"></child>
<button (click)="child.sayHello()">子组件说话</button>
```

### 组件注册
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// import部分是模块以及装饰器的引入。
// declarations部分是声明模块的内部成员。
// imports部分是导入其它模块。
// providers指定应用程序根级别需要使用的service。
// bootstrap是app启动的根组件。
// export控制将那些内部成员暴露给外部使用。
```

### 路由导航
```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildComponent } from "./child/child.component";
import { BrotherComponent } from "./brother/brother.component";

const routes: Routes = [{
  path: '',
  component: ChildComponent
},
{
  path: 'brother',
  component: BrotherComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


<!--RouterOutlet 相当于一个占位符,在Angular中根据路由状态动态插入视图。-->
<a [routerLink]="['/']">child</a><br/>
<a [routerLink]="['/brother']">brother</a>
<router-outlet></router-outlet>
```
### http服务
```
// app.module.ts
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// services
import { Headers } from '@angular/http';
import { HttpClient, HttpResponse } from '@angular/common/http';

this.httpClient.request(UserService.METHOD_POST, url, options).subscribe((data)=>{});
``` 

## ng7的新特性
```
// angular.json
"budgets": [
    {
        "type": "initial",
        "maximumWarning": "2mb",
        "maximumError": "5mb"
    }
]
// 这个配置适用于打包文件限制 ng build --prod 
// 打包生成生产环境时如果包大于2MB,那么CLI工具会提示waning,如果大于5MB,中断打包。
```

## 参考
[angular7](https://mydearest.cn/)