---
layout: post
title: angular依赖注入
tags: [javascript, angular]
comments: true
date: 2023-03-14 15:14:06
---

> 掘金上看到一篇讲 angular 依赖注入 的文章，非常的细致，记录一下

依赖注入是前端开发者也是 Angular 开发者一道很难迈过去的坎，依赖注入到底是啥？为什么要依赖注入？Angular 的依赖注入怎么有那么多概念，看了官方文档一遍后感觉是懂了，但是过一段时间发现又不懂了，这是前端开发者普遍遇到的问题，我司的前端也一样，那么这篇文章尝试用更容易理解的语言全面解析一下 Angular 的依赖注入，内容有点多，可以先收藏观看。

> Angular 官方文档关于依赖注入介绍的其实挺详细的，但是组织的语言过于官方，不易理解，其次就是文档太过分散，没有把依赖注入聚合在一起，有些核心的概念可能在示例中出现了解读，你很难在一个地方找到所有依赖注入的讲解。
> 在开始之前，我简单列了一些关于 Angular 依赖注入的问题，如果你每个问题都非常了解可以划过这篇文章了。

<!-- more -->

1.  依赖注入和控制反转(Ioc)的区别是什么？
2.  `providedIn: 'root'` ​ 的作用是什么，指定 root 的好处有哪些？
3.  `providedIn` ​ 除了 root 外还可以设置哪些值？
4.  构造函数注入 `constructor(heroService: HeroService)` ​ 是依赖注入的简写，那么完整的写法是什么？
5.  依赖注入可以注入一个接口吗？ `constructor(heroService: IHeroService)` ​ 为什么？
6.  `useClass` ​ 和 `useExisting` ​ 提供者的区别是什么？
7.  `providers: [ Logger ]` ​ 这种写法 `Logger` ​ 使用的是什么类型的供应商？
8.  DI Token 可以是字符串吗？如果可以如何注入？
9.  `providers` ​ 与 `viewProviders` ​ 的区别是什么？
10. `Injectable` 、 `Inject` ​ 、 `Injector` ​ 和 `Provider` ​ 这些名词到底是什么？
11. `ReflectiveInjector` ​ 和 `StaticInjector` ​ 的区别是什么？为什么 Angular 在 V5 版本废弃了 `ReflectiveInjector` ​API？
12. 懒加载模块中的供应商和 `AppModule` ​ 中提供的供应商有什么区别？

