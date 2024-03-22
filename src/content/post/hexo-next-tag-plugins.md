---
title: "Hexo 和 NexT 的标签插件"
pubDate: 2018-01-28T21:36:25+08:00
lastmod: 2018-01-28T21:36:25+08:00
keywords: [Hexo 主题, Hexo 插件, Hexo 标签插件, NexT 主题, NexT 标签插件]
description: "介绍了如何通过使用 Hexo 和 NexT 的标签插件来让你的博客富有吸引力。"
categories: [Website]

---

标签插件（内置标签）用于在 Hexo 和 NexT 的 Markdown 文档中插入某些特定内容，用来弥补原生 Markdown 文档的功能。

比如，Markdown 文档的图片引用不支持改变图片的显示大小，Hexo 中就可以用 `img` 标签来改变。

![Hexo Logo](/images/hexo-next-tag-plugins/hexo-logo.webp "Hexo Logo")

## Hexo 的标签插件

其中，大多数 `[]` 中的内容是可选的。

### 引用块

```markdown
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

### 代码块

```markdown
{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}
```

### Pull Quote（醒目引文）

```markdown
{% pullquote [class] %}
content
{% endpullquote %}
```

### jsFiddle

[jsFiddle](https://jsfiddle.net/ "jsFiddle") 是一个前端代码在线演示的网站。

```markdown
{% jsfiddle shorttag [tabs] [skin] [width] [height] %}
```

### Gist

由 GitHub 提供的包括但不限于记录代码片段的服务。

```markdown
{% gist gist_id [filename] %}
```

### iframe

在 Markdown 文档中插入 HTML 的 `<iframe>` 标签。

```markdown
{% iframe url [width] [height] %}
```

### Image

Markdown 文档不支持引用图片时修改图片的大小，Hexo 提供 `img` 标签来实现这个功能。

```markdown
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
```

### Link

插入链接，并自动给外部链接添加在新窗口打开的属性。

```markdown
{% link text url [external] [title] %}
```

### Include Code

插入 `/source` 文件夹内的代码文件，且支持标注语言种类。

```markdown
{% include_code [title] [lang:language] path/to/file %}
```

### Youtube

插入 Youtube 视频，需提供 `video_id`。

```markdown
{% youtube video_id %}
```

### Vimeo

插入 Vimeo 视频，同样需提供 `video_id`。

```markdown
{% vimeo video_id %}
```

### 引用文章

引用其他文章的链接，支持文章相对路径和文章链接两种方式。

```markdown
{% post_path slug %}
{% post_link slug [title] %}
```

### 引用资源

在 Hexo 中打开文章资源文件夹的功能后，Markdown 原生的引用资源方法就不再适用于这些文章资源了。
正确的引用这些资源的方式是通过下面这些标签来引用。

```markdown
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```

### Raw

在文章中插入 `Swig` 标签时，可以通过 `Raw` 标签来防止解析错误。

```markdown
{% raw%}
content
{% endraw%}
```

## NexT 的內建标签

### 文本居中的引用

```markdown
<blockquote class="blockquote-center"> 苟利国家生死以，岂因祸福趋避之。 </blockquote>

{% centerquote %} 苟利国家生死以，岂因祸福趋避之。 {% endcenterquote %}

{% cq %}  苟利国家生死以，岂因祸福趋避之。  {% endcq %}
```

以上三种方式分别是：

1. 直接在 Markdown 文档中编写 HTML 来调用的 HTML 方式。
2. 要求 Hexo 版本大于或等于 0.4.5 的标签方式。
3. 同样有版本要求的标签别名方式。

### 突破容器宽度限制的图片

```markdown
<img src="/image-url" class="full-image" />

{% fullimage /image-url, alt, title %}

{% fi /image-url, alt, title %}
```

三种方式同上。

### Bootstrap Callout

```markdown
{% note danger %} content {% endnote %}
```

其中，danger 可以为 `default`、`primary`、`success`、`info`、`warning`、`danger`。

详情查看 [Bootstrap 中文文档](https://v4.bootcss.com/ "Bootstrap 中文文档")。

## 参考链接

[Hexo 标签插件文档](https://hexo.io/zh-cn/docs/tag-plugins "Hexo 标签插件文档")

[NexT 内置标签文档](https://theme-next.iissnan.com/tag-plugins.html "NexT 内置标签文档")