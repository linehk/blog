---
title: "在 Hugo 博客中添加 Google AdSense"
pubDate: 2019-06-10T18:35:30+08:00
lastmod: 2019-06-10T18:35:30+08:00
keywords: [Google AdSense, Google AdSense on Hugo]
description: "介绍了如何在 Hugo 博客中通过嵌入自定义代码来添加 Google AdSense 的详细步骤。"
categories: [Website]

---

Hugo 原生支持 Google Analytics，一些主题也支持 Baidu Analytics 和 Baidu Push，例如 even。

但对于 Google AdSense 就没有很好的支持，即便如此，我们也可以通过嵌入自定义的 HTML 代码来使用它。

![Logo](/images/add-google-adsense-to-hugo-website/logo.webp "Logo")

## 添加验证代码

首先要找到 `themes/even/layouts/partials/head.html` 这个文件。

观察这个路径，*layouts* 意为布局，*partials* 意为偏好设置，*head.html* 则表示这个文件的内容会出现在所生成的每个网页的头部，在这里插入验证代码再合适不过了。

只要是在该文件下插入，都可以生效。但是为了美观，我选择插入到 `<!-- baidu & google verification  -->` 和 `<!-- Site Generator -->` 之间：

```html
<!-- Google AdSense -->
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-1877996349803670",
    enable_page_level_ads: true
  });
</script>
```

以上这段验证代码是我的，你需要修改成你自己的才会生效。

第一行的注释是为了方便以后的 Debug，不应该删除。

重新部署网页后，就可以等待验证的通过了。

## 添加广告单元

首先要选择在哪里添加广告单元，我选择的是在每篇文章的末尾。

还是先观察这个路径 `themes/even/layouts/post/single.html`，*post* 表示跟每篇文章有关。

我选择插入到 `<!-- Copyright -->` 和 `<!-- Reward -->` 之间：

```html
<!-- Google AdSense -->
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1877996349803670" data-ad-slot="6956738551"
  data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

以上这段广告单元代码是我的，你需要修改成你自己的才会生效。

重新部署网页就可以看到在每篇文章末尾都会出现该广告单元：

![广告单元](/images/add-google-adsense-to-hugo-website/unit.webp "广告单元")