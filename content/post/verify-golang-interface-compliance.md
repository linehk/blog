---
title: "验证 Golang 接口的合规性"
date: 2020-08-15T21:55:18+08:00
lastmod: 2020-08-15T21:55:18+08:00
keywords: []
description: ""
categories: [Golang]

---

因为公司的项目经常出现这行代码：`var _ Interface = (*Type)(nil)`，所以写了这篇博客来解释它。

<!--more-->

![Interface Logo](/images/verify-golang-interface-compliance/interface-logo.webp "Interface Logo")

## 详细说明

`var _ Interface = (*Type)(nil)` 这段代码在很多项目的源码都有出现过，也是 [Uber Go Style Guide]("https://github.com/uber-go/guide/blob/master/style.md#verify-interface-compliance" "Uber Go Style Guide") 推荐的规范。

简单来说，它的作用是：**检查 `TestType` 这个类型，是否实现了 `TestInterface` 这个接口，未实现则会出现编译时错误。**

详细解释可以把等号两边分开来看：

1. Golang 的表达式从右边开始计算，所以先看右边部分：`(*TestType)(nil)`。它的意思是，声明一个 `nil` 常量，然后转换为 `*TestType` 类型。相当于：`var testType *TestType = nil`。
2. 再看左边部分：`var _ TestInterface`。它的意思是，声明一个接口变量，赋值为右边的表达式，然后把变量丢弃。代码如下：

```go
type TestInterface interface {
	Hello()
}

type TestType struct{}

func (t TestType) Hello() {}

var _ TestInterface = (*TestType)(nil)
```

注释或删除掉 `func (t TestType) Hello() {}` 这行，相当于 TestType 未实现 TestInterface 接口，就会出现编译时错误：`Cannot use '(*TestType)(nil)' (type *TestType) as the type TestInterface Type does not implement 'TestInterface' as some methods are missing: Hello()`。

另一种比较繁琐，但易于理解的代码如下：

```go
type TestInterface interface {
	Hello()
}

type TestType struct{}

func (t TestType) Hello() {}

func TestCompliance(t *testing.T) {
	var testType *TestType = nil
	var testInterface TestInterface
	testInterface = testType
	fmt.Println(testInterface)
}
```

## 指针形式

还有一个问题，为什么右边的类型要用 **指针形式（`*TestType`）** 呢？

让我们先把它转换成 **非指针形式（`TestType`）** 看看，值也改成对应类型的零值（`struct{}{}`）：

```go
type TestInterface interface {
	Hello()
}

type TestType struct{}

func (t TestType) Hello() {}

var _ TestInterface = (TestType)(struct{}{})
```

如果把 `func (t TestType)` 改成 `func (t *TestType)` 同样会出现错误。

这是因为指针形式与非指针形式不同，拥有的方法不同，实现的接口也不同。

相比之下，指针形式拥有非指针形式的方法，实现了 `*TestType` 接口的值也实现了 `TestType` 接口。

所以指针形式比非指针形式更加通用。

## 参考链接

[golang-interface(二) 常见问题/底层实现](https://juejin.cn/post/6984060198428573733 "golang-interface(二) 常见问题/底层实现")