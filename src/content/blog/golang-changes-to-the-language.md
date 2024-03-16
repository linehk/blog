---
title: "Go 语言的 4 个特性改动"
pubDate: 2019-02-14T22:11:27+08:00
lastmod: 2019-02-14T22:11:27+08:00
keywords: [Go 语言特性, Go 改动, Go 三索引切片, Go 类型别名]
description: "介绍了 Go 语言不断更新以来 4 个重要的、不太常见的特性改动。"
categories: [Golang]

---

在 [Go1.1](https://golang.org/doc/go1.1) 可以看到某个版本的 Go 语言一些改动文档（修改 URL 参数查看别的版本）。

其中以 [Go1.1#language](https://golang.org/doc/go1.1#language) 标签下关于语言特性方面的尤为重要。

在每个 Go 语言新版本发布后浏览一下，是个良好的习惯。

下面我会从 Go1.1 到 Go1.11 以来挑 4 个值得讨论的改动来跟大家分享一下。

<!--more-->

![Golang Logo](/images/golang-changes-to-the-language/go-logo.webp "Golang 吉祥物")

## 三索引切片

版本: Go1.2

在现有数组或切片下，使用第二个冒号来指示新生成的切片的容量。

```go
func TestThreeIndex(t *testing.T) {
	s := [10]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	s1 := s[2:4]            // 等价于 s[2:4:cap(s)]，省略取 cap(s)。
	t.Log(s1)               // [2, 3]
	t.Log(len(s1), cap(s1)) // len = 2, cap = 8
	// 可以访问在 cap 以内的元素并且如果访问在 len 和 cap 之间的元素就可以访问到底层数组。
	t.Log(s1[0:7]) // [2, 3, 4, 5, 6, 7, 8, 9]

	// 通过限制 cap 从而限制新的切片访问底层数组的能力。
	// cap 取值必须小于或等于底层数组 cap。
	s2 := s[2:4:7] // cap = 7 - 2 = 5
	t.Log(s2) // [2, 3]
	t.Log(len(s2), cap(s2)) // len = 2, cap = 5
	t.Log(s2[0:5]) // [2, 3, 4, 5, 6]
	// error: slice bounds out of range
	// 越界
	t.Log(s2[0:7])
}
```

## for range 简便写法

版本：Go1.4

for range 不需要索引和索引对应的元素值的简便写法。

* 不需要索引。

```go
for _, v := range s {
	t.Log(v)
}
```

* 不需要索引对应的值。

```go
for i := range s {
	t.Log(i)
}
```

* （Go1.4新增）不需要索引和索引对应的值，单纯地把容器类型元素的个数作为迭代的次数。

```go
for range s {
	...
}
```

## 结构体类型转换忽略标签

版本：Go1.8

结构体类型转换时，标签会被忽略。也就是说，标签不同的结构体之间也可以互相转换类型。

注意：正常情况下（没有标签）的结构体类型之间的转换只有字段名、类型和声明的顺序全部相同才合法。

```go
type T1 struct {
	X int `json:"foo"`
}
type T2 struct {
	X int `json:"bar"`
}
var v1 T1
var v2 T2
v1 = T1(v2) // 现在是合法的
```

## 类型别名

版本：Go1.9

类型别名：T1 **完全**是 T2 这个类型，这个新设计是为了重构和兼容旧代码。

```go
type T1 = T2
```

类型声明：T1 的底层数据类型是 T1。

```go
type T1 T2
```

一个简单的区别就是：类型声明和底层类型赋值时需要转换，而类型别名不需要。

## 参考链接

[Go Doc](https://golang.org/doc/ "Go Doc")

[了解 Go 1.9 的类型别名](https://colobu.com/2017/06/26/learn-go-type-aliases/ "了解 Go 1.9 的类型别名")