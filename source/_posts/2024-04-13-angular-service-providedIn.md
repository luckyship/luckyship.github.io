---
layout: post
title: 一文彻底搞懂providedIn的所有选项，除了root还能选择啥
tags: [angular, javascript]
categories: review
comments: true
date: 2024-04-13 19:32:09
---

当我们在创建 angular 的服务时，`providedIn`的选项默认都是`root`，有的小伙伴就会问了，这个`providedIn`是做什么的，除了 root 还能填其他值嘛 🤔。

查阅`angular(v15)`文档，发现`providedIn`总共有 5 种值

- `root`：在大多数应用程序中是指应用程序级注入器。
- `any`：在每个惰性加载的模块中提供一个唯一实例，而所有热切加载的模块共享一个实例。
- `null`：等效于  `undefined` 。可注入物不会在任何范围内自动提供，必须添加到`@NgModule` 、 `@Component`或`@Directive`的  `providers`  数组中。
- `platform`：由页面上所有应用程序共享的特殊单例平台注入器。
- `Type<any>` - 将可注入物与  `@NgModule`  或其他  `InjectorType`  相关联。此选项已弃用。

> angular 官网的文档一如既往的不给力 😳，只有选项，并没有示例说明，下面我们通过几个具体的例子，来看看这几个选项具体的表现 😎

<!-- more -->

## root

`providedIn` 最常见的就是 `root`，因为服务创建时，默认值都是 `root`，

`root` 就是在项目根目录创建一个实例，所有注入这个服务的组件，都会共享这个实例。
利用这个特性，我们经常使用它去做组件间的传值，或者做全局的传值。

我们按照下面步骤，创建一个示例

1. 创建 2 个 `module`， 分别命名为 `root-first`、`root-second`，并且使用路由懒加载
2. 创建`rootService`, `providedIn`为 `root`, 创建变量`count`
3. 给 2 个 `moudlue` 中的 `component` 都引入`rootService`, 显示变量`count`，并且添加`+`按钮使`count + 1`

```ts
import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RootService {
  count = 0;
  constructor() {}
}

// 第一个module
@Component({
  selector: "root-first",
  template: `
    <div>
      root-first: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-second'"> second </a>
    </div>
  `,
  styles: [""],
})
export class RootFirstComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootFirstComponent,
      },
    ]),
  ],
  declarations: [RootFirstComponent],
})
export class RootFirstModule {}

// 第二个module
@Component({
  selector: "root-second",
  template: `
    <div>
      root-second: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-first'"> first </a>
    </div>
  `,
  styles: [""],
})
export class RootSecondComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootSecondComponent,
      },
    ]),
  ],
  declarations: [RootSecondComponent],
})
export class RootSecondModule {}

// app component, app module
@Component({
  selector: "app-root",
  template: ` <router-outlet></router-outlet> `,
  styles: [``],
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot([
      {
        path: "root-first",
        loadChildren: () => import("./app.module").then((val) => val.RootFirstModule),
      },
      {
        path: "root-second",
        loadChildren: () => import("./app.module").then((val) => val.RootSecondModule),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

![root-service.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f734d3d8e5842578819143bd623e742~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=502&h=203&s=132715&e=gif&f=114)

如图，我们可以看到，在 `root-first` 中改变变量的值，在 `root-second` 中一样会起效，同样在` root-second` 中改值，`root-first` 也会生效。

## any

每个懒加载的模块中会分别共享一个实例，而所有非懒加载的模块共享一个实例

什么意思呢，同样是上面的代码，我们把 `service` 中的`providedIn`改为`any`，这个时候，在 `root-first` 中改变值，`root-second` 中的值就不会变化了

```ts
@Injectable({
  providedIn: "any",
})
export class RootService {
  count = 0;
  constructor() {}
}
```

![any-service.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68d1830057aa4078a495d6c175def14f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=502&h=203&s=84523&e=gif&f=75&b=ffffff)

这个时候如果我们把 `root-first` 改为急性加载，并在 `app.component` 中也注入 `root.service`

```ts
import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "any",
})
export class RootService {
  count = 0;
  constructor() {}
}

// 第一个module
@Component({
  selector: "root-first",
  template: `
    <div>
      root-first: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-second'"> second </a>
    </div>
  `,
  styles: [""],
})
export class RootFirstComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "root-first",
        component: RootFirstComponent,
      },
    ]),
  ],
  declarations: [RootFirstComponent],
})
export class RootFirstModule {}

// 第二个module
@Component({
  selector: "root-second",
  template: `
    <div>
      root-second: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-first'"> first </a>
    </div>
  `,
  styles: [""],
})
export class RootSecondComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootSecondComponent,
      },
    ]),
  ],
  declarations: [RootSecondComponent],
})
export class RootSecondModule {}

