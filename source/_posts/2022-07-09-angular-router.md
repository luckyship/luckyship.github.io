---
layout: post
title: angular 路由
tags: [angular, javascript]
comments: true
date: 2022-07-09 10:59:05
---

### 路由注册

`<router-outlet></router-outlet>`是 angular 路由的占位元素，表示要把对应的路由组件渲染到`router-outlet`中
使用`angular router`的项目，需使用`<a routerLink="/crisis-center">Crisis Center</a>`的形式，才能在 `angular` 内部跳转

html

```html
<h1>Angular Router</h1>
<nav>
  <a routerLink="/crisis-center" routerLinkActive="active" ariaCurrentWhenActive="page">Crisis Center</a>
  <a routerLink="/heroes" routerLinkActive="active" ariaCurrentWhenActive="page">Heroes</a>
</nav>
<router-outlet></router-outlet>
```

<!-- more -->

把 `RouterModule.forRoot()` 注册到 `AppModule` 的 `imports` 数组中，能让该 `Router` 服务在应用的任何地方都能使用。

module

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { HeroListComponent } from './hero-list/hero-list.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes', component: HeroListComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [AppComponent, HeroListComponent, CrisisListComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

> `forRoot`在一个 angular 项目中只能出现一次，如果想在其他模块中在引入子路由，应使用`forChild`

#### 配置路由跳转规则

添加一个 `redirect` 路由，把最初的相对 `URL（''）`转换成所需的默认路径`（/heroes）`。
`'**'`表示没有任何匹配时，跳转到对应的没有页面提示

```ts
const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes', component: HeroListComponent },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
```

### 路由模块

声明一个路由文件

`src/app/app-routing.module.ts`

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes', component: HeroListComponent },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

`src/app/app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  declarations: [AppComponent, HeroListComponent, CrisisListComponent, PageNotFoundComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 路由参数

```ts
{ path: 'hero/:id', component: HeroDetailComponent }
```

```html
<a [routerLink]="['/hero', hero.id]"></a>
```

如何在对应的组件中拿到 `id` 的参数

```ts
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private service: HeroService
) {}

ngOnInit() {
  this.hero$ = this.route.paramMap.pipe(
    switchMap((params: ParamMap) =>
      this.service.getHero(params.get('id')!))
  );
}
```

当这个 `map` 发生变化时，`paramMap` 会从更改后的参数中获取 `id` 参数。

当用户从一个详情列表跳转到另一个详情列表中时，angular 会复用这个组件，所以需要订阅 router 对象的变化，才能出发详情列表路由参数的变化

#### activateRouter

监听`ActivatedRoute`也能拿到路由的参数值

```ts
constructor(private activatedRoute: ActivatedRoute){}


this.activatedRoute.params.subscribe(params => {
  this.deviceId = params.deviceId;
});
```

#### sanpshot

本应用不需要复用 `HeroDetailComponent`。用户总是会先返回英雄列表，再选择另一位英雄。所以，不存在从一个英雄详情导航到另一个而不用经过英雄列表的情况。这意味着路由器每次都会创建一个全新的 `HeroDetailComponent` 实例。

假如你很确定这个 `HeroDetailComponent` 实例永远不会被复用，你可以使用 snapshot。

```ts
ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id')!;

  this.hero$ = this.service.getHero(id);
}
```

> 用这种技术，`snapshot` 只会得到这些参数的初始值。如果路由器可能复用该组件，那么就该用 `paramMap` 可观察对象的方式。本教程的示例应用中就用了 `paramMap` 可观察对象。

### 第二路由

使用 2 个`router-outlet`，但是彼此并不互相影响

```html
<div [@routeAnimation]="getAnimationData()">
  <router-outlet></router-outlet>
</div>
<router-outlet name="popup"></router-outlet>
```

注册第二路由
`module`

```ts
{
  path: 'compose',
  component: ComposeMessageComponent,
  outlet: 'popup'
},
```

如何跳转到第二路由

```html
<a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>
```

> 因为第二路由与主路由不相互影响，即使在主路由发生变化时，第二路由显示的组件也不会消失，所以适用于：需要一直显示的组件，比如弹窗，需要在不同的页面都显示

那么如何清除第二路由

```ts
closePopup() {
  // Providing a `null` value to the named outlet
  // clears the contents of the named outlet
  this.router.navigate([{ outlets: { popup: null }}]);
}
```

### 路由守卫

|     守卫接口     |                详情                |
| :--------------: | :--------------------------------: |
|   CanActivate    |         导航到某路由时介入         |
| CanActivateChild |       导航到某个子路由时介入       |
|  CanDeactivate   |        从当前路由离开时介入        |
|     Resolve      |    在某路由激活之前获取路由数据    |
|     CanLoad      | 导航到某个异步加载的特性模块时介入 |

| 守卫返回的值 |                    详情                    |
| :----------: | :----------------------------------------: |
|     true     |               导航过程会继续               |
|    false     |     导航过程就会终止，且用户留在原地。     |
|   UrlTree    | 取消当前导航，并开始导航到所返回的 UrlTree |

```ts
const crisisCenterRoutes: Routes = [
  {
    path: 'crisis-center',
    component: CrisisCenterComponent,
    children: [
      {
        path: '',
        component: CrisisListComponent,
        children: [
          {
            path: ':id',
            component: CrisisDetailComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              crisis: CrisisDetailResolverService,
            },
          },
          {
            path: '',
            component: CrisisCenterHomeComponent,
          },
        ],
      },
    ],
  },
];
```

### 路由懒加载

```ts
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
},
```

#### 预加载

这项配置会让 `Router` 预加载器立即加载所有惰性加载路由（带 `loadChildren` 属性的路由）。

```ts
RouterModule.forRoot(appRoutes, {
  enableTracing: true, // <-- debugging purposes only
  preloadingStrategy: PreloadAllModules,
});
```

### 参考

[angular router](https://angular.cn/guide/router-tutorial-toh#milestone-5-route-guards)
