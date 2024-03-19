---
title: "Markdown 说明"
pubDate: 2017-12-08T13:26:59+08:00
lastmod: 2017-12-08T13:26:59+08:00
keywords: [Markdown 说明, Markdown 语法]
description: "使用各种简单明了的例子详细说明了 Markdown 格式的全部语法和一些小窍门。还讲解了 GitHub 特有的语法格式。"
categories: [Misc]

---

> 软件文档或者源代码文档是指与软件系统及其软件工程过程有关联的文本实体。

目前最受欢迎的软件文档格式非 Markdown 莫属，本文主要叙述的就是关于它的说明，通过本文你可以学到诸多语法细节和编写地道的 Markdown 文档的方法。

<!--more-->

![Markdown Logo](/images/markdown-explanation/markdown-logo.webp "Markdown Logo")

# Markdown 介绍

> Markdown 是一种轻量级标记语言，创始人为约翰·格鲁伯（John Gruber）。
>
> 它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档”。很适合专注于文字而非功能的方面，例如软件的文档、博客的文章等。因此也出现了许多把 Markdown 文档渲染成 HTML 文档的工具。

其中最重要的设计是可读性，也就是说这个语言应该在源码层面上易于阅读。区别于 HTML 文档更加容易修改和维护。为了更具表达力或者是满足用户的需求，出现了许多 Markdown 格式的变种。例如：GitHub 的 Markdown 格式。

这些变种常常是原版的超集，包含了很多原版没有的语法和功能，本文只关注原版基本的语法和功能。

# 更好的阅读本文

1. 在类似 `#` `1.` `*` 等前置命令后面都要加个空格使其生效。
2. 每个小标题下面先是展示语法的效果（有些片段因为重复，可能会被省略），然后在下面的代码框中是具体的实现代码。中间可能还会穿插着有关代码的说明和提示。
3. `example` 是示例文本，你可以用任意文本替换。但这不代表示例文本都是用 `example` 表示，为了可读性会使用其他文本，具体情况可关注代码框中的实现。
4. 缩进在文中代表一个 `Tab` 或四个 `Space` 。在 `soft tab` 的情况下，此两者是等价的。后面类似的情况这条规则都适用。

# 标题

```markdown
# 标题
```

## 一级标题

```markdown
# 一级标题
```

另一种一级标题的实现方式，大于或等于三个 `=` 号就可以被解析。

```markdown
一级标题
=======
```

## 二级标题

```markdown
## 二级标题
```

另一种二级标题的实现方式，大于或等于三个 `-` 号就可以被解析。

```markdown
二级标题
-------
```

## 三级标题

```markdown
### 三级标题
```

## 四级标题

```markdown
#### 四级标题
```

## 五级标题

```markdown
##### 五级标题
```

## 六级标题

```markdown
###### 六级标题
```

除一级、二级标题外，其他标题的代码实现只有一种。

标题的有效层级运用可以让文档的结构脉络更加清晰，你可以使用如下代码展现文档目录：

```markdown
[TOC]
```

# 列表

## 有序列表

1. 1
2. 2
3. 3

```markdown
1. 1
2. 2
3. 3
```

然而下面的代码也能产生同样的效果。

```markdown
2. 1
8. 2
4. 3
```

这说明前面的序号并没有影响。不过为了不产生歧义，还是使用第一种作为规范更好。

## 无序列表

* 1
* 2
* 3

```markdown
* 1
* 2
* 3
```

其中的 `*` 号可以被 `+` 或 `-` 等价替换。

## 多行列表

列表也支持多行，需要缩进。

并且子列表需要比父列表更多的缩进。

1. example

    example

2. example

    example

```markdown
1. example

    example

2. example

    example
```

## 列表内引用

* example

    > example
    >
    > example

同样需要一个 `Tab` 或四个 `Space` 来缩进。

```markdown
* example

    > example
    >
    > example
```

# 代码标记

单行（一小段）代码 `printf()` 标记：