// app component, app module
@Component({
  selector: "app-root",
  template: `
    app header: {{ service.count }}
    <button (click)="service.count = service.count + 1">+</button>
    <router-outlet></router-outlet>
  `,
  styles: [``],
})
export class AppComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RootFirstModule,
    RouterModule.forRoot([
      // {
      //   path: 'root-first',
      //   loadChildren: () =>
      //     import('./app.module').then((val) => val.RootFirstModule),
      // },
      {
        path: "root-second",
        loadChildren: () => import("./app.module").then((val) => val.RootSecondModule),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

这个时候我们发现，在 `app.component` 和 `root-first` 中 `count` 是共享的 🤓，但是 `root-second` 中的 `count` 是不与他们共享的, 这是因为 `root-second` 是懒加载的，而其他的则是急性加载所以他们会共享数据

![any-service2.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4bc2e1d8c2a4e0dac53914b859fb9b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=502&h=203&s=119196&e=gif&f=114&b=ffffff)

## null

如果我们把`providedIn`设为 `null` 或者不填，那么此时，就需要在 `module` 中的 `providers` 注入这个服务，否则就会报错 😲

```ts
@Injectable({
  providedIn: null,
})
export class RootService {
  count = 0;
  constructor() {}
}
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56981aea50bf429e9ceecb13190b2f6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=561&h=85&s=6057&e=png&b=fcecec)

此时我们在所有用到 `root.service` 服务的 `module` 中全部注入 `service`, 它的表现形式和 `any` 一样，即在每个懒加载的模块中会分别共享一个实例，而所有非懒加载的模块共享一个实例

```ts
import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: null,
})
export class RootService {
  count = 0;
  constructor() {}
}

// 第一个module
@Component({
  selector: "root-first",
  template: `
    <div>
      root-first: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-second'"> second </a>
    </div>
  `,
  styles: [""],
})
export class RootFirstComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "root-first",
        component: RootFirstComponent,
      },
    ]),
  ],
  declarations: [RootFirstComponent],
  // 注入服务
  providers: [RootService],
})
export class RootFirstModule {}

// 第一个module
@Component({
  selector: "",
  template: `
    <div>
      root-second: {{ service.count }}
      <button (click)="service.count = service.count + 1">+</button>

      <a [routerLink]="'/root-first'"> first </a>
    </div>
  `,
  styles: [""],
})
export class RootSecondComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootSecondComponent,
      },
    ]),
  ],
  declarations: [RootSecondComponent],
  // 注入服务
  providers: [RootService],
})
export class RootSecondModule {}

