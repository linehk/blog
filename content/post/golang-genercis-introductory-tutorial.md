---
title: "Golang 泛型初级教程"
date: 2024-01-11T22:34:33+08:00
lastmod: 2024-01-11T22:34:33+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 泛型的优势

泛型编程（Generic Programming）是现代编程语言中的一项强大功能，它允许程序员编写出一种通用的形式来表示函数或数据结构，从而抽象出数据类型。

泛型的使用可以极大地减少代码重复，增加程序的灵活性与可维护性。

对于库的开发者来说，泛型的确引入了额外的复杂性；但对库的使用者而言，泛型提供了简洁和强大的工具，极少地增加了复杂性。

## 初级教程

首先，来看两个函数，它们的功能都是计算一个切片中所有元素的总和：

```go
func SumInts(s []int) int {
	var r int
	for _, v := range s {
		r += v
	}
	return r
}

func SumFloats(s []float64) float64 {
	var r float64
	for _, v := range s {
		r += v
	}
	return r
}
```

但因为它们处理的数据类型不同（一个是 int，另一个是 float64），我们不得不为每种类型编写一个新函数。

泛型在这里发挥作用，允许我们使用类型参数来泛化函数的实现。

可以通过一些测试用例来确认函数的正确性：

```go
func TestSumInts(t *testing.T) {
	inputInts := []int{1, 2, 3}
	wantInt := 6
	gotInt := SumInts(inputInts)
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}
}

func TestSumFloats(t *testing.T) {
	inputFloats := []float64{1.1, 2.2, 3.3}
	wantFloat := 6.6
	gotFloat := SumFloats(inputFloats)
	if gotFloat != wantFloat {
		t.Errorf("gotFloat %v, wantFloat %v", gotFloat, wantFloat)
	}
}
```

接下来通过泛型代码来重写：

```go
func SumIntsOrFloats[T int | float64](s []T) T {
	var r T
	for _, v := range s {
		r += v
	}
	return r
}

func TestSumIntsOrFloats(t *testing.T) {
	inputInts := []int{1, 2, 3}
	wantInt := 6

	gotInt := SumIntsOrFloats[int](inputInts)
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}

	inputFloats := []float64{1.1, 2.2, 3.3}
	wantFloat := 6.6
	gotFloat := SumIntsOrFloats[float64](inputFloats)
	if gotFloat != wantFloat {
		t.Errorf("gotFloat %v, wantFloat %v", gotFloat, wantFloat)
	}
}
```

可以看到，泛型函数声明后面多了一对方括号 `[]`，然后才是正常函数的参数和返回值。

在方括号里面的内容可以用类似正常变量声明的方式来阅读：`[T int | float64]` 表示声明了一个变量 T，T 的类型是 int 或 float64，`|` 表示或。

在这里，T 叫做类型参数，可以理解为把类型（int、float64、bool 等）当作参数变量来使用。而 `int | float64` 叫做类型约束，表示类型参数允许的类型集合。

然后在参数和返回值里，就可以像使用普通类型一样来使用这个类型参数。

`(s []T) T` 表示传入一个名为 s 的参数，类型是 []T，返回一个 T 类型的值。

可以自然地把类型参数 T 视为 int 或 float64 的一个占位符：

* 在 T 为 int 时：`(s []T) T` 等同于 `(s []int) int`，表示传入一个名为 s 的参数，类型是 []int，返回一个 int 类型的值；
* 在 T 为 float64 时：`(s []T) T` 等同于 `(s []float64) float64`，表示传入一个名为 s 的参数，类型是 []float64，返回一个 float64 类型的值。

在函数内部，也可以像使用普通类型一样来使用这个类型参数：`var r T` 表示声明了一个变量 r，r 的类型是 T，既是 int 或 float64。

在调用泛型函数的时候，像传入普通参数一样传入类型：`SumIntsOrFloats[int](inputInts)`。只不过传入类型时使用方括号，传入参数还是像以前一样使用圆括号。

一般情况下，可以不用传入类型，像普通函数一样调用 `SumIntsOrFloats(inputInts)`，因为 Go 编译器会根据传入的参数来推断类型。

在这里，前面已经通过 `inputInts := []int{1, 2, 3}` 来显式声明参数类型，是 []int，所以 Go 编译器能够推断出来正确的类型。

如果调用的泛型函数没有参数，就不可能通过参数来推断类型，这时就需要显式传入类型参数。

接下来可以进一步优化代码，通过接口来定义类型约束，来使得它能够被多个函数使用：

```go
type Number interface {
	int | float64
}

func SumNumbers[T Number](s []T) T {
	var r T
	for _, v := range s {
		r += v
	}
	return r
}

func TestSumNumbers(t *testing.T) {
	inputInts := []int{1, 2, 3}
	wantInt := 6

	gotInt := SumNumbers(inputInts)
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}

	inputFloats := []float64{1.1, 2.2, 3.3}
	wantFloat := 6.6
	gotFloat := SumNumbers(inputFloats)
	if gotFloat != wantFloat {
		t.Errorf("gotFloat %v, wantFloat %v", gotFloat, wantFloat)
	}
}
```

在这里，我们定义了一个名为 Number 的 interface，跟以前不同，interface 里面不是方法，而是类型的集合。

通过将 Number 放在类型参数的后面，就可以起到类型约束的效果。

## 参考链接

[Why Generics?](https://go.dev/blog/why-generics "Why Generics?")

[Tutorial: Getting started with generics](https://go.dev/doc/tutorial/generics "Tutorial: Getting started with generics")