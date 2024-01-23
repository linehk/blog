---
title: "Golang 1.21 语言规范改动"
date: 2024-01-23T13:50:00+08:00
lastmod: 2024-01-23T13:50:00+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 内置函数

新增内置函数 min、max 来返回参数中的最小值、最大值。

新增内置函数 clear 把切片中的所有元素都设置为零值，或把 map 中的所有元素都删除。

## 包初始化顺序

新的语言规范对包初始化顺序给出了明确的定义。实际上就是按照深度优先搜索的顺序来初始化。

## 类型推断

优化了泛型函数的类型推断，并在规范中做出了明确的定义。

## 变量循环捕获

为了修复一直以来的变量循环捕获问题，可以先通过以下命令来找出受影响的代码：

```shell
go build -gcflags=all=-d=loopvar=2 .
```

`all=` 表示包括依赖包。

然后通过以下命令来启用：

```shell
GOEXPERIMENT=loopvar go build main.go
```

## nil panic

在 Go 1.21 之前的版本，如果传入 panic 函数的参数是 nil，不会返回错误。

现在会发生错误：`panicked: panic called with nil argument`。

## 参考链接

[Go 1.21 Release Notes](https://go.dev/doc/go1.21#language "Go 1.21 Release Notes")

[Go Wiki: LoopvarExperiment](https://go.dev/wiki/LoopvarExperiment "Go Wiki: LoopvarExperiment")