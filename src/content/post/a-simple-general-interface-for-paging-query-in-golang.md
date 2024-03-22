---
title: "一个简单的 Golang 分页查询通用接口"
pubDate: 2020-11-18T23:22:11+08:00
lastmod: 2020-11-18T23:22:11+08:00
keywords: []
description: ""
categories: [Golang]

---

本文介绍了一个简单的 Golang 分页查询通用接口。

![Golang Logo](/images/a-simple-general-interface-for-paging-query-in-golang/golang-logo.webp "Golang Logo")

```go
// PageIterator 分页查询接口
type PageIterator interface {
	// Has 查询是否还有下一页
	Has() bool
	// Next 获取下一页
	Next() (int, int)
}

// pageIterator 实现 PageIterator 接口
type pageIterator struct {
	total int
	max   int
	cur   int
}

// Has 查询是否还有下一页
func (p *pageIterator) Has() bool {
	return p.cur*p.max < p.total
}

// Next 获取下一页
func (p *pageIterator) Next() (int, int) {
	offset := p.cur * p.max
	limit := min((p.cur+1)*p.max, p.total)
	p.cur++
	return offset, limit
}

func min(x, y int) int {
	if x < y {
		return x
	}
	return y
}

// NewPageIterator 新建分页查询迭代器
func NewPageIterator(total, max int) PageIterator {
	return &pageIterator{total: total, max: max, cur: 0}
}

const pageSize = 500

// Do 将数据分成每份不超过 pageSize，分别进行处理，直到没有数据
func Do(total int, call func(offset, limit int) error) error {
	iterator := NewPageIterator(total, pageSize)
	for iterator.Has() {
		if err := call(iterator.Next()); err != nil {
			return err
		}
	}
	return nil
}
```

详细说明请看代码注释。