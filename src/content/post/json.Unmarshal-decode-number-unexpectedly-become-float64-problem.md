---
title: "json.Unmarshal 解码数字意外变为 float64 问题"
pubDate: 2025-05-09T16:17:24+08:00
lastmod: 2025-05-09T16:17:24+08:00
keywords: []
description: ""
categories: [Golang]

---

## 问题

在上一个项目 [listdb](https://www.upwork.com/jobs/~018db314725bf3f8f2 "listdb") 中，客户希望通过 any 类型来收集多种类型的值，并且需要兼容超出 math.MaxUint64 的数字。

但使用 json.Unmarshal 解码数字类型到 any 类型时，会默认变为 float64，如：

```go
func TestNumber(t *testing.T) {
	jsonStruct := map[string]int64{"Int": 1}
	jsonBytes, err := json.Marshal(jsonStruct)
	if err != nil {
		fmt.Println("marshal err:", err)
	}
	fmt.Println("jsonBytes:", string(jsonBytes)) // jsonBytes: {"Int":1}

	var jsonDecodeStruct map[string]any
	err = json.Unmarshal(jsonBytes, &jsonDecodeStruct)
	if err != nil {
		fmt.Println("unmarshal err:", err)
	}

	// dec := json.NewDecoder(bytes.NewReader(jsonBytes))
	// dec.UseNumber()
	// err = dec.Decode(&jsonDecodeStruct)
	// if err != nil {
	// 	fmt.Println("decode err:", err)
	// }

	fmt.Println("jsonDecodeStruct:", jsonDecodeStruct) // jsonDecodeStruct: map[Int:1]
	fmt.Printf("Int type = %T\n", jsonDecodeStruct["Int"]) // Int type = float64
}
```

## 解决方案

使用注释的 json.NewDecoder 和 UseNumber 替换 json.Unmarshal 来解决。

类型会变为 json.Number，底层类型为 string。

这同样适用于 big.Int 类型，如：

```go
func TestNumber(t *testing.T) {
	bigInt := big.NewInt(0)
	bigInt.SetString("144445436745653633243543634375134532532", 10)

	jsonStruct := map[string]*big.Int{"Int": bigInt}
	jsonBytes, err := json.Marshal(jsonStruct)
	if err != nil {
		fmt.Println("marshal err:", err)
	}
	fmt.Println("jsonBytes:", string(jsonBytes))

	var jsonDecodeStruct map[string]any
	dec := json.NewDecoder(bytes.NewReader(jsonBytes))
	dec.UseNumber()
	err = dec.Decode(&jsonDecodeStruct)
	if err != nil {
		fmt.Println("decode err:", err)
	}

	fmt.Println("jsonDecodeStruct:", jsonDecodeStruct)
	fmt.Printf("Int type = %T\n", jsonDecodeStruct["Int"])
}
```

类型同样是 json.Number。

## 参考链接

[json package - encoding/json - Go Packages](https://pkg.go.dev/encoding/json#Decoder.UseNumber "json package - encoding/json - Go Packages")