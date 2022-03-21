---
title: "Golang 查找整个数据库中存在的数据类型"
date: 2021-06-15T23:52:45+08:00
lastmod: 2021-06-15T23:52:45+08:00
keywords: []
description: ""
categories: [Database]

---

因为公司架构的变更，需要根据业务来迁移数据库中的数据，而迁移接口需要根据数据库用到的数据类型来读取和写入，所以需要用 Golang 查找整个数据库中存在的数据类型。

<!--more-->

![Database Logo](/images/golang-find-data-types-present-in-entire-database/database-logo.webp "Database Logo")

整体流程为：

1. 根据数据库名获取其所有表；
2. 取出每个表中每个列的数据类型；
3. 将所有表的数据类型汇总起来；
4. 去除重复的数据类型。

具体代码如下：

```go
// GetColumnType 查找整个数据库中存在的数据类型
func GetColumnType(db *gorm.DB, schema string) []string {
	tableList := getTableList(db, schema)
	// 对每个需要处理的表
	var allColumnType []string
	for _, table := range tableList {
		// 处理表
		columnType, err := getColumnTypeByTable(db, table)
		if err != nil {
			log.Fatal(err)
		}
		allColumnType = append(allColumnType, columnType...)
	}
	return deduplication(allColumnType)
}

// getTableList 根据数据库名获取其所有表
func getTableList(db *gorm.DB, schema string) []string {
	var tableList []string
	db.Table("information_schema.TABLES").Where("table_schema = `%s`", schema).Pluck("table_name", tableList)
	return tableList
}

// getColumnTypeByTable 获取表中每列的数据类型
func getColumnTypeByTable(db *gorm.DB, table string) ([]string, error) {
	// 生成单个表读取数据的 sql
	readSQL := fmt.Sprintf("SELECT * FROM `%s`", table)
	// 读取数据
	// 不用考虑 ErrRecordNotFound 错误，因为不用结构去查询不会报这个错误
	rows, err := db.Raw(readSQL).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// 返回列名
	cols, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	// 返回列的类型
	colTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}
	// 创建列数量的切片
	var items = make([]interface{}, len(cols))
	// 设置切片中每个元素为空接口指针
	for k := range items {
		var p interface{}
		items[k] = &p
	}
	var columnType []string
	for rows.Next() {
		// 对每一行扫描进 items
		err := rows.Scan(items...)
		if err != nil {
			return nil, err
		}
		// 对每一行中的每一列
		for i := range items {
			columnType = append(columnType, colTypes[i].DatabaseTypeName())
		}
	}
	return columnType, err
}

// deduplication 去除重复的类型
func deduplication(allTypes []string) []string {
	m := make(map[string]struct{}, 0)
	for _, v := range allTypes {
		m[v] = struct{}{}
	}
	var typeList []string
	for k := range m {
		typeList = append(typeList, k)
	}
	return typeList
}
```