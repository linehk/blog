---
title: "Go 语言单元测试实践"
pubDate: 2018-12-10T10:34:40+08:00
lastmod: 2018-12-10T10:34:40+08:00
keywords: [ Go 单元测试, Go 表驱动测试, 生成 Go 测试, 使用 gotests, testify 测试包教程 ]
description: "介绍了软件测试的定义和测试驱动开发（TDD）的由来。并通过一个示例展示了 Go 语言单元测试的实践过程。"
categories: [ Golang ]

---

什么是**软件测试**？

软件测试是一个过程，该过程对软件（计算机程序）进行各种操作来发现软件错误。

为什么要进行软件测试？

进行软件测试可以帮助我们验证软件的各种功能正常，保证软件的正常工作从而提高软件质量。**并且在实践中已被证明是颇有成效的**。

**测试驱动开发**的由来：

一个从大量实践中得出的结论：人们发现在软件开发周期中，软件错误每进入到下一个阶段要修正它所付出的时间和人力会出人意表的翻上十倍。所以更早地进行软件测试可以更早地发现软件错误，从而大大减少后期修正的成本。后来又有人提出了
**测试驱动开发（TDD: Test-driven development）**，主体思想就是**先编写测试程序，再实现程序功能**。

下面就来介绍如何在 Go 语言中进行软件测试中较为重要的一环：单元测试。

<!--more-->

![Go 语言单元测试实践](/images/golang-unit-testing/unit-testing-logo.webp "Go 语言单元测试实践")

## 单元测试简介

**单元测试就是针对程序最小单元的测试**。

最小单元在过程化编程中指的是**函数**；在面向对象编程中指的是**方法**。

## Go 语言对软件测试的支持

* testing 包：标准库中一个简单、强大的测试框架。
* go test 命令：`go tool` 中一个按照约定和组织的测试代码的命令。

### 规定（必须遵循的条例）

* 只有以 `_test.go` 结尾的文件才会被视作是测试文件。如：`swap_test.go`。
* 测试函数命名必须以 `Test` 开头，而后紧接着的第一个字母必须大写。如：`TestSwap`。
* 测试函数必须传入一个指向 `testing.T` 或 `testing.B`（基准测试）的指针作为参数。如：`func TestSwap(t *testing.T)`，且没有返回值。

### 建议（最佳方法实践条例）

* 将测试文件和要测试的代码放在同一个包（Go 语言组织也建议包名和文件所在目录名相同）。也就是说将这两个文件的 `package xxx`
  写成相同的。
* 将测试文件命名为 `要测试的代码文件名_test.go`。如：`util.go` 的测试文件名应为 `util_test.go`。
* 将测试函数命名为 `Test要测试的函数名称`。如：`Swap` 函数的测试函数命名应为 `TestSwap`，这个函数应只包含测试 `Swap` 函数的内容。

## Go 语言单元测试实践

### 示例函数说明

这里有一个用 Go 语言编写的 `Swap` 函数（交换切片中的两个值）：

1. 文件名：`swap.go`。
2. 包名：`swap`。
3. 测试文件名：`swap_test.go`。
4. 测试文件包名：`swap`。

这两个文件都放在 `$GOPATH/src/swap/` 目录下。

* 测试整个包: `go test swap`。`swap` 为基于 `$GOPATH/src/` 的相对目录。
* 测试单个测试函数: `go test swap -run TestSwap`。`swap` 同样为相对目录，`TestSwap` 为测试函数名。

下面会展示如何为这个 `Swap` 函数**编写单元测试、将单元测试改写成表驱动测试的形式并显示代码的测试覆盖率**。

### 示例函数代码

```go
package swap

import (
	"errors"
)

// Swap exchanges s[i] and s[j].
func Swap(s []interface{}, i, j int) error {
	if s == nil {
		return errors.New("slice can't be nil")
	}
	if (i < 0 || i >= len(s)) || (j < 0 || j >= len(s)) {
		return errors.New("illegal index")
	}

	s[i], s[j] = s[j], s[i]

	return nil
}

// IsSameSlice determines two slice is it the same.
func IsSameSlice(a, b []interface{}) bool {
	if len(a) != len(b) {
		return false
	}
	if (a == nil) != (b == nil) {
		return false
	}

	for i, v := range a {
		if b[i] != v {
			return false
		}
	}

	return true
}
```

### 单元测试示例

```go
package swap

import (
	"testing"
)

func TestSwap(t *testing.T) {
	input1 := []interface{}{1, 2}
	i1 := 0
	j1 := 1
	want1 := []interface{}{2, 1}
	if err := Swap(input1, i1, j1); err != nil {
		t.Error(err)
	}

	if !IsSameSlice(input1, want1) {
		t.Errorf("got %v, want %v", input1, want1)
	}

	input2 := []interface{}{1, 'a', "aa"}
	i2 := 0
	j2 := 2
	want2 := []interface{}{"aa", 'a', 1}
	if err := Swap(input2, i2, j2); err != nil {
		t.Error(err)
	}

	if !IsSameSlice(input2, want2) {
		t.Errorf("got %v, want %v", input2, want2)
	}
}
```

