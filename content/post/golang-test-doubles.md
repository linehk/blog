---
title: "Golang 测试替代"
date: 2024-03-12T16:01:33+08:00
lastmod: 2024-03-12T16:01:33+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 什么是测试替代

测试替代（Test Doubles）一种用于在测试中替代真实实现的技术。

## 简单的实现

假设我们需要实现一个电话簿功能，可以通过姓名来查找号码。

一个简单的实现可能像这样：

```go
type Person struct {
	FirstName string
	LastName  string
	Phone     string
}

type Phonebook struct {
	People []*Person
}

var (
	ArgumentWrong  = errors.New("argument error")
	PersonNotExist = errors.New("person not exist")
)

func FindPhone(people *Phonebook, firstName, lastName string) (string, error) {
	if firstName == "" || lastName == "" {
		return "", ArgumentWrong
	}
	for _, p := range people.People {
		if p.FirstName == firstName && p.LastName == lastName {
			return p.Phone, nil
		}
	}
	return "", PersonNotExist
}
```

对应的测试函数为：

```go
var phonebook = &Phonebook{People: []*Person{
	{
		FirstName: "FirstName1",
		LastName:  "LastName1",
		Phone:     "Phone1",
	},
	{
		FirstName: "FirstName2",
		LastName:  "LastName2",
		Phone:     "Phone2",
	},
}}

func TestFindPhone(t *testing.T) {
	tests := []struct {
		inputFirstName string
		inputLastName  string
		wantPhone      string
		wantErr        error
	}{
		{"FirstName1", "LastName1", "Phone1", nil},
		{"", "", "", ArgumentWrong},
		{"FirstName3", "LastName3", "", PersonNotExist},
	}

	for _, tt := range tests {
		gotPhone, gotErr := FindPhone(phonebook, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.wantPhone {
			t.Errorf("got %v, want %v", gotPhone, tt.wantPhone)
		}
		if !errors.Is(gotErr, tt.wantErr) {
			t.Errorf("gotErr %v, wantErr %v", gotErr, tt.wantErr)
		}
	}
}
```

但是，这样的实现不利于解耦，如果我们希望换一种搜索方式，就需要重新实现函数。

## 基于接口的实现

通过接口来实现，就能轻松的实现解耦。例如：

```go
type Searcher interface {
	Search(people []*Person, firstName string, lastName string) *Person
}

func (p *Phonebook) FindPhone(searcher Searcher, firstName, lastName string) (string, error) {
	if firstName == "" || lastName == "" {
		return "", ArgumentWrong
	}
	person := searcher.Search(p.People, firstName, lastName)
	if person == nil {
		return "", PersonNotExist
	}
	return person.Phone, nil
}

type NormalImpl struct{}

func (n NormalImpl) Search(people []*Person, firstName string, lastName string) *Person {
	for _, p := range people {
		if p.FirstName == firstName && p.LastName == lastName {
			return p
		}
	}
	return nil
}
```

对应的测试函数为：

```go
func TestNormal(t *testing.T) {
	tests := []struct {
		inputFirstName string
		inputLastName  string
		wantPhone      string
		wantErr        error
	}{
		{"FirstName1", "LastName1", "Phone1", nil},
		{"", "", "", ArgumentWrong},
		{"FirstName3", "LastName3", "", PersonNotExist},
	}

	for _, tt := range tests {
		gotPhone, gotErr := phonebook.FindPhone(&NormalImpl{}, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.wantPhone {
			t.Errorf("got %v, want %v", gotPhone, tt.wantPhone)
		}
		if !errors.Is(gotErr, tt.wantErr) {
			t.Errorf("gotErr %v, wantErr %v", gotErr, tt.wantErr)
		}
	}
}
```

## Dummy

Dummy 是一个空的实例，不实现任何功能，只是用于防止编译器报错。例如：

```go
type DummyImpl struct{}

func (d DummyImpl) Search(people []*Person, firstName string, lastName string) *Person {
	return nil
}
```

在实践中最好不要通过 Dummy 来测试。

## Stub

Stub 直接在调用时提供结果值。例如：

```go
type StubImpl struct {
	phone string
}

func (s StubImpl) Search(people []*Person, firstName string, lastName string) *Person {
	return &Person{
		FirstName: firstName,
		LastName:  lastName,
		Phone:     s.phone,
	}
}
```

对应的测试函数为：

```go
func TestStub(t *testing.T) {
	tests := []struct {
		inputFirstName string
		inputLastName  string
		stubPhone      string
		wantErr        error
	}{
		{"FirstName1", "LastName1", "Phone1", nil},
		{"", "", "", ArgumentWrong},
	}

	for _, tt := range tests {
		gotPhone, gotErr := phonebook.FindPhone(&StubImpl{tt.stubPhone}, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.stubPhone {
			t.Errorf("got %v, want %v", gotPhone, tt.stubPhone)
		}
		if !errors.Is(gotErr, tt.wantErr) {
			t.Errorf("gotErr %v, wantErr %v", gotErr, tt.wantErr)
		}
	}
}
```

