---
layout: post
title: angular form 自定义组件
tags: [javascript, angular]
comments: true
date: 2024-04-10 17:31:25
---

`angular` 表单里面需要使用 自定义组件时，想要方便的使用`formGroup`的`formControlName`，需要自定义组件的`formControlName`属性，
如何去自定义组件的`formControlName`属性呢？

<!-- more -->

## 引入`ControlValueAccessor` 接口

`ControlValueAccessor` 接口是`angular` 表单组件的`formControlName`属性的依赖注入，`ControlValueAccessor` 接口需要实现`registerOnChange`、`registerOnTouched`、`setDisabledState`、`writeValue`方法，
我们这里不需要用到表单的`disabled`属性，所以可以忽略`setDisabledState`

我们新建`input-number`组件
引入`NG_VALUE_ACCESSOR`, 并写出对应的`registerOnChange`、`registerOnTouched`、`writeValue`方法

```ts
import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  template: `
    <div>
      <span>{{ count }}</span>
    </div>
  `,
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent implements OnInit {
  /**
   * formControlName对应的表单值会在此传入
   */
  writeValue(value: any) {
    if (value) {
      this.count = value;
    }
  }

  /**
   * form表单的更新函数会在此传入，需要调用此函数更新表单的值
   */
  registerOnChange(fn: any) {}

  registerOnTouched(fn: any) {}
}
```

## 定义 `updateValue` 函数

新建 `updateValue`函数，并且在`increment`、`decrement`、`writeValue`函数中调用`updateValue`函数，更新表单的值
该组件显示数字，并且可以点击增加和减少按钮

```ts
import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <span>{{ count }}</span>
      <button (click)="increment()">+</button>
    </div>
  `,
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent implements OnInit {
  /**
   * formControlName对应的表单值会在此传入
   */
  writeValue(value: any) {
    if (value) {
      this.count = value;
      this.updateValue(this.count);
    }
  }

  updateValue: (value: any) => void = (_: any) => {};
  updateValueByTouched: (value: any) => void = (_: any) => {};

  /**
   * form表单的更新函数会在此传入，需要调用此函数更新表单的值
   */
  registerOnChange(fn: any) {
    this.updateValue = fn;
  }

  registerOnTouched(fn: any) {
    this.updateValueByTouched = fn;
  }

  increment() {
    this.count++;
    this.updateValue(this.count);
  }

  decrement() {
    this.count--;
    this.updateValue(this.count);
  }
}
```

为了不在每次更新`count`值的时候，都去手动调用`updateValue`函数,我们更新一下数据结构，让其在 count 值改变时，自动调用`updateValue`函数

```ts
import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <span>{{ count }}</span>
      <button (click)="increment()">+</button>
    </div>
  `,
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent implements OnInit {
  _count: number = 0;

  get count() {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
    this.updateValue(this._count);
  }

  constructor() {}

  ngOnInit() {}

  writeValue(value: any) {
    if (value) {
      this.count = value;
    }
  }

  updateValue: (value: any) => void = (_: any) => {};
  updateValueByTouched: (value: any) => void = (_: any) => {};

  registerOnChange(fn: any) {
    this.updateValue = fn;
  }

  registerOnTouched(fn: any) {
    this.updateValueByTouched = fn;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

至此，我们已经写好了自定义的 `form` 组件

## 使用自定义组件

下面我们在 `form` 表单里引入自定义组件，试试看效果

```ts
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <form [formGroup]="numberForm">
        <app-input-number formControlName="count"></app-input-number>

        <div>{{ numberForm.get('count')?.value }}</div>
      </form>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  numberForm = this.fb.group({
    count: 5, // 设置初始值
  });

  constructor(private fb: FormBuilder) {}
}
```

我们在组件下面显示出对应的 form 的表单值，可以看到，我们的自定义组件`input-number`已经生效了
