---
layout: post
title: angular缓存页面、实现keepAlive效果
tags: [angular, javascript]
comments: true
date: 2023-02-24 14:24:00
---

场景：当在某个页面筛选了一些条件，然后需要跳到详情页面，此时返回原来的列表页，需要保持原来的筛选状态

### Angular RouteReuseStrategy 路由复用策略

```ts
abstract class RouteReuseStrategy {
  /* 是否允许复用路由 */
  abstract shouldDetach(route: ActivatedRouteSnapshot): boolean;
  /* 当路由离开时会触发，存储路由 */
  abstract store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void;
  /* 是否允许还原路由 */
  abstract shouldAttach(route: ActivatedRouteSnapshot): boolean;
  /* 获取存储路由 */
  abstract retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null;
  /* 进入路由触发，是否同一路由时复用路由 */
  abstract shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
}
```

<!-- more -->

<img src="/img/2023-02-24-angular-cache-page/1.png"  />

路由复用策略方法执行顺序分布讲解
假设我们从路由 A ——> 路由 B

1. shouldReuseRoute(future, curr) 决定是否复用路由?

根据切换的 future curr 的节点层级依次调用。

- 返回值为 true 时表示当前节点层级路由复用，然后继续下一路由节点调用，入参为切换的下一级路由（子级）的 future curr 路由的节点。
- 返回值为 false 时表示不在复用路由，并且不再继续调用此方法（future 路由不再复用，其子级路由也不会复用，所以不需要再询问下去）。

> root 路由节点调用一次，非 root 路由节点调用两次这个方法，第一次比较父级节点，第二次比较当前节点，

2. retrieve(route)

接上一步骤，当当前层级路由不需要复用的时候，调用一下这个方法，其子级路由也会调用一下 retrieve 方法。如果返回的是 null，那么当前路由对应的组件会实例化，这种行为一直持续到末级路由。

3. shouldDetach(route)
   对上一路由是否实现复用功能，如果返回 true，调用一下 store 方法存储路由组件，如果返回 false，那么先判断有没有层级路由，有的话继续执行 shouldDetach 方法，没有的话则跳过第四步骤，执行第五步骤

4. store(route, handle)
   接上一步骤，如果离开路由 A 的时候，shouldDetach 返回 true 了，那么离开路由 A 后，路由 A 引用的组件你就可以在这里存储起来，下一次回到路由 A 的时候，就可以拿到

5. shouldAttach(route)
   当前路由是不是允许还原回来？如果配置允许，返回 true，然后调用 retrieve 方法获取存储组件，反之返回 false，就此结束

6. retrieve(route)
   上一步返回 true 了，那么说明路由时允许还原的。我们在这一步骤里面，拿到我们之前为这个路由缓存的数据，返回即可。

7. store(route, handle)
   拿完后，再调用一次 store 方法，这里，就此，整个路由复用策略就结束了。

### 创建新路由策略实现 keepAlive

1. 创建`SimpleReuseStrategy`文件

```ts
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

export class SimpleReuseStrategy implements RouteReuseStrategy {
  static cacheRouters = new Map<string, DetachedRouteHandle>();

  /*
   ** 清除cachedroute:
   ** (this.routeReuseStrategy as AppRouteReuseStrategy).clearCachedRoute('/factory/factoryManage');
   */
  public clearCachedRoute(key: string) {
    const handle = this.cacheRouters.get(key);

    if (handle) {
      (handle as any).componentRef.destroy();
    }

    this.cacheRouters.delete(key);
  }

  public clearCacheOnNewUrl(url: string) {
    this.cacheRouters.forEach((val, key) => {
      if (url.indexOf(key) === -1) {
        this.clearCachedRoute(key);
      }
    });
  }

  // one 进入路由触发，是否同一路由时复用路由
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  // 获取存储路由
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteURL(route);
    if (route.data.keep && SimpleReuseStrategy.cacheRouters.has(url)) {
      return SimpleReuseStrategy.cacheRouters.get(url);
    } else {
      return null;
    }
  }

  // 是否允许复用路由
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return Boolean(route.data.keep);
  }
  // 当路由离开时会触发，存储路由
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteURL(route);
    SimpleReuseStrategy.cacheRouters.set(url, handle);
  }
  //  是否允许还原路由
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteURL(route);
    return Boolean(route.data.keep) && SimpleReuseStrategy.cacheRouters.has(url);
  }

  // 获取当前路由url
  private getFullRouteURL(route: ActivatedRouteSnapshot): string {
    const { pathFromRoot } = route;
    let fullRouteUrlPath: string[] = [];
    pathFromRoot.forEach((item: ActivatedRouteSnapshot) => {
      fullRouteUrlPath = fullRouteUrlPath.concat(this.getRouteUrlPath(item));
    });
    return `/${fullRouteUrlPath.join("/")}`;
  }
  private getRouteUrlPath(route: ActivatedRouteSnapshot) {
    return route.url.map((urlSegment) => urlSegment.path);
  }
}
```

2. 在 providers 里注入

```ts
providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
],
```

3. 在路由上新增 keepAlive 属性

```ts
{ path: 'cuttingTag', component: CuttingTagComponent, data: { keepAlive: true } }
```

### 参考

[彻底弄懂 Angular RouteReuseStrategy 路由复用策略](https://blog.csdn.net/weixin_42227767/article/details/110475399)
[github 源码参考](https://github.com/luckydingxia/RouteReuseStrategy-demo)
