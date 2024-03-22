---
title: "Golang 1.10 到 1.17 期间发生的语言规范改动"
pubDate: 2021-08-22T23:22:11+08:00
lastmod: 2021-08-22T23:22:11+08:00
keywords: []
description: ""
categories: [Golang]

---

因为 Golang 1.10 到 1.17 期间发生了相当多的语言规范改动，所以写了这篇博客来记录它。

![Golang Logo](/images/language-specification-changes-between-golang-1.10-to-1.17/golang-logo.webp "Golang Logo")

## Golang 1.10

### 无类型常量移位

确定了无类型常量移位这种极端场景的处理方法。

允许这样的索引表达式：`x[1.0 << s]`，其中 s 是无符号整数。

### 方法表达式

放宽了方法表达式的语法。允许任何类型的表达式作为接收器。如：`struct{io.Reader}.Read`。

## Golang 1.11

语言规范没有改动。

## Golang 1.12

语言规范没有改动。

## Golang 1.13

### 现代化的数字字面量前缀

* 二进制整数：使用前缀 0b 或 0B。如：`0b1011`；
* 八进制整数：使用前缀 0o 或 0O。如：`0o660.0`。原来以 0 为前缀的八进制表示法仍然有效，如`0666`；
* 十六进制浮点数：使用前缀 0x 或 0X。如：`0x1.0p-1021`。其中必须有一个指数，表示为 p 或 P后跟一个十进制数。指数使用 2 为底数，而不是 16。

### 虚数字面量

虚数后缀 i 原来只能跟十进制整数和浮点数字面量一起使用。

现在新增了对二进制和十六进制整数的支持。如：`0b1011i`。

### 数字分隔符

可以使用下划线分隔任何数字字面量。

下划线可以出现在任何两个数字之间或前缀和第一个数字之间。如：`1_000_000`、`0b_1010_0110` 和 `3.1415_9265`。

### 移位操作

移位操作去除了位移量必须是无符号数的限制。如：`x << y`，其中 y 可以是有符号数。

## Golang 1.14

### 嵌入非空同名方法

允许嵌入具有重叠方法集的接口：来自嵌入式接口的方法可能与（嵌入）接口中已经存在的方法具有相同的名称和相同的签名。

Golang 1.14 之前，允许内嵌多个空接口：

```go
type Man interface {
}

type Women interface {
}

type Human interface {
	Man
	Women
}
```

而不允许内嵌多个非空接口：

```go
type Man interface {
	Walk()
}

type Women interface {
	Walk()
}

type Human interface {
	Man
	Women
}
```

Golang 1.14 之后，允许内嵌多个非空接口。这些接口的方法可以同名或不同名，如果同名的话，就需要这些方法具有相同的签名，否则就是错误的：

```go
type Man interface {
	Walk(int) int
}

type Women interface {
	Walk(string) string
}

type Human interface {
	Man
	Women
}
```

## Golang 1.15

语言规范没有改动。

## Golang 1.16

语言规范没有改动。

## Golang 1.17

### 切片转换为数组指针

将切片转换为数组指针时，会返回一个指向切片底层数组的指针。如：

```go
a := []int{1, 2, 3}
b := (*[3]int)(a)
```

如果目标数组的长度，大于原切片的长度，则会发生运行时恐慌。

### 新增 unsafe.Add 函数

`unsafe.Add(ptr, len)` 将 len 添加到 ptr，然后返回一个指针。

### 新增 unsafe.Slice 函数

`unsafe.Slice(ptr *ArbitraryType, len IntegerType) []ArbitraryType` 通过 ptr 和 len 构造一个切片。相当于：`(*[len]ArbitraryType)(unsafe.Pointer(ptr))[:]`。

## 参考链接

[Go 1.10 Release Notes](https://go.dev/doc/go1.10#language "Go 1.10 Release Notes")

[Go 1.13 Release Notes](https://go.dev/doc/go1.13#language "Go 1.13 Release Notes")

[Go 1.14 Release Notes](https://go.dev/doc/go1.14#language "Go 1.14 Release Notes")

[Go 1.17 Release Notes](https://go.dev/doc/go1.14#language "Go 1.17 Release Notes")