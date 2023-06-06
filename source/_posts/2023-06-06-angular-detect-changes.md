---
layout: post
title: angular中的变化检测-zone
tags: [angular, javascript]
comments: true
date: 2023-06-06 15:58:39
---

Zone 是跨异步任务而持久存在的执行上下文。你可以将其视为 JavaScript VM 中的线程本地存储。本指南介绍了如何使用 Angular 的 的 NgZone 自动检测组件中的更改以更新 HTML。

<!-- more -->

# 变更检测的基础

要理解 `NgZone` 的好处，重要的是要清楚地了解什么是变更检测以及它的工作原理。

## 在 Angular 中显示和更新数据

在 Angular 中，你可以通过把 HTML 模板中的控件绑定到 Angular 组件的属性来显示数据。

```ts
// src/app/app.component.ts

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <h1>{{ title }}</h1>
    <h2>My favorite hero is: {{ myHero }}</h2>
  `,
})
export class AppComponent {
  title = "Tour of Heroes";
  myHero = "Windstorm";
}
```

另外，你也可以将 DOM 事件绑定到 Angular 组件中的方法。在此类方法中，你还可以更新 Angular 组件的属性，该属性将更新模板中显示的相应数据。

```ts
// src/app/click-me.component.ts

@Component({
  selector: "app-click-me",
  template: ` <button type="button" (click)="onClickMe()">Click me!</button>
    {{ clickMessage }}`,
})
export class ClickMeComponent {
  clickMessage = "";

  onClickMe() {
    this.clickMessage = "You are my hero!";
  }
}
```

在以上两个示例中，组件的代码仅更新组件的属性。但是，HTML 也会自动更新。本指南介绍了 Angular 如何以及何时根据 Angular 组件中的数据渲染 HTML。

## 使用普通（Plain）JavaScript 检测更改

为了阐明如何检测到更改和更新值，请考虑以下用普通 JavaScript 编写的代码。

```html
<html>
  <div id="dataDiv"></div>
  <button id="btn">updateData</button>
  <canvas id="canvas"></canvas>
  <script>
    let value = "initialValue";
    // initial rendering
    detectChange();

    function renderHTML() {
      document.getElementById("dataDiv").innerText = value;
    }

    function detectChange() {
      const currentValue = document.getElementById("dataDiv").innerText;
      if (currentValue !== value) {
        renderHTML();
      }
    }

    // Example 1: update data inside button click event handler
    document.getElementById("btn").addEventListener("click", () => {
      // update value
      value = "button update value";
      // call detectChange manually
      detectChange();
    });

    // Example 2: HTTP Request
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      // get response from server
      value = this.responseText;
      // call detectChange manually
      detectChange();
    });
    xhr.open("GET", serverUrl);
    xhr.send();

    // Example 3: setTimeout
    setTimeout(() => {
      // update value inside setTimeout callback
      value = "timeout update value";
      // call detectChange manually
      detectChange();
    }, 100);

    // Example 4: Promise.then
    Promise.resolve("promise resolved a value").then((v) => {
      // update value inside Promise thenCallback
      value = v;
      // call detectChange manually
      detectChange();
    }, 100);

    // Example 5: some other asynchronous APIs
    document.getElementById("canvas").toBlob((blob) => {
      // update value when blob data is created from the canvas
      value = `value updated by canvas, size is ${blob.size}`;
      // call detectChange manually
      detectChange();
    });
  </script>
</html>
```

更新数据后，需要调用 `detectChange()` 来检查数据是否已更改。如果数据已更改，则渲染 HTML 以反映更新的数据。

在 Angular 中，此步骤是不必要的。每当你更新数据时，你的 HTML 都会自动更新。

## 应用何时更新 HTML

要了解变更检测的工作原理，请首先考虑应用程序何时需要更新 HTML。通常，会由于以下原因之一而发生更新：

1.  组件初始化。比如，当引导 Angular 应用程序时，Angular 会加载引导组件并触发 [ApplicationRef.tick()](https://angular.cn/api/core/ApplicationRef#tick) 来调用变更检测和视图渲染。

2.  事件监听器。DOM 事件侦听器可以更新 Angular 组件中的数据，还可以触发变更检测，如下例所示。

```ts
// src/app/click-me.component.ts
@Component({
  selector: "app-click-me",
  template: ` <button type="button" (click)="onClickMe()">Click me!</button>
    {{ clickMessage }}`,
})
export class ClickMeComponent {
  clickMessage = "";