// app component, app module
@Component({
  selector: "app-root",
  template: `
    app header: {{ service.count }}
    <button (click)="service.count = service.count + 1">+</button>
    <router-outlet></router-outlet>
  `,
  styles: [``],
})
export class AppComponent {
  constructor(public service: RootService) {}
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RootFirstModule,
    // RootSecondModule,
    RouterModule.forRoot([
      {
        path: "root-first",
        loadChildren: () => import("./app.module").then((val) => val.RootFirstModule),
      },
      {
        path: "root-second",
        loadChildren: () => import("./app.module").then((val) => val.RootSecondModule),
      },
    ]),
  ],
  // 注入服务
  providers: [RootService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## platform

页面上所有应用程序共享的平台注入器的特殊单例。

创建 `appMoudle2`

```ts
// 第二个根模块
@Component({
  selector: "app-root2",
  template: `
    app-root2 header: {{ service.count }}
    <button (click)="service.count = service.count + 1">+</button>
  `,
  styles: [``],
})
export class AppComponent2 {
  constructor(public service: RootService) {}
}
@NgModule({
  declarations: [AppComponent2],
  imports: [BrowserModule, RouterModule],
  bootstrap: [AppComponent2],
})
export class AppModule2 {}
```

同时在`main.ts`中引入

```ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule, AppModule2 } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

platformBrowserDynamic()
  .bootstrapModule(AppModule2)
  .catch((err) => console.error(err));
```

在`index.html`中引入`app-root2`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AngularService</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
    <hr />
    <app-root2></app-root2>
  </body>
</html>
```

然后我们把 `root.service` 的`providedIn`设为`platform`

```ts
@Injectable({
  providedIn: "platform",
})
export class RootService {
  count = 0;
  constructor() {}
}
```

这时，我们发现虽然是 2 个根模块，但是数据还是共享了（没有实时刷新的原因，是因为分属不同根模块，没有触发脏检查）

![platform-service.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57292f3e5aed4286b538be27586c7365~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=502&h=203&s=62451&e=gif&f=57&b=ffffff)

## ngModule

在这里我们新创建一个 `ngModule`，命名为`RootChildModule`, 服务的`providedIn`我们设置`RootChildModule`,并且在`app.module`中引入`RootChildModule`

```ts
@NgModule()
export class RootChildModule {}

@Injectable({
  providedIn: RootChildModule,
})
export class RootService {
  count = 0;
  constructor() {
    console.log("--lucky---");
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RootChildModule,
    RouterModule.forRoot([
      {
        path: "root-first",
        loadChildren: () => import("./app.module").then((val) => val.RootFirstModule),
      },
      {
        path: "root-second",
        loadChildren: () => import("./app.module").then((val) => val.RootSecondModule),
      },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

此时的效果与`root`相同，不同之处在于，只有在 `component` 中引入 `root.service`，该服务的代码才会被打包进去，否则代码将会被摇树优化。

为了验证此功能，我们把 `root.service` 移出，新建`/child/root.service` 文件

```ts
import { Injectable } from "@angular/core";
import { RootChildModule } from "./root-child.module";

@Injectable({
  providedIn: RootChildModule,
})
export class RootService {
  count = 0;
  constructor() {
    console.log("--lucky---");
  }
}
```

同时新建`/child/root-child.module` 来给 `providedIn` 提供值

```ts
import { NgModule } from "@angular/core";

@NgModule()
export class RootChildModule {}
```

然后修改一下`app.module`的代码

```ts
import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { RootChildModule } from "./child/root-child.module";

// 第一个模块
@Component({
  selector: "root-first",
  template: ` <div>root-first</div> `,
  styles: [""],
})
export class RootFirstComponent {
  constructor() {}
}
@NgModule({
  imports: [
    RouterModule,
    RootChildModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootFirstComponent,
      },
    ]),
  ],
  declarations: [RootFirstComponent],
})
export class RootFirstModule {}

// app component, app module
@Component({
  selector: "app-root",
  template: `
    app header
    <router-outlet></router-outlet>
  `,
  styles: [``],
})
export class AppComponent {
  constructor() {}
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot([
      {
        path: "root-first",
        loadChildren: () => import("./app.module").then((val) => val.RootFirstModule),
      },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

注意，此时，我们没有在任何地方注入`root.service`, 此时我们在浏览器 `network` 中搜索 `root.service` 中的代码

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd0af3fe2984d63915a971403207eee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1911&h=585&s=86489&e=png&b=ffffff)

结果可知，代码没有打包进去

此时，我们在`RootFirstComponent`中注入`root.service`

```ts
import { RootService } from "./child/root.service";

// 第一个模块
@Component({
  selector: "root-first",
  template: ` <div>root-first</div> `,
  styles: [""],
})
export class RootFirstComponent {
  constructor(public rootService: RootService) {}
}
```

此时，再去 `network` 中搜索，发现已有代码

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e4e4fb1bdeb4b90b82df82b92829e73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1789&h=554&s=75174&e=png&b=ffffff)

我们再删除`RootFirstComponent`中已注入的`root.service`，并且把`providedIn`的值改为`null`，并且在`RootFirstModule`里面申明`RootService`

```ts
import { Injectable } from "@angular/core";
import { RootChildModule } from "./root-child.module";

@Injectable({
  providedIn: null,
})
export class RootService {
  count = 0;
  constructor() {
    console.log("--lucky---");
  }
}
```

```ts
import { RootService } from "./child/root.service";

// 第一个模块
@Component({
  selector: "root-first",
  template: ` <div>root-first</div> `,
  styles: [""],
})
export class RootFirstComponent {
  constructor() {}
}

@NgModule({
  imports: [
    RouterModule,
    RootChildModule,
    RouterModule.forChild([
      {
        path: "",
        component: RootFirstComponent,
      },
    ]),
  ],
  providers: [RootService],
  declarations: [RootFirstComponent],
})
export class RootFirstModule {}
```

此时搜索 `network`, 虽然已经删除了注入部分的代码，但是 `root.service` 中的代码依然能搜索到

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/527284c0d6f648cd85e0ae62a9ee34c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1732&h=570&s=67923&e=png&b=ffffff)

这里，我们不用`providedIn：root`举例的原因是，服务的 providedIn 为 root 时，不用声明，也能使用，所以自然代码也会被摇树优化掉，我想这也是 `ngModule`这个选项被弃用的原因。

## 总结

实际中，我们使用比较多的只有`root`和`null`，

- `root`同时具备摇树优化的能力，但是他会在全局共享数据，并且没有限制，任意地方都可以使用
- `null`可以根据情况，在需要的时候使用`providers`注入使用，并且会区分懒加载和急性加载

`platform`虽然有实际的应用场景，但是使用比较少，而`any`和`ngModule`都可以被`any`和`root`取代

## 源码

[angular-injectable-providedIn](https://github.com/luckyship/angular-injectable-providedIn)
