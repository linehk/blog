---
title: "Golang 1.18 语言规范改动"
date: 2024-01-15T21:44:27+08:00
lastmod: 2024-01-15T21:44:27+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 泛型

详见：[Golang 泛型初级教程](https://sulinehk.com/post/golang-genercis-introductory-tutorial/ "Golang 泛型初级教程")和 [Golang 泛型中级教程](https://sulinehk.com/post/golang-generics-intermediate-tutorial/ "Golang 泛型中级教程")。

## 匿名函数内的未使用变量

在 Go 1.18 之前的版本，以下在匿名函数内的未使用变量 p 不会返回错误：

```go
package main

func main() {
	p := true
	func() {
		p = true
	}()
}
```

在升级到 Go 1.18 后，会正常返回未使用错误：

```shell
# command-line-arguments
./main.go:4:2: p declared and not used
```

## rune 类型的溢出

在 Go 1.18 之前的版本，以下 rune 类型的溢出不会返回错误：

```go
package main

func main() {
	print('1' << 32)
}
```

在升级到 Go 1.18 后，会正常返回溢出错误：

```shell
# command-line-arguments
./main.go:4:8: cannot use '1' << 32 (untyped rune constant 210453397504) as rune value in argument to print (overflows)
```

## 参考链接

[Go 1.18 Release Notes](https://tip.golang.org/doc/go1.18 "Go 1.18 Release Notes")

[cmd/compile: consistently report "declared but not used" errors - needs release notes #49214](https://github.com/golang/go/issues/49214 "cmd/compile: consistently report \"declared but not used errors\" - needs release notes #49214")