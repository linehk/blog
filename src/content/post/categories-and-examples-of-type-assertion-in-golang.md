---
title: "Golang 类型断言的分类和例子"
pubDate: 2021-09-11T23:22:11+08:00
lastmod: 2021-09-11T23:22:11+08:00
keywords: []
description: ""
categories: [Golang]

---

因为对表达式断言和赋值断言的理解不够清晰，所以写了这篇博客来加深理解。

![Golang Logo](/images/categories-and-examples-of-type-assertion-in-golang/golang-logo.webp "Golang Logo")

为了更好地理解类型断言的例子，后面的内容都遵循以下惯例：

* 大写 I：表示接口类型；小写 i：表示接口值。
* 大写 S：表示具体类型；小写 s：表示具体类型值。
* 大写 T：表示具体类型和接口类型其中一种；小写 t：表示具体类型值和接口值其中一种。

## 表达式断言

表达式断言的语法为：`i.(T)`，其中 i 为接口值，T 为具体类型或接口类型。发生错误时，为运行时错误。

### 当 T 为具体类型时，作用是把接口值转换为具体类型值

当 i 的具体类型是 T 时，断言成功：

```go
type I interface{}
type S struct{}
var i I = S{}
_ = i.(S)
// i 的具体类型是 S，所以断言成功。
```

表达式返回一个新值，该值为具体类型值，类型为 T。

当 i 的具体类型不是 T 时，断言失败：

```go
type I interface{}
type S struct{}
var i I
_ = i.(S)
// i 的具体类型未声明，不是 S，所以断言失败。
```

### 当 T 为接口类型时，作用是转换接口类型

当 i 的具体类型实现了 T 接口时，断言成功：

```go
type I1 interface{}
type I2 interface{}
type S struct{}
var i I1 = S{}
_ = i.(I2)
// i 的具体类型 S 实现了 I2 接口，所以断言成功。i 的接口类型从 I1 变为 I2。
```

表达式返回一个新值，该值为接口值，类型为 T。接口值里面的具体类型和具体值不变。

当 i 的具体类型未实现 T 接口时，断言失败：

```go
type I1 interface{}
type I2 interface{ M() }
type S struct{}
var i I1 = S{}
_ = i.(I2)
// i 的具体类型 S 没有实现 M() 方法，即没实现 I2 接口，所以断言失败。
```

## 赋值断言

赋值断言的语法为：`i = t`，其中 i 为接口值，t 为具体类型值或接口值。发生错误时，为编译时错误。

### 当 t 为具体类型值时，作用是转换具体类型

当 t 的具体类型实现了 i 的接口时，断言成功：

```go
type I interface{}
type S1 struct{}
type S2 struct{}
t := S1{}
var i I = S2{}
i = t
// t 的具体类型 S1 实现了 I 接口，所以断言成功。i 的具体类型从 S2 变为 S1。
```

i 的具体类型变为 t 的具体类型，接口类型保持不变。

当 t 的具体类型未实现 i 的接口时，断言失败：

```go
type I interface{ M() }
type S1 struct{}
type S2 struct{}
func (S2) M() {}

t := S1{}
var i I = S2{}
i = t
// t 的具体类型 S1 没有实现 M() 方法，即没实现 I 接口，所以断言失败。
```

### 当 t 为接口值时，作用是转换接口类型

当 t 的具体类型实现了 i 的接口时，断言成功：

```go
type I1 interface{}
type I2 interface{}
type S1 struct{}
type S2 struct{}
var t I1 = S1{}
var i I2 = S2{}
i = t
// t 的具体类型 S1 实现了 i 的接口 I2，i 的接口类型从 I2 变为 I1。
```

i 的接口类型变为 t 的接口类型，具体类型保持不变。显示转换也可以达到同样的作用，如：`i = io.Writer(t)`。

当 t 的具体类型未实现 i 的接口时，断言失败：

```go
type I1 interface{}
type I2 interface{ M() }
type S1 struct{}
type S2 struct{}
func (S2) M() {}

var t I1 = S1{}
var i I2 = S2{}
i = t
// t 的具体类型 S1 未实现 i 的接口 I2，所以断言失败。
```