---
title: "Golang 1.20 语言规范改动"
pubDate: 2024-01-15T22:58:33+08:00
lastmod: 2024-01-15T22:58:33+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 切片转换为数组

以下代码预期把切片转换为数组：

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	slice := []int{1, 2, 3, 4}
	array := [4]int(slice)
	fmt.Println(reflect.TypeOf(slice))
	fmt.Println(reflect.TypeOf(array))
}
```

在 Go 1.20 之前的版本，会导致以下错误：

```shell
# command-line-arguments
./main.go:10:17: cannot convert slice (type []int) to type [4]int
```

在升级到 Go 1.20 后，可以正常运行。

## 新增 unsafe 包函数

分别是：SliceData、String 和 StringData。

## 改进结构体和数组是否相等的规范

现在按照结构体字段声明的顺序依次比较，并在第一个不相等字段处停止，并报告整个结构体都不相等。

数组类似，从第一个元素开始依次比较。

## comparable 优化

以下代码使用空 interface 作为类型参数传入：

```go
package main

func main() {
	InterfaceComparable[interface{}]()
}

func InterfaceComparable[T comparable]() {
}
```

在 Go 1.20 之前的版本，会导致以下错误：

```shell
# command-line-arguments
./main.go:4:22: interface{} does not implement comparable
```

在升级到 Go 1.20 后，可以正常运行。

这是因为可比较类型，如：interface，现在都符合 comparable 约束。

## 参考链接

[Go 1.20 Release Notes](https://go.dev/doc/go1.20#language "Go 1.20 Release Notes")

[All your comparable types](https://go.dev/blog/comparable "All your comparable types")