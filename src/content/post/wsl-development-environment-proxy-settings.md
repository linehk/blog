---
title: "WSL 开发环境代理设置"
pubDate: 2020-10-13T19:25:12+08:00
lastmod: 2020-10-13T19:25:12+08:00
keywords: []
description: ""
categories: [Misc]

---

因为最近把开发环境换成了 Windows 和 WSL 的组合，而 WSL 下面的代理设置太繁琐，所以写了这篇博客来记录。

![WSL Logo](/images/wsl-development-environment-proxy-settings/wsl-logo.webp "WSL Logo")

## 步骤

1. 在代理软件上开启允许局域网链接；
2. 找到 Windows 主机的 IP；
3. 设置代理为 Windows 主机的 IP。

前两步都是通用的，只有第三步需要根据不同的程序来设置。

## 命令行程序

命令行程序通常会遵循 Linux 的规范，使用类似于 `http_proxy` 的环境变量。如：cURL、Wget。所以只需要 `export` 一些常用的环境变量。

## Git

Git 分成 HTTP 和 SSH 的连接方式：

* 通过 `git config` 设置 HTTP 代理；
* 通过修改 `~/.ssh/config` 文件来设置 SSH 代理。

## 专用软件

专用软件一般可以用自身的命令行来设置代理。如：npm、Yarn。

## APT

APT 使用代理需要修改 `/etc/apt/apt.conf.d/proxy.conf`。

## 具体代码

以下为模块化后的全部代码，有详细的注释。

可以提取为命令使用，也可以放入 `shell` 配置文件（如：`.bashrc、.zshrc`）中使用。

运行 `set_proxy` 即可一键开启全部代理。

```shell
# 设置代理
set_proxy() {
	get_windows_ip
	set_proxy_environment_variable
	set_git_proxy
	set_npm_proxy
	set_yarn_proxy
	set_apt_proxy
}

# 取消代理设置
unset_proxy() {
	unset_proxy_environment_variable
	unset_git_proxy
	unset_npm_proxy
	unset_yarn_proxy
	unset_apt_proxy
}

# 获取 Windows IP
get_windows_ip() {
	export windows_ip=$(ip route | grep default | awk '{print $3}')
}

# 设置常见的环境变量
set_proxy_environment_variable() {
	export host="8081"
	export sock_proxy="socks5://${windows_ip}:${host}"
	export http_proxy="http://${windows_ip}:${host}"
	export ssh_proxy="${windows_ip}:${host}"

	# 系统环境变量
	export ALL_PROXY="${sock_proxy}"
	export all_proxy="${sock_proxy}"
	export http_proxy="${http_proxy}"
	export HTTP_PROXY="${http_proxy}"
	export https_proxy="${http_proxy}"
	export HTTPS_PROXY="${http_proxy}"
	export ftp_proxy="${http_proxy}"
	export FTP_PROXY="${http_proxy}"
	export rsync_proxy="${http_proxy}"
	export RSYNC_PROXY="${http_proxy}"
}

# 取消环境变量设置
unset_proxy_environment_variable() {
	unset ALL_PROXY
    unset all_proxy
	unset http_proxy
    unset HTTP_PROXY
    unset https_proxy
    unset HTTPS_PROXY
    unset ftp_proxy
    unset FTP_PROXY
    unset rsync_proxy
    unset RSYNC_PROXY
}

# 设置 Git 代理，包括 HTTP 和 SSH 方式
set_git_proxy() {
	# 通过命令行设置 HTTP 代理
    git config --global http.https://github.com.proxy ${PROXY_HTTP}
	# 修改配置文件来设置 SSH 代理
	# 如果是第一次设置，则全新写入
    if ! grep -qF "Host github.com" ~/.ssh/config; then
        echo "Host github.com" >> ~/.ssh/config
    	echo "    HostName ssh.github.com" >> ~/.ssh/config
        echo "    User git" >> ~/.ssh/config
		# 有些 VPS 不支持 SSH 默认的 22 端口号，所以要改成 433。
		echo "    Port 443" >> ~/.ssh/config
        echo "    ProxyCommand nc -X 5 -x ${ssh_proxy} %h %p" >> ~/.ssh/config
	# 如果不是第一次设置，则只在 ProxyCommand 这行替换新的 Windows IP
    else
		# 找到行号
        lino=$(($(awk '/Host github.com/{print NR}'  ~/.ssh/config)+4))
		# 替换 IP
        sed -i "${lino}c\    ProxyCommand nc -X 5 -x ${ssh_proxy} %h %p" ~/.ssh/config
    fi
}

# 取消 Git 代理设置
unset_git_proxy() {
    git config --global --unset http.https://github.com.proxy
	rm ~/.ssh/config
}

# 设置 NPM 代理
set_npm_proxy() {
	npm config set proxy ${http_proxy}
    npm config set https-proxy ${http_proxy}
}

# 取消 npm 代理设置
unset_npm_proxy() {
	npm config delete proxy
    npm config delete https-proxy
}

# 设置 Yarn 代理
set_yarn_proxy() {
    yarn config set proxy ${http_proxy}
    yarn config set https-proxy ${http_proxy}
}

# 取消 Yarn 代理设置
unset_yarn_proxy() {
    yarn config delete proxy
    yarn config delete https-proxy	
}

# 设置 APT 代理
set_apt_proxy() {
    echo "Acquire::http::Proxy \"${http_proxy}\";" | sudo tee /etc/apt/apt.conf.d/proxy.conf >/dev/null 2>&1
    echo "Acquire::https::Proxy \"${http_proxy}\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf >/dev/null 2>&1
}

# 取消 APT 代理设置
unset_apt_proxy() {
	sudo rm /etc/apt/apt.conf.d/proxy.conf
}
```

## 参考链接

[WSL2 的一些网络访问问题](https://bytem.io/posts/wsl2-network-tricks/ "WSL2 的一些网络访问问题")

[Ubuntu「一键」设置代理](https://blog.skk.moe/post/enable-proxy-on-ubuntu/ "Ubuntu「一键」设置代理")

[在 HTTPS 端口使用 SSH](https://docs.github.com/cn/authentication/troubleshooting-ssh/using-ssh-over-the-https-port "在 HTTPS 端口使用 SSH")