这时可以通过 Stub 的值来测试代码的某些路径，如：返回 ArgumentWrong 错误的路径。

## Spy

Spy 在 Stub 的基础上，还可以记住是否进行了调用。例如：

```go
type SpyImpl struct {
	phone  string
	called bool
}

func (s *SpyImpl) Search(people []*Person, firstName string, lastName string) *Person {
	s.called = true
	return &Person{
		FirstName: firstName,
		LastName:  lastName,
		Phone:     s.phone,
	}
}
```

对应的测试函数为：

```go
func TestSpy(t *testing.T) {
	tests := []struct {
		inputFirstName string
		inputLastName  string
		spyPhone       string
		called         bool
	}{
		{"FirstName1", "LastName1", "Phone1", true},
	}

	for _, tt := range tests {
		spyImpl := &SpyImpl{tt.spyPhone, tt.called}
		gotPhone, _ := phonebook.FindPhone(spyImpl, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.spyPhone {
			t.Errorf("got %v, want %v", gotPhone, tt.spyPhone)
		}
		if spyImpl.called != tt.called {
			t.Errorf("got call %v, want call %v", spyImpl.called, tt.called)
		}
	}
}
```

## Mock

Mock 在 Stub 和 Spy 的基础上，还提供了验证是否调用了某个函数的功能。例如：

```go
type MockImpl struct {
	phone         string
	methodsToCall map[string]bool
}

func (m *MockImpl) Search(people []*Person, firstName string, lastName string) *Person {
	m.methodsToCall["Search"] = true
	return &Person{
		FirstName: firstName,
		LastName:  lastName,
		Phone:     m.phone,
	}
}

func (m *MockImpl) ExpectToCall(methodName string) {
	if m.methodsToCall == nil {
		m.methodsToCall = make(map[string]bool)
	}
	m.methodsToCall[methodName] = false
}

func (m *MockImpl) Verify() bool {
	for _, called := range m.methodsToCall {
		if !called {
			return false
		}
	}
	return true
}
```

对应的测试函数为：

```go
func TestMock(t *testing.T) {
	tests := []struct {
		inputFirstName   string
		inputLastName    string
		mockPhone        string
		expectToCall     string
		wantVerifyResult bool
	}{
		{"FirstName1", "LastName1", "Phone1", "Search", true},
		{"FirstName1", "LastName1", "Phone1", "UnCalled", false},
	}

	for _, tt := range tests {
		mock := &MockImpl{phone: tt.mockPhone}
		mock.ExpectToCall(tt.expectToCall)
		gotPhone, _ := phonebook.FindPhone(mock, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.mockPhone {
			t.Errorf("got %v, want %v", gotPhone, tt.mockPhone)
		}
		gotVerifyResult := mock.Verify()
		if gotVerifyResult != tt.wantVerifyResult {
			t.Errorf("got %v, want %v", gotVerifyResult, tt.wantVerifyResult)
		}
	}
}
```

## Fake

Fake 的仿真度更接近于真实实现，只不过是通过一种简单的方式来实现。例如：

```go
type FakeImpl struct {
	people []*Person
}

func (f *FakeImpl) Search(people []*Person, firstName string, lastName string) *Person {
	if len(f.people) == 0 {
		return nil
	}
	return f.people[0]
}
```

对应的测试函数为：

```go
func TestFake(t *testing.T) {
	tests := []struct {
		inputFirstName string
		inputLastName  string
		fakePhone      string
		inputPeople    []*Person
	}{
		{"FirstName1", "LastName1", "Phone1", []*Person{{
			FirstName: "",
			LastName:  "",
			Phone:     "Phone1",
		}}},
		{"FirstName1", "LastName1", "", nil},
	}

	for _, tt := range tests {
		gotPhone, _ := phonebook.FindPhone(&FakeImpl{tt.inputPeople}, tt.inputFirstName, tt.inputLastName)
		if gotPhone != tt.fakePhone {
			t.Errorf("got %v, want %v", gotPhone, tt.fakePhone)
		}
	}
}
```

## 参考链接

[Software Engineering at Google 第十三章 测试替代](https://qiangmzsx.github.io/Software-Engineering-at-Google/#/zh-cn/Chapter-13_Test_Doubles/Chapter-13_Test_Doubles "Software Engineering at Google 第十三章 测试替代")

[Testing in Go: Test Doubles by Example](https://ieftimov.com/posts/testing-in-go-test-doubles-by-example/ "Testing in Go: Test Doubles by Example")