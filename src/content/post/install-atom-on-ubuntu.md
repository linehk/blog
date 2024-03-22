---
title: "在 Ubuntu 上安装 Atom 并配置插件"
pubDate: 2018-02-01T18:57:03+08:00
lastmod: 2018-02-01T18:57:03+08:00
keywords: [Atom 编辑器安装卸载, Atom 配置插件, Ubuntu 上安装 Atom, Atom 设置缩进]
description: "介绍了 Atom 编辑器在 Ubuntu 上的安装和卸载方法、缩进设置。并通过设置淘宝镜像加快速度。还推荐和介绍了几款常用的 Atom 插件和主题。"
categories: [Ubuntu]

---

Atom 是 GitHub 专门为程序员推出的一个跨平台文本编辑器。

![Atom Logo](/images/install-atom-on-ubuntu/atom-logo.webp "Atom Logo")

## Ubuntu 上的安装和卸载

### 安装

```shell
sudo add-apt-repository ppa:webupd8team/atom
sudo apt update
sudo apt install atom
```

或者直接到 [Atom 官网](https://atom.io/ "Atom 官网") 下载 `.deb` 文件，用这个命令安装：

```shell
sudo dpkg -i atom.deb
```

如果出现依赖问题，使用命令修复：

```shell
sudo apt install -f
```

### 卸载

```shell
sudo apt remove atom
sudo add-apt-repository --remove ppa:webupd8team/atom
sudo apt autoremove
```

## 设置淘宝镜像

```shell
apm config set registry https://registry.npm.taobao.org
```

## 编辑器设置（缩进）

菜单栏: `Edit->Preference`：

![Atom Preference 选项](/images/install-atom-on-ubuntu/atom-preference.webp "Atom Preference 选项")

然后点击 `Editor` 选项：
![Atom Editor 选项](/images/install-atom-on-ubuntu/atom-editor.webp "Atom Editor 选项")

* 关闭 `Atomic Soft Tabs`：![关闭 Atomic Soft Tabs](/images/install-atom-on-ubuntu/close-atomic-soft-tabs.webp "关闭 Atomic Soft Tabs")
* 打开 `Soft Tabs`：![打开 Soft Tabs](/images/install-atom-on-ubuntu/open-soft-tabs.webp "打开 Soft Tabs")
* `Tab Length` 设为 `4`：![设置 Tab Length](/images/install-atom-on-ubuntu/set-tab-length.webp "设置 Tab Length")
* `Tab Type` 设为 `soft`：![设置 Tab Type](/images/install-atom-on-ubuntu/set-tab-type.webp "设置 Tab Type")

## 插件

### 插件安装方法

* `Edit->Preference->Install` 输入要下载的插件：![Atom 下载插件](/images/install-atom-on-ubuntu/download-plugin.webp "Atom 下载插件")
* 或者命令行输入 `apm install` 加上插件名称。

### 常用插件推荐和介绍

* `vim-mode-plus` 和 `ex-mode`

Atom 下的 Vim 实现方案，两个需要配套使用。

* `platformio-ide-terminal`

默认快捷键 `Ctrl+Shift+t` 或 `cmd+Shift+t` 在下面打开终端窗口。
或者直接点击下面的小加号新建终端窗口。

* `simplified-chinese-menu`

Atom 的中文包，大多数文本都实现了汉化。但是，本身机器配置不高的话会先显示英文再到中文。

* `minimap`

在界面显示一个本文件的缩略图，可以点击到达代码的位置。类似 SublimeText 中的代码缩略。

* `file-icons`

在文件的前面加上一个方便好看的小图标。

* `markdown-preview-enhanced`

使用 `Ctrl+Shift+m` 打开，要先关闭其余的 Markdown 插件。
Atom 上最好的 Markdown 插件。比官方原生插件和 `markdown-preview-plus` 都好得多。
而且还有详细的 [markdown preview enhanced 插件中文文档](https://shd101wyy.github.io/markdown-preview-enhanced/##/zh-cn/ "markdown preview enhanced 插件中文文档")。

* `autocomplete-paths`

自动补齐文件文件夹路径，详细使用情况搜索官方文档。

## 精美主题推荐

1. 以 `-ui` 结尾的为修饰界面的插件。
2. 以 `-syntax` 结尾的为修饰文件内语法颜色和样式的插件。

* set-ui
* set-syntax
* atom-material-ui
* atom-material-syntax
* dracula-ui
* dracula-syntax
* monokai
* Lucario
* obsidian-syntax