这段代码就是为 `Swap` 编写的简单单元测试，可以看出，如果测试数据变多，代码就会有很多**冗余**。这种问题的一个有效地解决方法就是
**用表驱动测试来实现单元测试**。

#### 表驱动测试示例

**表驱动测试**是单元测试的一种形式，通过把测试条件都写在一张表里，就可以动态地添加测试数据而不用改动太多代码。

```go
package swap

import (
	"testing"
)

func TestSwap(t *testing.T) {
	tests := []struct {
		input []interface{}
		i     int
		j     int
		want  []interface{}
	}{
		{[]interface{}{1, 2}, 0, 1, []interface{}{2, 1}},
		{[]interface{}{1, 'a', "aa"}, 0, 2, []interface{}{"aa", 'a', 1}},
	}
	for i, tt := range tests {
		if err := Swap(tt.input, tt.i, tt.j); err != nil {
			t.Error(err)
		}

		if !IsSameSlice(tt.input, tt.want) {
			t.Errorf("%v. got %v, want %v", i, tt.input, tt.want)
		}
	}
}
```

### 查看测试覆盖率

**测试覆盖率**就是测试运行到的被测试代码的代码数目。其中以**语句的覆盖率**最为简单和广泛，语句的覆盖率指的是*
*在测试中至少被运行一次的代码占总代码数的比例**。

使用 `go tool cover` 命令来查看有关测试覆盖率命令行的帮助。

**注意：首先必须保证测试是能够通过的**。

* 测试整个包: `go test -cover=true swap`。
* 测试单个测试函数: `go test -cover=true swap -run TestSwap`。

**`-cover=true` 选项会开启覆盖率说明**。

#### 生成 HTML 报告

前面展示的都是命令行下的报告，不够直观。

其实 `go tool cover` 支持更友好的输出，如：HTML 报告。

`go test -cover=true swap -coverprofile=out.out` 将在当前目录生成覆盖率数据。

配合 `go tool cover -html=out.out` 在浏览器中打开 HTML 报告。

或者使用 `go tool cover -html=out.out -o=out.html` 生成 HTML 文件。

![Go 语言测试覆盖率 HTML 报告](/images/golang-unit-testing/cover-report.webp "Go 语言测试覆盖率 HTML 报告")

## 第三方测试框架

一般情况下，Go 语言标准库对测试的支持已足够强大。但是也有许多第三方的库提供了各种各样的功能。这里只介绍两个使用广泛的库和其主要功能。

### 使用 testify 包简化测试代码

安装：`go get -u github.com/stretchr/testify`。

`testify` 提供 `assert`、`mock`、`http` 三个包进行更多样的测试。下面用其中的 `assert` 包改写前面的例子。

```go
package swap

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestSwap(t *testing.T) {
	input1 := []interface{}{1, 2}
	i1 := 0
	j1 := 1
	want1 := []interface{}{2, 1}
	if assert.Nil(t, Swap(input1, i1, j1)) {
		t.FailNow()
	}

	assert.Equal(t, input1, want1)

	input2 := []interface{}{1, 'a', "aa"}
	i2 := 0
	j2 := 2
	want2 := []interface{}{"aa", 'a', 1}
	if assert.Nil(t, Swap(input2, i2, j2)) {
		t.FailNow()
	}

	assert.Equal(t, input2, want2)
}
```

### 使用 gotests 生成测试代码

安装：`go get -u github.com/cweill/gotests`。

`gotests` 可以为程序生成表驱动测试，在生成之后再添加测试数据即可完成测试代码的编写。

使用命令：`gotests -all -w go/src/swap/swap.go` 即可生成关于 `swap.go`
文件中所有函数的表驱动测试形式的单元测试，包含在与 `swap.go` 同目录下的 `swap_test.go` 文件中。

```go
package swap

import "testing"

func TestSwap(t *testing.T) {
	type args struct {
		s []interface{}
		i int
		j int
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := Swap(tt.args.s, tt.args.i, tt.args.j); (err != nil) != tt.wantErr {
				t.Errorf("Swap() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
```

上面就是运行命令之后生成的代码。在 `TODO` 中添加测试数据即可。

```go
package swap

import "testing"

func TestSwap(t *testing.T) {
	type args struct {
		s []interface{}
		i int
		j int
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"1", args{[]interface{}{1, 2}, 0, 1}, false},
		{"2", args{[]interface{}{1, 'a', "aa"}, 0, 2}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := Swap(tt.args.s, tt.args.i, tt.args.j); (err != nil) != tt.wantErr {
				t.Errorf("Swap() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
```

可以看出这里并没有测试交换后的值是否正确，说明 `gotests` 的代码会根据返回值生成，也说明了 `gotests`
对某些函数来说是不适用的或者说是需要手动修改的。

## 参考链接

[Go 单元测试](https://jimmysong.io/go-practice/docs/go_unit_test.html "Go 单元测试")

[Go 语言实战笔记（二十一）| Go 单元测试](https://www.flysnow.org/2017/05/16/go-in-action-go-unit-test.html "Go 语言实战笔记（二十一）| Go 单元测试")