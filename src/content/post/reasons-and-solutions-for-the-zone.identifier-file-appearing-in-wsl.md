---
title: "WSL 中出现 :Zone.Identifier 文件的原因和解决方法"
pubDate: 2021-10-15T13:55:21+08:00
lastmod: 2021-10-15T13:55:21+08:00
keywords: []
description: ""
categories: [Misc]

---

因为使用 Windows 和 WSL 作为开发环境，经常出现 :Zone.Identifier 文件，所以写了这篇博客来记录其原因和解决方法。

![WSL Logo](/images/reasons-and-solutions-for-the-zone.identifier-file-appearing-in-wsl/wsl-logo.webp "WSL Logo")

## 原因

从 Windows 直接下载文件或移动文件到 WSL 目录时，会出现类似 `:Zone.Identifier` 的文件。

其中包含了一些跟关联文件有关的元数据。

该文件因为微软的 NTFS 功能而出现，虽然没有实际用途。

但因为文件名包含 `:` 冒号，所以可能会破坏某些 Linux 脚本的运行。

所以需要处理它。

## 解决方法

* 移动文件时，不要通过资源管理器，而是通过 VS Code，这样不会生成该文件；
* 通过这条命令删除该文件：`find . -name "*:Zone.Identifier" -type f -delete`。

## 参考链接

[Zone.Identifier Files when copying from Windows to WSL filestructure #4609](https://github.com/microsoft/WSL/issues/4609 "Zone.Identifier Files when copying from Windows to WSL filestructure #4609")

[Zone.Identifier Files when downloading from Windows to WSL file structure #7456](https://github.com/microsoft/WSL/issues/7456 "Zone.Identifier Files when downloading from Windows to WSL file structure #7456")

[WSL2: Find and Delete Zone.Identifier files](https://cloudbytes.dev/snippets/wsl2-find-and-delete-zoneidentifier-files "WSL2: Find and Delete Zone.Identifier files")