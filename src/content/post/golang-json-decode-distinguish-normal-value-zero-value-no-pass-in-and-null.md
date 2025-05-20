---
title: "Golang JSON 解码时区分正常值、零值、未传入和 null"
pubDate: 2025-05-12T17:50:58+08:00
lastmod: 2025-05-12T17:50:58+08:00
keywords: []
description: ""
categories: [Golang]

---

## 问题

在上一个项目 [listdb](https://www.upwork.com/jobs/~018db314725bf3f8f2 "listdb") 中，客户希望在传入的 JSON 中区分正常值、零值、未传入和 null。

但 Golang 使用默认的 JSON 解码时，无法区分，示例如下：

```go
func TestDistinguishProblem(t *testing.T) {
	type jsonStruct struct {
		Value bool
	}

	normalValueJSON := []byte(`{"Value": true}`)
	var normalValue jsonStruct
	err := json.Unmarshal(normalValueJSON, &normalValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(normalValue.Value) // true

	zeroValueJSON := []byte(`{"Value": false}`)
	var zeroValue jsonStruct
	err = json.Unmarshal(zeroValueJSON, &zeroValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(zeroValue.Value) // false

	noPassInJSON := []byte(`{}`)
	var noPassIn jsonStruct
	err = json.Unmarshal(noPassInJSON, &noPassIn)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(noPassIn.Value) // false

	nullValueJSON := []byte(`{"Value": null}`)
	var nullValue jsonStruct
	err = json.Unmarshal(nullValueJSON, &nullValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(nullValue.Value) // false
}
```

## 解决方案 1：指针

使用对应类型的指针，当指针为 `nil` 时，表示未传入或传入 null；当指针不为 `nil` 且为零值时，表示零值。

但这样还是无法区分未传入和传入 null，示例如下：

```go
func TestPointer(t *testing.T) {
	type jsonStruct struct {
		Value *bool
	}

	normalValueJSON := []byte(`{"Value": true}`)
	var normalValue jsonStruct
	err := json.Unmarshal(normalValueJSON, &normalValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(*normalValue.Value) // true

	zeroValueJSON := []byte(`{"Value": false}`)
	var zeroValue jsonStruct
	err = json.Unmarshal(zeroValueJSON, &zeroValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(*zeroValue.Value) // false

	noPassInJSON := []byte(`{}`)
	var noPassIn jsonStruct
	err = json.Unmarshal(noPassInJSON, &noPassIn)
	if err != nil {
		log.Fatal(err)
	}
	if noPassIn.Value == nil {
		fmt.Println("no pass in or null")
	} else {
		fmt.Println(*noPassIn.Value)
	}

	nullValueJSON := []byte(`{"Value": null}`)
	var nullValue jsonStruct
	err = json.Unmarshal(nullValueJSON, &nullValue)
	if err != nil {
		log.Fatal(err)
	}
	if nullValue.Value == nil {
		fmt.Println("no pass in or null")
	} else {
		fmt.Println(*nullValue.Value)
	}
}
```

## 解决方案 2：结构体

使用指针和一个 `bool` 表示值是否定义，底层原理跟指针方案一样。

当 `Defined` 为 `false` 时，表示未传入或传入 null；当 `Defined` 为 `true` 时且 `Value` 为零值时，表示零值。

同样无法区分未传入和传入 null，示例如下：

```go
type jsonStruct[T any] struct {
	Defined bool
	Value   *T
}

func TestStruct(t *testing.T) {
	normalValueJSON := []byte(`{"Value": true}`)
	var normalValue jsonStruct[bool]
	err := json.Unmarshal(normalValueJSON, &normalValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(*normalValue.Value) // true

	zeroValueJSON := []byte(`{"Value": false}`)
	var zeroValue jsonStruct[bool]
	err = json.Unmarshal(zeroValueJSON, &zeroValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(*zeroValue.Value) // false

	noPassInJSON := []byte(`{}`)
	var noPassIn jsonStruct[bool]
	err = json.Unmarshal(noPassInJSON, &noPassIn)
	if err != nil {
		log.Fatal(err)
	}
	if noPassIn.Defined == false {
		fmt.Println("no pass in or null")
	} else {
		fmt.Println(*noPassIn.Value)
	}

	nullValueJSON := []byte(`{"Value": null}`)
	var nullValue jsonStruct[bool]
	err = json.Unmarshal(nullValueJSON, &nullValue)
	if err != nil {
		log.Fatal(err)
	}
	if nullValue.Defined == false {
		fmt.Println("no pass in or null")
	} else {
		fmt.Println(*nullValue.Value)
	}
}

func (j *jsonStruct[T]) UnmarshalJSON(data []byte) error {
	type tempStruct struct {
		Value *T
	}

	var temp tempStruct
	err := json.Unmarshal(data, &temp)
	if err != nil {
		return err
	}

	if temp.Value != nil {
		j.Defined = true
	}

	j.Value = temp.Value
	return nil
}
```

## 解决方案 3：两段式解码

第一次先解码到 `json.RawMessage`，第二次再解码到具体的类型。

通过 `json.RawMessage` 可以判断到底是正常值、零值、未传入还是 null。示例如下：

```go
func TestRaw(t *testing.T) {
	type jsonStruct struct {
		Value json.RawMessage
	}

	normalValueJSON := []byte(`{"Value": true}`)
	var normalRawValue jsonStruct
	err := json.Unmarshal(normalValueJSON, &normalRawValue)
	if err != nil {
		log.Fatal(err)
	}
	var normalValue bool
	err = json.Unmarshal(normalRawValue.Value, &normalValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(normalValue) // true

	zeroValueJSON := []byte(`{"Value": false}`)
	var zeroRawValue jsonStruct
	err = json.Unmarshal(zeroValueJSON, &zeroRawValue)
	if err != nil {
		log.Fatal(err)
	}
	var zeroValue bool
	err = json.Unmarshal(zeroRawValue.Value, &zeroValue)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(zeroValue) // false

	noPassInJSON := []byte(`{}`)
	var noPassInRaw jsonStruct
	err = json.Unmarshal(noPassInJSON, &noPassInRaw)
	if err != nil {
		log.Fatal(err)
	}
	if noPassInRaw.Value == nil {
		fmt.Println("no pass in")
	} else {
		fmt.Println(noPassInRaw.Value)
	}

	nullValueJSON := []byte(`{"Value": null}`)
	var nullValueRaw jsonStruct
	err = json.Unmarshal(nullValueJSON, &nullValueRaw)
	if err != nil {
		log.Fatal(err)
	}
	if string(nullValueRaw.Value) == "null" {
		fmt.Println("null")
	} else {
		fmt.Println(nullValueRaw.Value)
	}
}
```

## 参考链接

[Unmarshalling JSON with Null Boolean Values in Go](https://biscuit.ninja/posts/unmarshalling-json-with-null-booleans-in-go/ "Unmarshalling JSON with Null Boolean Values in Go")

[JSON field set to null vs field not there](https://stackoverflow.com/questions/36601367/json-field-set-to-null-vs-field-not-there "JSON field set to null vs field not there")