  onClickMe() {
    this.clickMessage = "You are my hero!";
  }
}
```

3. HTTP 数据请求。你还可以通过 HTTP 请求从服务器获取数据。比如：

```ts
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';
  serverUrl = 'SERVER_URL';
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get(this.serverUrl).subscribe(response => {
      // user does not need to trigger change detection manually
      this.data = response.data;
    });
  }
}
```

4. 宏任务，比如 `setTimeout()` 或 `setInterval()`。你还可以在诸如 `setTimeout()` `macroTask` 的回调函数中更新数据。比如：

```ts
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    setTimeout(() => {
      // user does not need to trigger change detection manually
      this.data = 'value updated';
    });
  }
}
```

5. 微任务，比如 `Promise.then()`。其他异步 API（比如 `fetch`）会返回 Promise 对象，因此 `then()` 回调函数也可以更新数据。比如：

```ts
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    Promise.resolve(1).then(v => {
      // user does not need to trigger change detection manually
      this.data = v;
    });
  }
}
```

6. 其他异步操作。除了 `addEventListener()`，`setTimeout()` 和 `Promise.then()`，还有其他一些操作可以异步更新数据。比如 `WebSocket.onmessage()` 和 `Canvas.toBlob()`。

前面的列表包含应用程序可能会在其中更改数据的最常见场景。只要 Angular 检测到数据可能已更改，就会运行变更检测。变更检测的结果是 DOM 被这些新数据更新。Angular 会以不同的方式检测变化。对于组件初始化，Angular 调用显式变更检测。对于[异步操作](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous)，Angular 会使用 Zone 在数据可能被修改的地方检测变化，并自动运行变更检测。

# Zone 和执行上下文

Zone 提供了在异步任务之间持久存在的执行上下文。[执行上下文](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/this)是一个抽象概念，用于在当前执行的代码中保存有关环境的信息。考虑以下示例：

```ts
const callback = function () {
  console.log("setTimeout callback context is", this);
};

const ctx1 = { name: "ctx1" };
const ctx2 = { name: "ctx2" };

const func = function () {
  console.log("caller context is", this);
  setTimeout(callback);
};

func.apply(ctx1);
func.apply(ctx2);
```

`setTimeout()` 回调中的 `this` 值可能会有所不同，具体取决于 `setTimeout()` 的调用时机。因此，你可能会在异步操作中丢失上下文。

The value of `this` in the callback of `setTimeout()` might differ depending on when `setTimeout()` is called.
Thus, you can lose the context in asynchronous operations.

Zone 提供了不同于 `this` 的新的 Zone 上下文，该 Zone 上下文在异步操作中保持不变。在下例中，新的 Zone 上下文称为 `zoneThis`。

```ts
zone.run(() => {
  // now you are in a zone
  expect(zoneThis).toBe(zone);
  setTimeout(function () {
    // the zoneThis context will be the same zone
    // when the setTimeout is scheduled
    expect(zoneThis).toBe(zone);
  });
});
```

新的上下文 `zoneThis` 可以从 `setTimeout()` 的回调函数中检索出来，这个上下文和调用 `setTimeout()` 时的上下文是一样的。要获取此上下文，可以调用 [`Zone.current`](https://github.com/angular/angular/blob/main/packages/zone.js/lib/zone.ts)。

# Zone 和异步生命周期钩子

Zone.js 可以创建在异步操作中持久存在的上下文，并为异步操作提供生命周期钩子。

```ts
const zone = Zone.current.fork({
  name: "zone",
  onScheduleTask: function (delegate, curr, target, task) {
    console.log("new task is scheduled:", task.type, task.source);
    return delegate.scheduleTask(target, task);
  },
  onInvokeTask: function (delegate, curr, target, task, applyThis, applyArgs) {
    console.log("task will be invoked:", task.type, task.source);
    return delegate.invokeTask(target, task, applyThis, applyArgs);
  },
  onHasTask: function (delegate, curr, target, hasTaskState) {
    console.log("task state changed in the zone:", hasTaskState);
    return delegate.hasTask(target, hasTaskState);
  },
  onInvoke: function (delegate, curr, target, callback, applyThis, applyArgs) {
    console.log("the callback will be invoked:", callback);
    return delegate.invoke(target, callback, applyThis, applyArgs);
  },
});
zone.run(() => {
  setTimeout(() => {
    console.log("timeout callback is invoked.");
  });
});
```

上面的示例创建了一个具有多个钩子的 Zone。

当任务状态更改时，就会触发 `onXXXTask` 钩子。*Zone 任务*的概念与 JavaScript VM 中任务的概念非常相似：

- `macroTask`：比如 `setTimeout()`

- `microTask`：比如 `Promise.then()`

- `eventTask`：比如 `element.addEventListener()`
  `eventTask`: such as `element.addEventListener()`

这些钩子在以下情况下触发：

|      钩子      |                                                                      详情                                                                      |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
| onScheduleTask |                                              在计划新的异步任务时触发，比如调用 setTimeout() 时。                                              |
|  onInvokeTask  |                                         在异步任务即将执行时触发，比如 setTimeout() 的回调即将执行时。                                         |
|   onHasTask    | 当 Zone 内的一种任务的状态从稳定变为不稳定或从不稳定变为稳定时触发。状态“稳定”表示该 Zone 内没有任务，而“不稳定”表示在该 Zone 中计划了新任务。 |
|    onInvoke    |                                                        将在 Zone 中执行同步函数时触发。                                                        |

使用这些钩子，Zone 可以监视 Zone 内所有同步和异步操作的状态。

上面的示例返回以下输出：

```
the callback will be invoked: () => {
  setTimeout(() => {
    console.log('timeout callback is invoked.');
  });
}
new task is scheduled: macroTask setTimeout
task state changed in the zone: { microTask: false,
  macroTask: true,
  eventTask: false,
  change: 'macroTask' }
