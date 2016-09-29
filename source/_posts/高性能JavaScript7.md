title: JavaScript Ajax优化
date: 2015-08-4 14:42:31
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-7
---
**第七章 Ajax 异步 JavaScript 和 XML**
===
<!--more-->
---
> - 向服务器请求数据的五种常用技术：

- XMLHttpRequest (XHR)
- Dynamic script tag insertion 动态脚本标签插入
- iframes
- Comet
- Multipart XHR 多部分的 XHR

在现代高性能 JavaScript 中使用的三种技术是 XHR，动态脚本标签插入和多部分的 XHR。

> - 由于 XHR 提供了高级别的控制，浏览器在上面增加了一些限制。你不能使用 XHR 从当前运行的代码域之外请求数据，而且老版本的 IE 也不提供 readyState 3，它不支持流。从请求返回的数据像一个字符串或者一个 XML 对象那样对待，这意味着处理大量数据将相当缓慢。尽管有这些缺点，XHR 仍旧是最常用的请求数据技术，也是最强大的。它应当成为你的首选。

> - GET请求在IE中有长度限制，只有当URL和参数的长度超过了2048个字符时才能使用POST提取数据。

---
> - 动态脚本标签插入克服了XHR最大的限制——同源。它可以从不同的服务器上获取数据，但是因此，它也是不安全的，包括修改任何内容、将用户重定向到另一个站点，或跟踪他们在页面上的操作并将数据发送给第三方。

	var scriptElement = document.createElement('script');
	scriptElement.src = 'http://any-domain.com/javascript/lib.js';
	document.getElementsByTagName_r('head')[0].appendChild(scriptElement);
> - 多部分的XHR（MXHR）允许你只用一个 HTTP 请求就可以从服务器端获取多个资源。

---
> - 当数据只需发送给服务器时，有两种广泛应用的技术：XHR 和灯标。

虽然 XHR 主要用于从服务器获取数据， 它也可以用来将数据发回。 数据可以用 GET 或 POST 方式发回，以及任意数量的 HTTP 信息头。这给你很大灵活性。当你向服务器发回的数据量超过浏览器的最大 URL
长度时 XHR 特别有用。这种情况下，你可以用 POST 方式发回数据：

	var url = '/data.php';
	var params = [
	'id=934875',
	'limit=20'
	];
	var req = new XMLHttpRequest();
	req.onerror = function() {
		// Error.
	};
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			// Success.
		}
	};
	req.open('POST', url, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.setRequestHeader('Content-Length', params.length);
	req.send(params.join('&'));

> - 灯标是向服务器回送数据最快和最有效的方法。服务器根本不需要发回任何响应正文，所以你不必担心客户端下载数据。唯一的缺点是接收到的响应类型是受限的。如果你需要向客户端返回大量数据，那么使用 XHR。如果你只关心将数据发送到服务器端（可能需要极少的回复），那么使用图像灯标。

---
> - XML 与 JSON 相比显得非常冗杂。而且 JSON 在JavaScript可以直接简单的使用();

> 当使用 XHR 时 JSON 数据作为一个字符串返回。
该字符串使用()转换为一个本地对象。然而，当使用动态脚本标签插入时，JSON 数据被视为另一个JavaScript 文件并作为本地码执行。为做到这一点，数据必须被包装在回调函数之中。这就是所谓的“JSON填充”或 JSON-P。下面是我们用 JSON-P 格式书写的用户列表：

	parseJSON([
		{"id":1, "username":"alice", "realname":"Alice Smith", "email":"alice@alicesmith.com"},
		{"id":2, "username":"bob", "realname":"Bob Jones", "email":"bob@bobjones.com"},
		{"id":3, "username":"carol", "realname":"Carol Williams", "email":"carol@carolwilliams.com"},
		{"id":4, "username":"dave", "realname":"Dave Johnson", "email":"dave@davejohnson.com"}
	]);
　　最快的 JSON 格式是使用数组的 JSON-P 格式。虽然这只比使用 XHR 的 JSON 略快，但是这种差异随着列表尺寸的增大而增大。 如果你所从事的项目需要一个10'000或100'000个单元构成的列表， 那么JSON-P 比 JSON 好很多。
　　JSON-P 必须是可执行的 JavaScript，它使用动态
脚本标签注入技术可在任何网站中被任何人调用。从另一个角度说，JSON 在运行之前并不是有效的
JavaScript，使用 XHR 时只是被当作字符串获取。不要将任何敏感的数据编码为 JSON-P，因为你无法确定它是否包含私密信息，或者包含随机的 URL 或 cookie。

---
Summary 总结
===
---
高性能 Ajax 包括：知道你项目的具体需求，选择正确的数据格式和与之相配的传输技术。

> - 作为数据格式，纯文本和 HTML 是高度限制的，但它们可节省客户端的 CPU 周期。XML 被广泛应用普遍支持，但它非常冗长且解析缓慢。JSON 是轻量级的，解析迅速。字符分隔的自定义格式非常轻量，在大量数据集解析时速度最快，但需要编写额外的程序在服务器端构造格式，并在客户端解析。
> - 减少请求数量，可通过 JavaScript 和 CSS 文件打包，或者使用 MXHR。
> - 缩短页面的加载时间，在页面其它内容加载之后，使用 Ajax 获取少量重要文件。
> - 确保代码错误不要直接显示给用户，并在服务器端处理错误。
> - 学会何时使用一个健壮的 Ajax 库，何时编写自己的底层 Ajax 代码。

---
Ajax 是提升你网站潜在性能之最大的改进区域之一，因为很多网站大量使用异步请求，又因为它提供
了许多不相关问题的解决方案，这些问题诸如，需要加载太多资源。对 XHR 的创造性应用是如此的与众不同，它不是呆滞不友好的界面，而是响应迅速且高效的代名词；它不会引起用户的憎恨，谁见了它都会爱上它。