注意：这里的 ` 是反引号，不是单引号。

```markdown
`printf()`
```

多行代码标记：

```markdown
printf()
printf()
printf()
```

`````markdown
```
printf()
printf()
printf()
```
`````

或者使用缩进。

这里的空格是全角空格，具体实现应当使用半角空格。复制粘贴不能起到应有的效果。

```markdown
　　　　printf()
　　　　printf()
　　　　printf()
```

# 引用

## 普通引用

> 这里是引用

```markdown
> 这里是引用
```

可以引用其他包含 Markdown 语法的标签。

> 1. example
> 2. example

```markdown
> # 标题
> 1. example
> 2. example
```

## 嵌套引用

> example
>
> > example
>
> > > example
>
> example

```markdown
> example
>
> > example
>
> > > example
>
> example
```

# 图片与链接

## 图片

### 图片行内式

![图片](/images/avatar.webp "title")

```markdown
[图片](/images/avatar.webp "title")
```

### 图片参考式

![图片] [pid]

[pid]: /images/avatar.webp "title"

```markdown
![图片] [pid]

[pid]: /images/avatar.webp "title"
```

## 链接

### 自动链接

直接使用 `<>` 把链接包裹起来：

<https://www.sulinehk.com/>

```markdown
<https://www.sulinehk.com/>
```

邮箱的也类似：<example@gmail.com>

```markdown
<example@gmail.com>
```

### 链接行内式

[链接](https://www.sulinehk.com/ "title")

```markdown
[链接](https://www.sulinehk.com/ "title")
```

### 链接参考式

[链接] [id]

[id]: https://www.sulinehk.com/ "title"

```markdown
[链接] [id]

[id]: https://www.sulinehk.com/ "title"
```

* 其中，`title` 为鼠标指向 `链接` 或 `图片` 时出现的文字。
* 第二行代码可出现在 Markdown 文档的任意位置，`id` 为任意标识符，引导至第二行代码。
* 在一个文档里面需大量使用图片或链接时，建议使用参考式，这样更易于管理和更新。

# 粗体与斜体

## 粗体

**粗体**

```markdown
**粗体**
__粗体__
```

## 斜体

*斜体*

```markdown
*斜体*
_斜体_
```

# 表格

| Table1 | Table2  | Table3   |
| ------ |:-------:| --------:|
|   a    |    1    |   one    |
|   b    |    2    |   two    |
|   c    |    3    |   three  |

```markdown
| Table1 | Table2  | Table3   |
| ------ |:-------:| --------:|
|   a    |    1    |   one    |
|   b    |    2    |   two    |
|   c    |    3    |   three  |
```

表格的实现格式有更多复杂繁琐的规则，这里不进行更多的概述。

# 分隔线

在一行内有大于或等于三个的 `*` `-` `_` 符号且没有其他内容（空格除外）就可以建立一条分隔线。

***

```markdown
***
*****
* * *
---
___
```

# 删除线

~~example~~

```markdown
~~example~~
```

# 反斜杠

\*

```markdown
\需要转义的符号（如*）
```

这样可以避免 Markdown 解析某些字符。

反斜杠支持的符号列表：

```plaintext
\   反斜线
`   反引号
*   星号
_   底线
{}  花括号
[]  方括号
()  括弧
#   井字号
+   加号
-   减号
.   英文句点
!   惊叹号
```

# 复选框列表（github 特有)

* `[x]` `[ ]` 分别表示选中和未选中
* `[x]` `[ ]` 后有个空格
* `[ ]` 中有个空格

* [x] Python
* [x] Go
* [ ] Lisp
* [ ] Ruby

```markdown
* [x] Python
* [x] Go
* [ ] Lisp
* [ ] Ruby
```

# 扩展阅读

[Markdown 编写规范](https://github.com/fex-team/styleguide/blob/master/markdown.md "Markdown 编写规范")

[中文文案排版指北](https://mazhuang.org/wiki/chinese-copywriting-guidelines/ "中文文案排版指北")