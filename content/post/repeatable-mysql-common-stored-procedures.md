---
title: "可重复执行的 MySQL 常用存储过程"
date: 2021-04-16T16:23:08+08:00
lastmod: 2021-04-16T16:23:08+08:00
keywords: []
description: ""
categories: [Database]

---

因为公司内部的 SQL 提交系统规定，在一个环境内可能会多次执行同一条 SQL，所以需要保证 SQL 的可重复执行性。

这样就可以把常用的一些 SQL 写成存储过程，并使其可重复执行，会比较方便。

<!--more-->

![MySQL Logo](/images/repeatable-mysql-common-stored-procedures/mysql-logo.webp "MySQL Logo")

## 创建列

```sql
CREATE PROCEDURE `CreateColumnIfNotExists` (
	tableName VARCHAR(100), 
	columnName VARCHAR(100), 
	dbType VARCHAR(100)
)
BEGIN
	DECLARE _tableCount INT;
	DECLARE _columnCount INT;
	-- 检查该表是否已存在
	SET _tableCount = (
		SELECT COUNT(1)
		FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_SCHEMA = (
				SELECT SCHEMA()
			)
			AND TABLE_NAME = tableName
	);
	-- 检查该列是否已存在
	SET _columnCount = (
		SELECT COUNT(1)
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = (
				SELECT SCHEMA()
			)
			AND TABLE_NAME = tableName
			AND COLUMN_NAME = columnName
	);
	-- 表存在，列不存在的时候才创建新列
	IF _tableCount = 1
	AND _columnCount = 0 THEN
		SET @_sqlText = CONCAT(' ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', dbType, ' NULL;');
		PREPARE stmt1 FROM @_sqlText;
		EXECUTE stmt1;
		-- 释放资源
		DEALLOCATE PREPARE stmt1;
	END IF;
END
```

## 创建索引

```sql
CREATE PROCEDURE `CreateIndexIfNotExists` (
	tableName varchar(100), 
	columnName varchar(100)
)
BEGIN
	DECLARE _tableCount INT;
	DECLARE _indexCount INT;
	SET _tableCount = (
		SELECT COUNT(1)
		FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_SCHEMA = (
				SELECT schema()
			)
			AND TABLE_NAME = tableName
	);
	SET _indexCount = (
		SELECT COUNT(1)
		FROM information_schema.statistics
		WHERE TABLE_SCHEMA = (
				SELECT schema()
			)
			AND TABLE_NAME = tableName
			AND INDEX_NAME = concat('IX_', columnName)
	);
	IF _tableCount = 1
	AND _indexCount = 0 THEN
		SET @_sqlText = CONCAT(' CREATE INDEX `IX_', columnName, '` ON `', tableName, '`(`', columnName, '` ASC);');
		PREPARE stmt1 FROM @_sqlText;
		EXECUTE stmt1;
		DEALLOCATE PREPARE stmt1;
	END IF;
END
```

## 创建 Unique 索引

```sql
CREATE PROCEDURE `CreateUniqueIndexIfNotExists` (
	IN tableName VARCHAR(200), 
	IN indexName VARCHAR(200), 
	IN columnName VARCHAR(200)
)
BEGIN
	DECLARE _tableCount INT;
	DECLARE _indexCount INT;
	SET _tableCount = (
		SELECT COUNT(1)
		FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_SCHEMA = (
				SELECT SCHEMA()
			)
			AND TABLE_NAME = tableName
	);
	SET _indexCount = (
		SELECT COUNT(1)
		FROM information_schema.statistics
		WHERE TABLE_SCHEMA = (
				SELECT SCHEMA()
			)
			AND TABLE_NAME = tableName
			AND INDEX_NAME = CONCAT('IX_', indexName)
	);
	IF _tableCount = 1
	AND _indexCount = 0 THEN
		SET @_sqlText = CONCAT(' CREATE UNIQUE INDEX `IX_', indexName, '` ON `', tableName, '`(', columnName, ');');
		PREPARE stmt1 FROM @_sqlText;
		EXECUTE stmt1;
		DEALLOCATE PREPARE stmt1;
	END IF;
END
```

## 删除列

```sql
CREATE PROCEDURE `DropColumnIfExists` (
	tableName varchar(100), 
	columnName varchar(100)
)
BEGIN
	DECLARE _count INT;
	SET _count = (
		SELECT COUNT(1)
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = (
				SELECT schema()
			)
			AND TABLE_NAME = tableName
			AND COLUMN_NAME = columnName
	);
	IF _count = 1 THEN
		SET @_sqlText = CONCAT(' ALTER TABLE ', tableName, ' DROP COLUMN ', columnName, ' ;');
		PREPARE stmt1 FROM @_sqlText;
		EXECUTE stmt1;
		DEALLOCATE PREPARE stmt1;
	END IF;
END
```

## 删除索引

```sql
CREATE PROCEDURE `DropIndexIfExists` (
	tableName varchar(100), 
	columnName varchar(100)
)
BEGIN
	DECLARE _count INT;
	SET _count = (
		SELECT COUNT(1)
		FROM information_schema.statistics
		WHERE TABLE_SCHEMA = (
				SELECT schema()
			)
			AND TABLE_NAME = tableName
			AND INDEX_NAME = concat('IX_', columnName)
	);
	IF _count = 1 THEN
		SET @_sqlText = CONCAT(' DROP INDEX `IX_', columnName, '` ON `', tableName, '`; ');
		PREPARE stmt1 FROM @_sqlText;
		EXECUTE stmt1;
		DEALLOCATE PREPARE stmt1;
	END IF;
END
```