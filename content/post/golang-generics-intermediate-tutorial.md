---
title: "Golang 泛型中级教程"
date: 2024-01-12T20:38:33+08:00
lastmod: 2024-01-12T20:38:33+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 使用类型约束

首先，来看一个函数，它的功能是返回两个参数中数值较小的参数：

```go
func Min(x, y int) int {
	if x < y {
		return x
	}
	return y
}

func TestMin(t *testing.T) {
	var inputIntX int = 1
	var inputIntY int = 2
	var wantInt int = 1
	gotInt := Min(inputIntX, inputIntY)
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}
}
```

然而，该函数只能传入 int 类型，现在通过泛型来编写更通用的代码：

```go
import (
	"golang.org/x/exp/constraints"
)

func GenericsMin[T constraints.Ordered](x, y T) T {
	if x < y {
		return x
	}
	return y
}

func TestGenericsMin(t *testing.T) {
	var inputIntX int = 1
	var inputIntY int = 2
	var wantInt int = 1
	gotInt := GenericsMin[int](inputIntX, inputIntY)
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}

	var inputFloatX float64 = 1.1
	var inputFloatY float64 = 2.2
	var wantFloat float64 = 1.1
	gotFloat := GenericsMin[float64](inputFloatX, inputFloatY)
	if gotFloat != wantFloat {
		t.Errorf("gotFloat %v, wantFloat %v", gotFloat, wantFloat)
	}
}
```

在上面的例子中，可以看到泛型参数 T 的类型约束是 constraints.Ordered。可以通过运行 `go get -u golang.org/x/exp/constraints` 来导入 constraints 包，它提供了一些常用的类型约束，像 Ordered 就代表了可比较类型。

## 实例化

调用函数时 `GenericsMin[int](inputIntX, inputIntY)`，提供类型参数的行为被成为实例化。

实例化的步骤分为：

1. 编译器将用类型参数传参（int）来替换掉所有在泛型函数中出现的类型参数占位符（T）；
2. 编译器将验证类型参数传参（int）是否符合对应的类型约束（constraints.Ordered）的要求。

在实例化之后，泛型函数的行为就跟普通函数没什么不同：

```go
GenericsMinIntInstance := GenericsMin[int]
gotInt := GenericsMinIntInstance(inputIntX, inputIntY)
```

在这里，GenericsMinIntInstance 实际上就是我们最初编写的函数 Min(x, y int) int。

类型参数的行为跟普通的类型是一样的，同样可以为它添加方法：

```go
type TwoNumber[T constraints.Ordered] struct {
	X T
	Y T
}

func (t *TwoNumber[T]) Min() T {
	if t.X < t.Y {
		return t.X
	}
	return t.Y
}

func TestTwoNumberMin(t *testing.T) {
	var inputIntX int = 1
	var inputIntY int = 2
	var wantInt int = 1
	intTwoNumber := TwoNumber[int]{X: inputIntX, Y: inputIntY}
	gotInt := intTwoNumber.Min()
	if gotInt != wantInt {
		t.Errorf("gotInt %v, wantInt %v", gotInt, wantInt)
	}

	var inputFloatX float64 = 1.1
	var inputFloatY float64 = 2.2
	var wantFloat float64 = 1.1
	floatTwoNumber := TwoNumber[float64]{X: inputFloatX, Y: inputFloatY}
	gotFloat := floatTwoNumber.Min()
	if gotFloat != wantFloat {
		t.Errorf("gotFloat %v, wantFloat %v", gotFloat, wantFloat)
	}
}
```

其中，constraints.Ordered 是一个 interface，它的定义在 golang.org/x/exp/constraints 中：

```go
type Ordered interface {
	Integer | Float | ~string
}
```

它起到了类型约束的作用。

## 类型集视角

在引入泛型之前，我们把 interface 当成是方法约束，只有实现了所有 interface 中定义的方法，我们才称实现了 interface 接口。

而现在，在 Go 1.18 引入泛型之后，规定类型约束也必须是一个 interface，所以我们需要用一种新的视角来融合旧的方法约束和新的类型约束，这就是类型集视角。

可以理解为，interface 定义了一组类型（方法），任何满足了类型约束（方法约束）的泛型参数传参（结构体实例），都可以成为实现了该 interface。

所以，为类型约束 interface 添加新的类型，等同于方法约束 interface 添加新的方法：

```go
type Ordered interface {
	Integer | Float | ~string | bool
	NewMethod()
}
```

上述代码分别为 Ordered interface 添加了新的类型 bool 和新的方法 NewMethod()。可以看出通过 `|` 符号来扩展类型约束集合。

有时候，我们会自定义类型，而类型约束不知道我们自定义的类型，所以不满足约束条件。

可以通过在原始类型前面加上 `~` 符号，表示类型约束只会约束原始类型。

通过 `type MyString string` 自定义类型后，MyString 也符合 `~string` 的类型约束。

## 定义约束

我们可以命名类型约束 interface，如：Ordered。也可以在定义泛型函数时直接嵌入。

