title: 创建并部署高性能 JavaScript
date: 2015-08-5 23:19:20
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-9
---
第九章 Building and Deploying High-Performance JavaScript Applications 创建并部署高性能 JavaScript
<!--more-->


第九章 Building and Deploying High-Performance JavaScript Applications 创建并部署高性能 JavaScript
---

- [Apache Ant](http://ant.apache.org/)是一个自动构建软件的工具。它类似于 make，但在 Java 中实现，并使用 XML 来描述生成过程，而 make 使用它自己的 Makefile 文件格式。Ant 是 Apache 软件基金会的一个项目：（http://www.apache.org/licenses/）。

- 预处理您的 JavaScript 源文件并不会使你的程序更快，但它允许你在代码中加入其它语言才有的一些特
性，例如用条件体插入一些测试代码，来衡量你应用程序的性能。

JavaScript 紧凑指的是剔除一个 JavaScript 文件中一切运行无关内容的过程。包括注释和不必要的空格。该处理通常可将文件尺寸缩减到一半，其结果是下载速度更快，并鼓励程序员写出更好，更详细的内联文档。

下面是一些处理紧凑的对比：
```
	jQuery 120,180 bytes
	jQuery + YUI Compressor 56,814 bytes
	jQuery + Packer 39,351 bytes
	Raw jQuery + gzip 34,987 bytes
	jQuery + YUI Compressor + gzip 19,457 bytes
	jQuery + Packer + gzip 19,228 bytes
```

- 使 HTTP 组件可缓存将大大提高用户再次访问网站时的用户体验。一个具体的例子是，加载 [Yahoo!主页](http://www.yahoo.com/)时，和不使用缓存相比，使用缓存将减少 90%的 HTTP 请求和 83%的下载字节。往返时间（从请求页面开始到第一次 onload 事件）从 2.4 秒下降到 0.9 秒。如果可能的话，你还可以考虑客户端存储机制，让 JavaScript 代码自己来处理过期。

Summary 总结
===

开发和部署过程对基于 JavaScript 的应用程序可以产生巨大影响，最重要的几个步骤如下：

- 合并 JavaScript 文件，减少 HTTP 请求的数量。
- 使用 YUI 压缩器紧凑处理 JavaScript 文件。
- 以压缩形式提供 JavaScript 文件（gzip 编码）
- 通过设置 HTTP 响应报文头使 JavaScript 文件可缓存，通过向文件名附加时间戳解决缓存问题。
- 使用内容传递网络（CDN）提供 JavaScript 文件，CDN 不仅可以提高性能，它还可以为你管理压缩和缓存。
- 所有这些步骤应当自动完成， 不论是使用公开的开发工具诸如 Apache Ant， 还是使用自定义的开发工具以实现特定需求。如果你使这些开发工具为你服务，你可以极大改善那些大量使用 JavaScript 代码的网页应用或网站的性能。
