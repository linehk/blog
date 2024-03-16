---
title: "Hexo 博客的备份和恢复"
pubDate: 2018-02-03T22:08:50+08:00
lastmod: 2018-02-03T22:08:50+08:00
keywords: [Hexo 博客备份, Hexo 博客恢复]
description: "介绍了 Hexo 博客备份和恢复的详细步骤。"
categories: [Website]

---

在使用 Hexo 和 GitHub 组合进行博客写作时，有些时候会希望能够多平台工作或者备份数据。

我们可以通过在 GitHub 设置两个分支，将 Hexo 生成的静态文件和 Hexo 源文件区分开来，这样就可以实现多平台工作或者备份数据。

<!--more-->

![Hexo and GitHub Page Logo](/images/hexo-backup-reset/hexo-and-github-logo.webp "Hexo and GitHub Page Logo")

## 分支设置

建立两个分支，分别是 `master` 分支和 `hexo` 分支。并且在 GitHub 上将 hexo 分支设置为默认分支。

两个分支的功能分别如下：

* `master` 分支用于保存 Hexo 生成的静态文件。
* `hexo` 分支用于保存 Hexo 源文件。

建立这两个分支后，需要修改 `_config.yml` 里面的 `deploy` 选项来正常运行。这里直接给出我的相关设置代码：

```yaml
deploy:
- type: git
  repo:
    github: git@github.com:sulinehkblog/sulinehkblog.github.io.git
  branch: master
```

**注意：yaml 格式要求相当严格。例如冒号后需要紧接一个空格，否则会出错**。

## 安全和便利设置

在安全方面，在将 Hexo 本身上传到 GitHub 上时，默认会将所有的文件一起上传，包括类似 Google Analytics、Google Adsense 和百度统计有关的密码。这些密码通常保存在 Hexo 目录下的 `_config.yml` 或主题目录下的同名文件中。

在便利方面，上传 `node_modules` 目录下的诸多插件文件不太合适。因为这个目录下的文件只要有 `package.json` 文件就可以通过在当前目录执行 `npm install` 进行恢复。

上述问题都可以通过修改 `.gitignore` 文件，忽略上传某些文件来解决。`.gitignore` 文件的书写方式在这里可以学习更多[忽略特殊文件 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013758404317281e54b6f5375640abbb11e67be4cd49e0000 "忽略特殊文件 - 廖雪峰的官方网站")，这里也给出我的文件内容和相关注释。

```txt
# 静态文件
public/
# node 插件文件
node_modules/
# json 文件
/package-lock.json
/db.json
# 包含密码的配置文件
/_config.yml
/themes/next/_config.yml
```

还需要把 `/_config.yml` 和 `/themes/next/_config.yml` 两个文件加密保存起来才能够达到完全备份的目的。使用 `zip` 加密压缩是个不错的选择。

## 日常操作的改变

将 Hexo 生成的静态文件和 Hexo 源文件区分开后，日常的操作会多出一些步骤。

下面通过展示新添加一个 post 的全部操作来说明：

```shell
hexo new post 'testpost' # 或者直接在 source/_posts/ 目录下新建 Markdown 文档
git status # 查看 git 仓库的变化
git add . # 添加全部修改到寄存区
git commit -m 'changed' # 提交
git push origin hexo # 推送到远程仓库的 hexo 分支
```

以上只是完成了 Hexo 源文件的备份，下面跟正常的操作类似，将静态文件部署：

```shell
hexo clean # 清理缓存
hexo g # 生成静态文件
hexo d # 部署（跟 _config.yml 文件中的 deploy 选项相关）
```

至此就完成了新建一个 post 的操作。

你可以编写一个 `Shell` 脚本来简化这个过程。

## Hexo 博客恢复步骤

本地的 Hexo 文件因为某些原因丢失后，经过上面的备份处理，就可以很简单的进行恢复。下面的操作假设你已经安装好了 `git`、`nodejs`、`npm`、`hexo` 等工具。

```shell
git clone git@github.com:example/example.github.io.git hexo # 直接克隆远程仓库
cd hexo # 进入克隆后的目录
unzip _config.zip # 解压前面加密保存好的两个配置文件并移动到原来的位置
npm install # 利用 package.json 文件安装相关插件
```

以上便完成了恢复的工作。