task will be invoked macroTask: setTimeout
timeout callback is invoked.
task state changed in the zone: { microTask: false,
  macroTask: false,
  eventTask: false,
  change: 'macroTask' }
```

Zone 的所有函数都由一个名为 Zone.js 的库提供。该库通过猴子补丁拦截异步 API 来实现这些特性。 猴子补丁是一种在运行时添加或更改函数的默认行为而不更改源代码的技术。

Zone 的所有功能均由名为 Zone.js 的库提供。该库通过猴子补丁拦截异步 API 来实现这些功能。猴子补丁是一种在运行时添加或修改函数默认行为而无需更改源代码的技术。

# NgZone

虽然 Zone.js 可以监视同步和异步操作的所有状态，但 Angular 还提供了一项名为 NgZone 的服务。满足以下条件时，此服务会创建一个名为 `angular` 的 Zone 来自动触发变更检测。

1.  当执行同步或异步功能时

2.  已经没有已计划的 `microTask`

## NgZone run() 和 runOutsideOfAngular()

`Zone` 处理大多数异步 API，比如 `setTimeout()`、`Promise.then()` 和 `addEventListener()`。有关完整列表，请参见 [Zone 模块的文档](https://github.com/angular/angular/blob/main/packages/zone.js/MODULE.md)。在这些异步 API 中，你无需手动触发变更检测。

有些第三方 API 没有被 Zone 处理。在这种情况下，`[NgZone](https://angular.cn/api/core/NgZone)` 服务提供了 [`run()`](https://angular.cn/api/core/NgZone#run) 方法，该方法允许你在 `angular` Zone 中执行函数。此函数以及该函数中的所有异步操作会在正确的时间自动触发变更检测。

```ts
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // New async API is not handled by Zone, so you need to use ngZone.run()
    // to make the asynchronous operation callback in the Angular zone and
    // trigger change detection automatically.
    someNewAsyncAPI(() => {
      this.ngZone.run(() => {
        // update the data of the component
      });
    });
  }
}
```

默认情况下，所有异步操作都在 Angular Zone 内，这会自动触发变更检测。另一个常见的情况是你不想触发变更检测。在这种情况下，你可以使用另一个 `[NgZone](https://angular.cn/api/core/NgZone)` 方法：[`runOutsideAngular()`](https://angular.cn/api/core/NgZone#runoutsideangular)。

## 设置 Zone.js

为了使 Zone.js 在 Angular 中可用，你需要导入 zone.js 包。如果使用的是 Angular CLI，则此步骤将自动完成，并且你会在 src/polyfills.ts 中看到以下行：

```ts
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import "zone.js"; // Included with Angular CLI.
```

在导入 `zone.js` 软件包之前，你可以做如下配置：

- 禁用一些异步 API 的猴子补丁，以获得更好的性能。比如，你可以禁用 `requestAnimationFrame()` 的猴子补丁，这样 `requestAnimationFrame()` 的回调就不会触发变更检测。如果你的应用程序不会在 `requestAnimationFrame()` 回调中更新任何数据，则这种方式很有用。

- 指定某些 DOM 事件不在 Angular Zone 内运行；比如，为了防止 `mousemove` 或 `scroll` 事件来触发变更检测。

还可以更改另外几个设置。要进行这些更改，你需要创建一个 `zone-flags.ts` 文件，如下所示。

```ts
// disable patching requestAnimationFrame
(window as any).__Zone_disable_requestAnimationFrame = true;

// disable patching specified eventNames
(window as any).__zone_symbol__UNPATCHED_EVENTS = ["scroll", "mousemove"];
```

有关可以配置的内容的更多信息，请参阅[Zone.js](https://github.com/angular/angular/tree/main/packages/zone.js)文档。

## NoopZone

`Zone` 能帮助 Angular 知道何时要触发变更检测，并使开发人员专注于应用开发。默认情况下，`Zone` 已加载且无需其他配置即可工作。也不是一定要用 `Zone` 才能使 Angular 工作。相反，你也可以选择自己触发变更检测。

要删除 Zone.js，请进行以下更改。

1. 从 polyfills.ts 中移除对 zone.js 的导入

```ts
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
// import 'zone.js';  // Included with Angular CLI.
```

2. 在 src/main.ts 中使用 noop Zone 引导 Angular：

```ts
platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: "noop" })
  .catch((err) => console.error(err));
```

# 转载

[ngZone](https://angular.cn/guide/zone#ngzone)