命名类型约束 interface：

```go
type Element interface {
}

type Slice interface {
	~[]Element
}

func Sum[S Slice, E Element]() {
}
```

在这个例子中，Element 表示可以传入任意类型，类似于以前的空 interface。Slice 表示可以传入任意元素类型的切片。

相当于：

```go
func Sum[S interface{ ~[]E }, E interface{}]() {
}
```

因为不会有歧义，所以可以通过删除第一个类型参数的 `interface{}` 来简化：

```go
func Sum[S ~[]E, E interface{}]() {
}
```

又因为空 interface 很常见，Go 1.18 引入了 `any` 作为 `interface{}` 的别名，在源码中的定义为：`type any = interface{}`。

所以可以用 any 替换 interface{}，语义上也是合理的，表示任意类型：

```go
func Sum[S ~[]E, E any]() {
}
```

## 类型推断错误

在使用自定义类型的时候，类型推断可能会造成错误。

```go
type Point []int32

func (p Point) String() string {
	return ""
}

func Scale[E constraints.Integer](s []E, c E) []E {
	r := make([]E, len(s))
	for i, v := range s {
		r[i] = v * c
	}
	return r
}
```

泛型函数 Scale 的功能是传入一个切片和一个数字，返回乘上了这个数字的新切片。

通过测试用例来测试：

```go
func TestScale(t *testing.T) {
	var inputPoint Point = []int32{1, 2, 3}
	gotPoint := Scale(inputPoint, 2)
	t.Logf("%v", gotPoint.String())
}
```

这个测试用例无法编译，因为返回值 gotPoint 的类型不是我们预期的 Point，而是 []int32，所以没有 String() 方法。

这是因为 Scale 的返回值是 []E，即 []int32，没有考虑到自定义类型。

可以通过显式定义自定义类型的类型参数来修复：

```go
func Scale[S ~[]E, E constraints.Integer](s S, c E) S {
	r := make(S, len(s))
	for i, v := range s {
		r[i] = v * c
	}
	return r
}
```

现在，如果我们通过普通切片（[]int32）来调用新函数，返回值的类型同样为普通切片；如果我们通过自定义类型（Point）来调用新函数，返回值的类型同样为自定义类型。

运行测试也能够顺利通过。

那么，为什么 Go 编译器能够准确地推断出参数的类型呢？答案在于 Go 编译器使用了约束类型推断（constraint type inference）。

当一个类型参数（S ~[]E）由另一个类型参数（E constraints.Integer）组成时，并且使用了 `~` 符号时，Go 编译器就能通过一个类型参数来推断出另一个类型参数。

对于传入的 S，它的类型为 ~[]E，即 E 类型的切片，在类型参数传参为 []int32 时，就可以推断出 E 为 int32。

尽管类型推断的内部原理较为复杂，但使用起来很简单。即便出现类型推断错误，也只是编译时错误，只要加上对应的类型即可。

## 使用泛型的建议

什么时候使用泛型：

* 使用语言内置的数据类型时，如：切片、map 和 channel；
* 使用通用的数据类型时，如：链表、二叉树；
* 实现通用方法时，如：标准库 sort.Interface 中的 3 个方法（Len、Swap、Less）。

什么时候不应该使用泛型：

* 不要用类型参数替换接口类型，如：io.Reader；
* 如果方法实现不同，就应该实现不同的方法，而不是强行使用类型参数，如：Read()；
* 运行时反射很有用，泛型不能完全代替它，如：encoding/json。

指导方针：

* 对于类型参数，传入函数优于添加方法，如：二叉树中的比较函数；
* 不要因为追求速度而从接口类型更改为类型参数，因为它可能不会运行得更快；
* 如果你发现自己写的几份代码之间的唯一区别是类型，就应该使用泛型；反过来说，应该一直避免使用泛型，直到你意识到你在写重复的代码。

## 使用 any 而不是 interface{}

从语义的角度，any 更为清晰，可以用它来替换 interface{}。使用以下命令可以帮你定位到使用 interface{} 的代码：

```shell
find . -name "*.go" | xargs grep "interface{}"
```

并使用以下命令进行替换：

```shell
gofmt -w -r 'interface{} -> any' .
```

## 跟泛型有关的官方包

* golang.org/x/exp/constraints：提供了常见的的类型约束；
* golang.org/x/exp/slices：提供了对泛型切片进行操作的函数；
* golang.org/x/exp/maps：提供了对泛型 map 进行操作的函数。

## 参考链接

[An Introduction To Generics](https://go.dev/blog/intro-generics "An Introduction To Generics")

[When To Use Generics](https://go.dev/blog/when-generics "When To Use Generics")

[切换到Go 1.18后的第一件事：将interface{}全部替换为any](https://tonybai.com/2021/12/18/replace-empty-interface-with-any-first-after-switching-to-go-1-18/ "切换到Go 1.18后的第一件事：将interface{}全部替换为any")

[Go 1.18 Release Notes](https://tip.golang.org/doc/go1.18 "Go 1.18 Release Notes")