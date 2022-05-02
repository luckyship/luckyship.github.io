---
layout: post
title: typescript中private、public、protected、static、abstract、readonly
tags: [typescript, javascript]
comments: true
date: 2022-05-01 18:25:34
---

|  字段名   |                                         范围                                         |
| :-------: | :----------------------------------------------------------------------------------: |
|  private  |                                        类内部                                        |
|  public   |                        （默认）类内部和外部、及其子类都可访问                        |
| protected |               类内部和其子类（区别与 public，即当前类实例化不可访问）                |
|  static   |                             存在于类本身而不是类的实例上                             |
| abstract  | 定义抽象类和在抽象类内部定义抽象方法，做为其它派生类的基类使用，一般不会直接被实例化 |
| readonly  |                                       只读属性                                       |

<!-- more -->

### 多个关键字可以同时使用

### 默认不写都为 public

### 构造函数被标记成 [protected]。 这意味着这个类不能在包含它的类外被实例化，但是能被继承

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee 能够继承 Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee('Howard', 'Sales');
let john = new Person('John'); // 错误: 'Person' 的构造函数是被保护的.
```

### [readonly] 关键字将属性设置为只读的

```ts
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus('Man with the 8 strong legs');
dad.name = 'Man with the 3-piece suit'; // 错误! name 是只读的.
```

### [static] 关键字，使得属性存在于类本身而不是类的实例上

```ts
class Test {
  static $name: string = 'bob';
}
console.log(Test.$name); // bob
```

### [abstract]关键字是用于定义抽象类和在抽象类内部定义抽象方法，做为其它派生类的基类使用，一般不会直接被实例化

```ts
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log('roaming the earch...');
  }
}
```

### abstract 和 protected 区别

abstract 关键字方法属性必须被[子类]定义，当前类不可实例化，子类实例可直接输出；protected 关键字方法属性仅可被当前类和子类使用，不可直接输出

```ts
abstract class Father {
  protected name: string = 'bob';
  abstract age: number = 12;
}

class Son1 extends Father {
  age: number;
  sayName() {
    console.log(this.name);
  }
}

class Son2 extends Son1 {
  age: number;
  sayName() {
    console.log(this.name);
  }
}

const s1 = new Son1();
const s2 = new Son2();

console.log(s1.name, s2.name); // Error
console.log(s1.age, s2.age);
console.log(s1.sayName(), s2.sayName());
```
