---
layout: post
title: "ruby的小技巧"
date: 2020-09-14
excerpt: "ruby中一些常见的可以简化逻辑的用法，可用于装X"
tags: [ruby]
comments: true
---

## &:的用法
&:重要用于数组的方法，它可以让数组中的每一个元素都执行&:后的方法，相当于`item.fun()`，比如

```
irb(main):001:0> a = [1, 2, 3]
=> [1, 2, 3]
irb(main):002:0> a.map(&:to_s)
=> ["1", "2", "3"]

```
等与
```
irb(main):004:0> a.map { |i| i.to_s  }
=> ["1", "2", "3"]
```

## %Q, %q, %W, %w, %x, %r, %s, %i 
### %Q %q
%Q用于替代双引号的字符串. 当你需要在字符串里放入很多引号时候, 可以直接用下面方法而不需要在引号前逐个添加反斜杠 (")   
%q用于代替单引号的字符串
```
2.3.0 :015 > %Q(rudy said, "i'm not ruby")
 => "rudy said, \"i'm not ruby\""
```
```
2.3.0 :031 > what_ruby = 'this is ruby'
 => "this is ruby"
2.3.0 :032 > %Q!rudy said, "#{what_ruby}"!
 => "rudy said, \"this is ruby\""
2.3.0 :033 > %q!rudy said, "#{what_ruby}"!
 => "rudy said, \"\#{what_ruby}\""
```
(...)也可用其他非数字字母的符号或成对的符号代替, 诸如#...#,!...!, +...+,{...},[...], <...>,/.../等.
```
2.3.0 :016 > %Q/rudy said, "i'm not ruby"/
 => "rudy said, \"i'm not ruby\""
2.3.0 :017 > %Q#rudy said, "i'm not ruby"#
 => "rudy said, \"i'm not ruby\""
2.3.0 :018 > %Q!rudy said, "i'm not ruby"!
 => "rudy said, \"i'm not ruby\""
```

### %W，%w
%W语法近似于%Q, 用于表示其中元素被双引号括起的数组.
%w语法近似于%q, 用于表示其中元素被单引号括起的数组.
```
2.3.0 :031 > what_ruby = 'this is ruby'
 => "this is ruby"
2.3.0 :034 > %W(hello,kitty,cat,dog,what_ruby)
 => ["hello,kitty,cat,dog,what_ruby"]          ###不能用逗号隔开，只能用空格
2.3.0 :035 > %W(hello kitty cat dog what_ruby)
 => ["hello", "kitty", "cat", "dog", "what_ruby"]
2.3.0 :036 > %W(hello kitty cat dog #{what_ruby})
 => ["hello", "kitty", "cat", "dog", "this is ruby"]###双引号中可以被解析
2.3.0 :037 > %w(hello kitty cat dog #{what_ruby})
 => ["hello", "kitty", "cat", "dog", "\#{what_ruby}"]###单引号中不能被解析，被转义了。
```
### %x
用于执行一段shell脚本，并返回输出内容。
```
2.3.0 :038 > %x(route -n)
 => "Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\n0.0.0.0         10.6.0.1        0.0.0.0         UG    100    0        0 eth0\n10.6.0.0        0.0.0.0         255.255.252.0   U     0      0        0 eth0\n"
2.3.0 :039 > %x(echo "hello world")
 => "hello world\n"
```
### %r
语法近似于%Q, 用于正则表达式.
```
2.3.0 :031 > what_ruby = 'this is ruby'
 => "this is ruby"
2.3.0 :041 > %r(/home/#{what_ruby})
 => /\/home\/this is ruby/
```
### %s
用于表示symbol, 但是不会对其中表达式等内容进行转化
```
2.3.0 :031 > what_ruby = 'this is ruby'
 => "this is ruby"
2.3.0 :042 > %s(a b c)
 => :"a b c"
2.3.0 :043 > %s(abc)
 => :abc
2.3.0 :044 > %s(what_ruby)
 => :what_ruby
2.3.0 :045 > %s(#{what_ruby})
 => :"\#{what_ruby}"
```
### %i
Ruby 2.0 之后引入的语法, 用于生成一个symbol数组
```
2.3.0 :031 > what_ruby = 'this is ruby'
 => "this is ruby"
2.3.0 :046 > %i(a b c)
 => [:a, :b, :c]
2.3.0 :047 > %i(a b c #{what_ruby})
 => [:a, :b, :c, :"\#{what_ruby}"]
```

## *的用法
*可以代表数组, 比如可以用于剩余数组的赋值
```
irb(main):001:0> a = [1,2,3]
=> [1, 2, 3]
irb(main):002:0> b,*c = a
=> [1, 2, 3]
irb(main):003:0> c
=> [2, 3]
irb(main):004:0> b
=> 1
```
可以用来代替多参数的函数
```
irb(main):001:0> def test(a, b)
irb(main):002:1> puts a
irb(main):003:1> puts b
irb(main):004:1> end
=> :test
irb(main):005:0> c = [1,2]
=> [1, 2]
irb(main):006:0> test(*c)
1
2
=> nil
```

## 数组可以运算
ruby中数组可以进行`+`和`-`的操作，主要说一下`-`的作用：减去2个数组共有的元素
```
irb(main):001:0> a = [1,2,3]
=> [1, 2, 3]
irb(main):002:0> b = [2,3,4]
=> [2, 3, 4]
irb(main):003:0> a - b
=> [1]
irb(main):004:0> a + b
=> [1, 2, 3, 2, 3, 4]
```

## json数据格式化为symbol类型
```
irb(main):005:0> require 'json'
=> true
irb(main):006:0> a = {b:1, c:2}
=> {:b=>1, :c=>2}
irb(main):007:0> JSON.generate(a)                       # symbol类型的key被转为字符串
=> "{\"b\":1,\"c\":2}"
irb(main):008:0> JSON.parse(JSON.generate(a))
=> {"b"=>1, "c"=>2}
irb(main):009:0> JSON.parse(JSON.generate(a), symbolize_names: true)
=> {:b=>1, :c=>2}

```

## send的用法
send用来调用不确定的函数名
```
irb(main):001:0> def test(a)
irb(main):002:1> puts a
irb(main):003:1> end
=> :test
irb(main):004:0> send('test', '2')
2
=> nil

```