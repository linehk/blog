---
title: "【转】Google 技术面试经验总结"
pubDate: 2019-01-23T18:45:49+08:00
lastmod: 2019-01-23T18:45:49+08:00
keywords: [Google 技术面试, 技术面试, 算法题, 边界条件测试]
description: "总结了 Google 技术面试的流程和经验，还举了几个 leetcode 上的例子来说明边界条件测试。"
categories: [Misc]

---

古人云：取乎其上，得乎其中；取乎其中，得乎其下；取乎其下，则无所得矣。

<!--more-->

![LeetCode Logo](/images/how-to-crack-google-coding-interview/leetcode-logo.webp "LeetCode Logo")

## 面试流程

1. 在线评定：一到两个算法题，通过分享 Google Docs 链接的方式来让你输入代码。
2. 电话面试：共有两轮，一轮一个工程师打电话，也是通过分享链接的方式。
3. 现场面试：邀请到 Google 办公室，面试一天，大概 4 轮，包含算法和系统设计。

## 技巧

1. 练习在 Google Docs 或白板上写代码或者手写代码

2. 练习在有时间限制的情况下编写代码

    一轮大概有 45 分钟:

    1. 5 分钟：介绍自己或简历
    2. 5-10 分钟：思考题目
    3. 20-25 分钟：编写代码
    4. 5 分钟：测试

3. 练习一边写代码一边跟面试官讲解思路

    这样在思路不是很顺畅的时候可以得到提示，不能不说话。

4. 练习人工测试代码

    写完后把代码放在脑子里过一遍。

5. 练习编写边界条件测试

    1. 预期的输入
    2. 空输入
    3. 空指针输入
    4. 异常输入
    5. 大输入
    6. 其他边界条件

    例子: 反转链表（[leetcode-206-反转链表](https://leetcode-cn.com/problems/reverse-linked-list/ "leetcode-206-反转链表")）

    1. 常规情况: 带有 5 个元素的正常链表
    2. 边界条件:
        * 1 个元素的链表
        * 0 个元素的链表
        * 空指针
        * 长链表
    3. 特殊情况: 有环的链表

6. 澄清面试官的问题

    例子: 正则表达式匹配 ([leetcode-10-正则表达式匹配](https://leetcode-cn.com/problems/regular-expression-matching/ "leetcode-10-正则表达式匹配"))

    应该问的问题:

    1. 输入只有字母吗？
    2. 输入包含点号和星号吗？
    3. 匹配字符串是格式良好的吗？

7. 从简单的暴力实现开始

    例子: 搜索二维矩阵 ([leetcode-240-搜索二维矩阵II](https://leetcode-cn.com/problems/search-a-2d-matrix-ii/ "leetcode-240-搜索二维矩阵II"))

8. 计算每一个算法的时间复杂度和空间复杂度

## 期待

1. 代码的正确性
2. 代码的质量
3. 手写代码的话字迹要清晰

## 参考链接

本文总结自视频 [Google谷歌技术面试经验分享 | Google软件工程师 | StyleInBeta](https://www.bilibili.com/video/av41269529 "Google谷歌技术面试经验分享 | Google软件工程师 | StyleInBeta")