---
title: "Golang 1.22 语言规范改动"
date: 2024-03-12T11:37:46+08:00
lastmod: 2024-03-12T11:37:46+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 默认修复循环变量意外共享问题

在 Go 1.21 需要手动通过 GOEXPERIMENT=loopvar 启用的功能，修复循环变量意外共享，现在是默认的。

例如：

```go
func TestLoopVar(t *testing.T) {
	var funcSlice []func()
	for i := 0; i < 3; i++ {
		funcSlice = append(funcSlice, func() {
			print(i)
			print(" ")
		})
	}
	for j := 0; j < 3; j++ {
		funcSlice[j]()
	}
}
```

在 Go 1.22 之前，以上代码打印的值为 `3 3 3 `，现在是 `0 1 2 `。这是因为 i 只会创建一次，然后在每次迭代中不断赋予新值。

现在每次迭代都会创建一个新的 i，每个 i 的地址都不一样，所以不会意外共享。详见：[Go 语言闭包详解 - 第三个例子](https://www.sulinehk.com/post/golang-closure-details/#第三个例子 "Go 语言闭包详解 - 第三个例子")。

## range 支持整数

现在可以在 range 后面写一个整数，然后 for 会循环对应的次数，i 从 0 开始递增。例如：

```go
func TestRangeNumber(t *testing.T) {
	for i := range 5 {
		print(i)
		print(" ")
	}
}
```

以上代码打印的值为 `0 1 2 3 4 `。

可以起到简化以下代码的作用：

```go
	for i := 0; i < 5; i++ {
		print(i)
		print(" ")
	}
```

## range 支持函数迭代器

假设我们要实现反向打印切片值的功能，一个简单的实现可能是这样的：

```go
func TestBackward(t *testing.T) {
	s := []string{"hello", "world"}
	for i := len(s) - 1; i >= 0; i-- {
		print(i, s[i])
		print(" ")
	}
}
```

以上代码会打印`1world 0hello `。

在 Go 1.22，可以通过 GOEXPERIMENT=rangefunc 启用 range 支持函数迭代器。

这样就可以用以下代码实现相同功能：

```go
func Backward[E any](s []E) func(func(int, E) bool) {
	return func(yield func(int, E) bool) {
		for i := len(s) - 1; i >= 0; i-- {
			if !yield(i, s[i]) {
				return
			}
		}
	}
}

func TestLoopFunc(t *testing.T) {
	s := []string{"hello", "world"}
	for i, x := range Backward(s) {
		print(i, x)
		print(" ")
	}
}
```

可以起到简化以下代码的作用：

```go
	s := []string{"hello", "world"}
	Backward(s)(func(i int, x string) bool {
		print(i, x)
		print(" ")
		return true
	})
```

## 参考链接

[Go 1.22 Release Notes](https://go.dev/doc/go1.22#language "Go 1.22 Release Notes")

[Go Wiki: Rangefunc Experiment](https://go.dev/wiki/RangefuncExperiment "Go Wiki: Rangefunc Experiment")