简单一张思维导图完整覆盖这篇文章的内容：
![image.png](https://atlas-rc.pingcode.com/files/public/6165204b9b49db14d9b218b2/origin-url)

## 前言

### 控制反转和依赖注入

那么在开始正题之前，肯定要先理解依赖注入的概念，如果已经理解的同学可以忽略这一章节，一提起依赖注入，大家就会和控制反转联系在一起，我在看过很多文章之后发现知乎上的一个回答 [Spring IoC 有什么好处呢？](https://link.juejin.cn/?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F23277575 "https://www.zhihu.com/question/23277575") 介绍的特别详细和易懂，大家不了解的可以阅读一下，简单总结一下就是：

> 软件只有到达了一定的复杂度才会需要各种设计原则和模式，那么依赖倒置原则（Dependency Inversion Principle ）就是为了解决软件模块之间的耦合性提出的一种思想，让大型软件变的可维护，高层模块不应该依赖低层模块，两者都应该依赖其抽象，抽象不应该依赖细节，细节应该依赖抽象。那么控制反转（Inversion of Control） 就是依赖倒置原则的一种代码设计思路，具体采用的方法就是所谓的依赖注入（Dependency Injection），通过依赖注入实现控制权的反转，除了依赖注入外，还有可以通过模板方法模式实现控制反转，那么所谓依赖注入，就是把底层类作为参数传入上层类，实现上层类对下层类的“控制”。
> ![image.png](https://atlas-rc.pingcode.com/files/public/61133376f6d53d77d25c5b02/origin-url)

以下是一个通过构造函数注入的示例，那么除了构造函数注入外，还会有 setter 注入和接口注入。

```ts
class Logger {
  log(message: string) {}
}
class HeroesService {
  constructor(logger: Logger) {}
}

const logger = new Logger();
const heroesService = new HeroesService(logger);
```

通过上述示例发现， `HeroesService` ​ 不直接创建 `Logger` ​ 类的实例，统一在外层创建后通过构造函数好传入 `HeroesService` ​ 如果我们的类成千上万，那么实例化类的工作变得相当繁琐，会有一大推样板代码，为了管理创建依赖工作，一般会使用 **控制反转容器(IoC Container) ** 进行管理。只需要通过如下一行代码即可实现 `HeroesService` ​ 的创建， `IocContainer` ​ 会通过 `HeroesService` ​ 的构造函数寻找 `Logger` ​ 的依赖并实例化。

```ts
const heroesService = IocContainer.get(HeroesService);
```

如果类很多，依赖层级比较深，那么 IocContainer 会帮我们统一管理依赖， `IocContainer` ​ 其实也叫注入器 `Injector` ​, 说的其实就是一回事，Angular 框架中叫 `Injector` ​。
![image.png](https://atlas-rc.pingcode.com/files/public/611379a0f6d53d640b5c5b2c/origin-url)
关于控制反转和依赖注入更多参考：
[Inversion of Control vs Dependency Injection](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F6550700%2Finversion-of-control-vs-dependency-injection "https://stackoverflow.com/questions/6550700/inversion-of-control-vs-dependency-injection")  
[Wikipedia Dependency Injection](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDependency_injection "https://en.wikipedia.org/wiki/Dependency_injection")

**依赖注入的优势：**

- 更容易维护
- 协同合作
- 方便单元测试
- 松耦合
- 减少了样板代（Ioc 容器/注入器维护管理依赖）
- 扩展应用程序变得更加容易

**依赖注入的缺点：**

- 学习起来有点复杂
- 阅读代码变得抽象
- 依赖注入框架是通过反射或动态编程实现，导致 IDE 对“查找引用”，“显示调用层次结构”和安全重构变得困难
- 编译时错误被推送到运行时

### 为什么 Angular 有依赖注入

**那么 Angular 为什么会有依赖注入？**
前面我已经说过，只有程序到达一定的复杂度，才会需要各种设计模式和原则等工程化方法提升程序的可维护性，那么 Angular.js 起初是为了解决谷歌内部复杂中大型的前端应用，同时是一批 Java 程序打造的，所以首次在前端中大胆引入了依赖注入，那么 Angular 是基于 Angular.js 打造的新一代前端框架，所以延续了依赖注入特性，并改善了层级注入器，同时采用了更优雅的装饰器 API 形式。

**服务和依赖注入的关系**
另外 Angular 为了解决数据共享和逻辑复用问题，引入了服务的概念，服务简单理解就是一个带有特性功能的类，Angular 提倡把与视图无关的逻辑抽取到服务中，这样可以让组件类更加精简、高效，组件的工作只管用户体验，把业务逻辑相关功能（比如：从服务器获取数据，验证用户输入或直接往控制台中写日志等）委托给各种服务，最后通过 Angular 的依赖注入，这些带有特定功能的服务类可以被任何组件注入并使用。
**Angular 依赖注入：** 连接服务的桥梁，在需要的地方（组件/指令/其他服务）通过构造函数注入依赖的服务，依赖注入 + 服务的组合造就了使用 Angular 可以轻松组织复杂应用。

**那么其他框架 React 和 Vue 有依赖注入吗？**
可以说有，也可以说没有，React 为了解决全局数据的共享问题，提出了 Context，那么创建好 Context 后需要在上层组件通过 `<MyContext.Provider value={/* 某个值 */}>` ​ 提供依赖值，然后在任何的子组件中通过 `<MyContext.Consumer>` ​ 进行消费（Vue 中也有类似的 `provide` ​ 和 `inject` ​），其实这可以狭隘的理解成最简单的依赖注入，只不过 Context 只解决了数据共享的问题，虽然也可以作为逻辑复用，但是官方不推荐，React 官方先后推出 Mixin、高阶组件、Render Props 以及最新的 Hooks 用来解决逻辑复用问题。

```ts
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>

```

那么回到 Angular 框架来说，Angular 的服务 + 依赖注入完美解决了数据共享和逻辑复用问题，服务本质上和 React Hooks 没有太多的区别，只是 API 形态不一样，一个是通过函数形式一个是通过类+依赖注入，因为这两个框架的底层机制和思想不一样，导致了 API 表现形式的不同，但是最终都是在解决数据共享和逻辑复用的问题。

## 入门到高级

那么接下来我会从依赖注入的基本使用 => 依赖提供者 => 多级注入器三个方面详细讲解一下。

### 基本使用

在 Angular 中，通过 `@angular/cli` ​ 提供的命令 `ng generate service heroes/hero` (简写 `ng g s heroes/hero` ​ ) 可以快速的创建一个服务，创建后的服务代码如下：

```ts
// src/app/heroes/hero.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HeroService {
  constructor() {}
}
```

**HeroService** 通过 `@Injectable()` ​ 装饰器标记为可以被注入的服务， `providedIn: 'root'` ​ 表示当前服务在 Root 注入器中提供，简单理解就是这个服务在整个应用所有地方都可以注入，并全局唯一实例。
添加完服务后，我们就可以在任何组件中通过构造函数注入 **HeroService，** 通过 TS 的构造函数赋值属性的特性设置为公开，这样组件内和模板中都可以使用该服务端的函数和方法。

```ts
// src/app/heroes/hero-list.component
constructor(public heroService: HeroService)

```

简单的代码如下：

```ts
import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: "app-hero-list",
  template: "Heroes: {{heroes | json}}",
})
export class HeroListComponent implements OnInit {
  heroes!: Hero[];

  constructor(public heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes = this.heroService.getHeroes();
  }
}
```

除了在组件中注入服务外，在 Angular 中还可以在服务中注入其他服务，当某个服务依赖于另一个服务时，遵循与注入组件相同的模式，比如： `HeroService` ​ 要依靠 `Logger` ​ 服务来记录日志。

```ts
// src/app/heroes/hero.service.ts
import { Injectable } from "@angular/core";
import { HEROES } from "./mock-heroes";
import { Logger } from "../logger.service";

@Injectable({
  providedIn: "root",
})
export class HeroService {
  constructor(private logger: Logger) {}

  getHeroes() {
    this.logger.log("Getting heroes ...");
    return HEROES;
  }
}
```

以上就是在 Angular 中最简单的使用依赖注入的姿势，是不是觉得和 React 的 Hooks 一样，只是通过面向对象的 API 共享数据和业务逻辑，个人感觉更加的简单和易读。

### Angular 依赖注入简介

下面简单的介绍一下 Angular 依赖注入的几个基本的元素：

- **@Injectable()** 装饰器来提供元数据，表示一个服务可以被注入的（在之前的版本中不加也是可以被注入的，后来 5.0 版本改成静态注入器后必须要标识一下才可以被注入，否则会报错）
- **注入器（Injector）** 会创建依赖、维护一个容器来管理这些依赖，并尽可能复用它们，Angular 默认会创建各种注入器，甚至感觉不到他的存在，但是理解注入器的底层逻辑后再看依赖注入就更简单了
- **@Inject()** 装饰器表示要在组件或者服务中注入一个服务
- **提供者（Provider）** 是一个对象，用来告诉注入器应该如何获取或创建依赖值。

![image.png](https://atlas-rc.pingcode.com/files/public/611c81c0f6d53dbdbe5c5ccd/origin-url)
上面的示例中虽然没有出现 `@Inject()` ​ 装饰器，但是这是 Angular 提供的简写，注入一个服务的全写如下所示，我们通常定义服务都是使用类，所以省略 `@Inject(HeroService)` ​ 极大的简化了样板代码。

```ts
// src/app/heroes/hero-list.component
class HeroListComponent {
  constructor(@Inject(HeroService) private heroService: HeroService) {}
}
```

### 依赖提供者（Dependency providers）

Angular 官方文档对于依赖提供者，也就是 `providers` ​ 的解释如下：
![image.png](https://atlas-rc.pingcode.com/files/public/611e1ee1f6d53d81c95c5d3b/origin-url)
说实话我读了很多遍都无法理解具体含义，后来我简单总结为依赖提供者就做了两件事：

- **告诉注入器如何提供依赖值**
- **限制服务可使用的范围**

在上述的示例中，使用 `@Inject(HeroService)` ​ 注入一个服务时，Angular 注入器会通过 `new HeroService()` ​ 实例化一个类返回依赖值，实例化类其实就是 **如何提供依赖值，** 那么 Angular 中除了实例化类提供依赖值外还提供给了如下类型的 `Provider` ​，每种 `Provider` ​ 都有其使用场景。

```ts
export declare type Provider =
  | TypeProvider
  | ValueProvider
  | ClassProvider
  | ConstructorProvider
  | ExistingProvider
  | FactoryProvider
  | any[];

export declare type StaticProvider =
  | ValueProvider
  | ExistingProvider
  | StaticClassProvider
  | ConstructorProvider
  | FactoryProvider
  | any[];
```

关于 **限制服务可使用的范围** 就更好理解了 **，** 满足只能在某个模块或者组件中注入 `HeroService` ​ 的场景。

#### 如何定义提供者

在组件或者模块中通过装饰器元数据 `providers` 定义提供者。
比如: **类提供者**
![无标题-2021-08-18-1229.png](https://atlas-rc.pingcode.com/files/public/611cb8e2f6d53d263d5c5cd9/origin-url)

- **provide** 属性是依赖令牌，它作为一个 key，在定义依赖值和配置注入器时使用，可以是一个 **类的类型** 、 **InjectionToken** 、或者字符串，甚至对象，但是不能是一个 Interface、数字和布尔类型
- 第二个属性是一个提供者定义对象，它告诉注入器要如何创建依赖值。 提供者定义对象中的 key 可以是 `useClass` —— 就像这个例子中一样。 也可以是 `useExisting` ​ 、 `useValue` ​ 或 `useFactory` ​, 每一个 key 都用于提供一种不同类型的依赖。
- ![image.png](https://atlas-rc.pingcode.com/files/public/6110d42ef6d53d93d95c5a82/origin-url)

#### 类提供者（TypeProvider 和 ClassProvider）

类提供者应该是最常用的一种，文章开始中的示例就是，简写和全写的配置如下：

```ts
provides: [Logger]; // 简写
provides: [{ provide: Logger, useClass: Logger }]; // 全写
```

- provide: Logger 意思是把类的类型作为 **DI Token（依赖令牌）**
- `useClass` 表示使用此类实例化作为依赖值，其实就是通过 `new Logger()` ​ 返回依赖值

**使用场景：**

- 所有 class 定义的服务默认都是用 **类提供者**
- 指定替代性的类提供者，替换原有服务的行为实现可扩展性，这样我在使用的时候还是注入 `Logger` ​，但是实际返回的对象是 `BetterLogger` ​ 示例

```ts
[{ provide: Logger, useClass: BetterLogger }];
// 当使用 Logger 令牌请求 Logger 时，返回一个 BetterLogger
```

#### 别名类提供者（ExistingProvider）

在下面的例子中，当组件请求新的或旧的 Logger 时，注入器都会注入一个 `NewLogger` 的实例。 通过这种方式， `OldLogger` ​ 就成了 `NewLogger` ​ 的别名。

```ts
[
  NewLogger,
  // Alias OldLogger reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger },
];
```

那么别名类提供者和类提供者有什么区别呢？

```ts
[NewLogger, { provide: OldLogger, useClass: NewLogger }];
```

- `useExisting` 值是一个 **DI Token** ，provide 也是一个 **DI Token，** 2 个 Token 指向同一个实例
- `useClass` 值是一个可以实例化的类，也就是可以 new 出来的类，这个类可以是任何类

**使用场景：**

- 收窄类型 **MinimalLogger ，** Logger 类的返回的方法和属性太多，当前场景只需要使用少量的属性和函数，可以定义一个简化版的 **MinimalLogger，** 通过注入 `MinimalLogger` ​ 使用，运行时返回的其实还是 Logger 对象
- 重构，替换命名，一次性无法完全修改，先临时提供一个新的别名，将来逐步替换
- 解决循环引用问题，为类接口(抽象)指定别名

```ts
// Class used as a "narrowing" interface that exposes a minimal logger
// Other members of the actual implementation are invisible
export abstract class MinimalLogger {
  abstract logs: string[];
  abstract logInfo: (msg: string) => void;
}

{ provide: MinimalLogger, useExisting: LoggerService },

```

```ts
// parent.ts
class abstract Parent {
     ...
}

// alex.component.ts
providers: [{ provide: Parent, useExisting: forwardRef(() => AlexComponent) }]
class AlexComponent {
   // ChildComponent
}

// child.component.ts
class ChildComponent {
    constructor(parent: Parent)
}


```

#### 对象提供者（ValueProvider）

要注入一个对象，可以用 `useValue` ​ 选项来配置注入器，下面的提供者定义对象使用 `useValue` ​ 作为 key 来把该变量与 `Logger` ​ 令牌关联起来。

```ts
// An object in the shape of the logger service
function silentLoggerFn() {}

export const silentLogger = {
  logs: ['Silent logger says "Shhhhh!". Provided via "useValue"'],
  log: silentLoggerFn,
};

[{ provide: Logger, useValue: silentLogger }];
```

**使用场景：**
通过对象提供者注入一个配置对象，一般推荐使用 `InjectionToken` ​ 作为令牌 ​

```ts
// src/app/app.config.ts
import { InjectionToken } from "@angular/core";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export const HERO_DI_CONFIG: AppConfig = {
  apiEndpoint: "api.heroes.com",
  title: "Dependency Injection",
};
```

```ts
// src/app/app.module.ts (providers)
providers: [
  { provide: APP_CONFIG, useValue: HERO_DI_CONFIG }
],

```

当使用 `InjectionToken` ​ 作为令牌时，在组件或者服务中必须借助参数装饰器 `@Inject()` ​ ，才可以把这个配置对象注入到构造函数中。

```ts
// src/app/app.component.ts
constructor(@Inject(APP_CONFIG) config: AppConfig) {
  this.title = config.title;
}

```

> Inject, 类构造函数中依赖项参数上的参数装饰器，用于指定依赖项的自定义提供者，参数传入 DI Token，映射到要注入的依赖项。
> 同时在定义 `InjectionToken` ​ 的时候还可以设置 `providedIn` ​ 和 `factory` ​

```ts
export const TOKEN_FACTORY = new InjectionToken("factory-token", {
  providedIn: "root",
  factory: () => {
    return "I am from InjectionToken factory";
  },
});
```

#### 工厂提供者（FactoryProvider）

要想根据运行前尚不可用的信息创建可变的依赖值，可以使用工厂提供者。也就是完全自己决定如何创建依赖。
比如：只有授权用户才能看到 `HeroService` ​ 中的秘密英雄。

```ts
// src/app/heroes/hero.service.ts (excerpt)
constructor(
  private logger: Logger,
  private isAuthorized: boolean) { }

getHeroes() {
  const auth = this.isAuthorized ? 'authorized ' : 'unauthorized';
  this.logger.log(`Getting heroes for ${auth} user.`);
  return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
}

```

```ts
// src/app/heroes/hero.service.provider.ts (excerpt)

const heroServiceFactory = (logger: Logger, userService: UserService) => {
  return new HeroService(logger, userService.user.isAuthorized);
};

export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService],
};
```

- `useFactory` ​ 字段指定该提供者是一个工厂函数，其实现代码是 `heroServiceFactory` ​
- `deps` ​ 属性是一个提供者令牌数组， `Logger` 和 `UserService` 类都是类提供者的令牌。该注入器解析了这些令牌，并把相应的服务注入到 `heroServiceFactory` ​ 工厂函数的参数中

理解了工厂提供给者后再回过头看， `useValue` ​ 、 `useClass` ​ 和 `useExisting` ​ 的区别就更简单了， `provider` ​ 就是在装饰器中通过 `providers` ​ 数组配置的元数据对象。
![image.png](https://atlas-rc.pingcode.com/files/public/611e08fdf6d53de7045c5d33/origin-url)

#### 接口和依赖注入

虽然 TypeScript 的 `AppConfig` 接口可以在类中提供类型支持，但它在依赖注入时却没有任何作用。在 TypeScript 中，接口只能作为类型检查，它没有可供 DI 框架使用的运行时表示形式或令牌。

- 当转译器把 TypeScript 转换成 JavaScript 时，接口就会消失，因为 JavaScript 没有接口。
- 由于 Angular 在运行期没有接口，所以该接口不能作为令牌，也不能注入它。

```ts
// Can't use interface as provider token
[{ provide: AppConfig, useValue: HERO_DI_CONFIG })]

// Can't inject using the interface as the parameter type
constructor(private config: AppConfig){ }

```

#### multi 多个依赖值

当配置提供者时设置 multi 为 true 时，通过 `@Inject(DIToken)` ​ 参数注入获取的依赖值就会返回一个数组。

```ts
export declare interface ClassProvider extends ClassSansProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;
  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}
```

**使用场景：**
内置 API ，比如： `NG_VALUE_ACCESSOR` ​、 `HTTP_INTERCEPTORS` ​、 `APP_INITIALIZER` ​ 等

```ts
@Component({
  selector: "select",
  templateUrl: "./select.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThySelectComponent),
      multi: true,
    },
  ],
})
export class ThySelectComponent implements ControlValueAccessor {}
```

以上就是依赖注入者 provider 相关的介绍，理解了 factory 提供依赖值后再看其他类型就会简单很多，其他的类型就是 factory 之上高级的 API 而已，满足不同的场景需要，这是 Angular 依赖注入入门比较难懂的知识，那么接下来的多级注入器是另一个重要的知识点，这两部分都深入理解那么 Angular 依赖注入就不在是难点了。

## 参考

[Angular 依赖注入 - 全面解析](https://juejin.cn/post/7019184783242559496#heading-8)
