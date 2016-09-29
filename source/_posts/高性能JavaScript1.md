title: JavaScript加载和运行的优化
date: 2015-07-29 17:28:18
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-1
---
**第一章 Loading and Execution 加载和运行**
===
本文章结尾处有结论，不愿意看原理或者已经懂原理的可以直接看结论。
<!--more-->
---
一.Script Positioning 脚本位置
===
---
　　JavaScript在浏览器中的性能，是开发者所要面对的最重要的可用性问题。这个问题因JavaScript的阻塞特征而复杂，也就是说，当JavaScript运行时其他的事情不能被浏览器处理。事实上，大多数浏览器使用单进程处理UI更新和JavaScript运行等多个任务，而同一时间只能有一个任务被执行。JavaScript运行了多长时间，那么在浏览器空闲下来响应用户输入之前的等待时间就有多长。
　　从基本层面说，这意味着< script>标签的出现使整个页面因脚本解析、运行而出现等待。不论实际的JavaScript代码是内联的还是包含在一个不相干的外部文件中，页面下载和解析过程必须停下，等待脚本完成这些处理，然后才能继续。这是页面生命周期必不可少的部分，因为脚本可能在运行过程中修改页面内容。典型的例子是 document.write()函数，例如：

	<html>
	<head>
	<title>Script Example</title>
	</head>
	<body>
		<p>
			<script type="text/javascript">
				document.write("The date is " + (new Date()).toDateString());
			</script>
		</p>
	</body>
	</html>

　　当浏览器遇到一个< script>标签时，正如上面代码中一样，无法预知JavaScript是否在< p>标签中添加内容，所以浏览器要停下来，先运行JavaScript代码，再继续解析和翻译下面的页面。 在使用src属性加载JavaScript的过程中也会出现这样的问题。浏览器必须先下载外部的代码，占用一段时间，然后解析并运行这段代码。在这个过程中，后续的页面解析和用户交互式完全被阻塞的。
HTML4文档中指出，一个< script>标签可以放在HTML文档的< head>或< body>中，可以在其中多次出现。传统上，< script>标签用于加载外部的JavaScript文件。< head>部分除了此类代码还包含< link>标签用于加载CSS文件和其他页面的中间件。也就是说，最好把行为所依赖的部分放在一起，首先加载它们，使得页面可以得到正确的外观和行为。如下列代码：
	
	<head>
	<title>Script Example</title>
		<-- Example of inefficient script positioning -->
		<script type="text/javascript" src="file1.js"></script>
		<script type="text/javascript" src="file2.js"></script>
		<script type="text/javascript" src="file3.js"></script>
		<link rel="stylesheet" type="text/css" href="styles.css">
	</head>
	<body>
		<p>Hello world!</p>
	</body>
	</html>

　　但是在浏览器遇到< body>标签前，不会渲染页面的任何成分，所以这种方式也许会让用户等待在空白的界面很久。下面这个图，说明了加载的整个过程。
![GitHub Mark](http://7xkj1z.com1.z0.glb.clouddn.com/高性能js-img1.png "GitHub Mark")
　　从图中可以看出，第一个JavaScript文件开始下载，并阻塞了其他文件的下载过程。在file1.js下载完之后和file2.js开始下载中之前还会有一个延迟，这个延迟是file1.js完全运行所花费的时间。每个文件必须等到前一个文件下载并运行完毕才能开始自己的下载过程。而当这些文件下载时，用户面对的就是一个空白的屏幕。这就是当今大多数浏览器的行为模式。
　　IE8，Firefox 3.5，Safari 4，和Chrome2允许并行下载两个JavaScript文件。这样当一个< script>标签在下载时就不会阻塞其它的< script>标签了。但是依然会阻塞其它资源的下载，比如图片。而且，就算脚本直接下载不会互相阻塞，但是页面还是要等在所有的JavaScript代码下载并执行完毕后才能继续。所以，脚本阻塞依旧是问题。
>因为脚本阻塞其它页面的资源下载，所以推荐的办法是：将所有的< script>标签尽可能的接近< body>标签的底部位置，尽量减少对整个页面加载的影响。如：

	<html>
	<head>
	<title>Script Example</title>
		<link rel="stylesheet" type="text/css" href="styles.css">
	</head>
	<body>
		<p>Hello world!</p>
		<-- Example of recommended script positioning -->
		<script type="text/javascript" src="file1.js"></script>
		<script type="text/javascript" src="file2.js"></script>
		<script type="text/javascript" src="file3.js"></script>
	</body>
	</html>
>**这正是“Yahoo! 优越性能小组”关于JavaScript 的第一条定律：*将脚本放在底部*。**

二.Grouping Scripts  成组脚本
===
---
　　因为每个< script>标签下载时都会阻塞页面解析过程，所以限制页面的< script>标签总数也可以改善性能（内联脚本和外联脚本都适用）。每个HTTP请求都会产生额外的性能负担，下载一个 100KB 的文件比下载四个 25KB 的文件要快。所以尽量减少外部脚本的数量。这一系列的工作可通过一个打包工具实现（在第9章有介绍），或者一个实时工具，诸如“[Yahoo! combo handler](http://yui.yahooapis.com/combo?2.7.0/build/yahoo/yahoo-min.js&2.7.0/build/event/event-min.js)”。
Yahoo!适用一个“联合语把柄”来解决这个问题，例如，下面的 URL 包含两个文件：
http://yui.yahooapis.com/combo?2.7.0/build/yahoo/yahoo-min.js&2.7.0/build/event/event-min.js
　　这个URL调用了2.7.0版本的 yahoo-min.js 和 event-min.js 文件。这些文件在服务器上是两个分离的文件，但是当服务器收到此URL请求时，两个文件就会被合并在一起返回给客户。这样一个< script>标签就可以加载它们：

	<html>
	<head>
	<title>Script Example</title>
		<link rel="stylesheet" type="text/css" href="styles.css">
	</head>
	<body>
	<p>Hello world!</p>
		<-- Example of recommended script positioning -->
		<script type="text/javascript"
			src="http://yui.yahooapis.com/combo?2.7.0/build/yahoo/yahoo-min.js&2.7.0/build/event/event-min.js">
		</script>
	</body>
	</html>
>这是在HTML页面中包含多个外部JavaScript的最佳方法。

三.Nonblocking Scripts 非阻塞脚本
===
---
　　JavaScript 倾向于阻塞浏览器某些处理过程，如 HTTP请求和界面刷新，这是开发者面临的最显著的性能问题。保持JavaScript文件短小，并限制 HTTP 请求的数量，只是创建反应迅速的网页应用的第一步。一个应用程序所包含的功能越多，所需要的 JavaScript 代码就越大，保持源码短小并不总是一种选择。尽管下载一个大JavaScript文件只产生一次HTTP请求，却会锁定浏览器一大段时间。为避开这种情况，你需要向页面中逐步添加 JavaScript，某种程度上说不会阻塞浏览器。
非阻塞脚本的秘密在于，等页面完成加载之后，再加载 JavaScript 源码。从技术角度讲，这意味着在window 的 load 事件发出之后开始下载代码。有几种方法可以实现这种效果。
**1.Deferred Scripts 延期脚本**
　　HTML4中定义的defer属性就表明了这段脚本不会修改DOM，所以代码可以稍后执行。defer只被IE4和Firefox 3.5及以上版本支持，它并不是一个理想的跨浏览器解决方案。如果浏览器支持，这种方法是一种很有用的解决方案：

	<script type="text/javascript" src="file1.js" defer></script>
JavaScript文件将在< script>标签被解析时启动下载，但是不会执行，知道DOM加载完成（onlaod事件被调用之前）。这样当一个defer的JavaScript文件被下载时，不会阻塞浏览器的其他处理过程，即其它资源也可以一起并行下载。

	<html>
	<head>
	<title>Script Defer Example</title>
	</head>
	<body>
		<script defer>
			alert("defer");
		</script>
		<script>
			alert("script");
		</script>
		<script>
			window.onload = function(){
				alert("load");
			};
		</script>
	</body>
	</html>
　　以上代码阐述了defer的执行过程，如果浏览器不支持defer那么这段程序将按顺序执行，即defer、script、load。如果浏览器支持defer属性，弹出框的顺序为：script、defer、load。这里有一点需要注意：
> **defer的< script>标签不是跟在第二个后面运行，而是在onload事件语句之前被调用**

　　如果你的目标浏览器只包括 IE 和 Firefox 3.5，那么 defer 脚本确实有用。如果你需要支持跨领域的多种浏览器，那么还有更一致的实现方式
**2.Dynamic Script Elements 动态脚本元素**
DOM可以用JavaScript动态创建HTML的几乎所有文档内容，就是因为< script>标签与页面其它的标签没有什么不同：引用变量可以通过DOM进行检索，可以从文档中移动、删除和创建。一个新的< script>标签很容易被标准的DOM函数创建。

	var script = document.createElement ("script");
	script.type = "text/javascript";
	script.src = "file1.js";
	document.getElementsByTagName_r("head")[0].appendChild(script);
　　而这个被创建的标签加载file1.js源文件。这个文件在元素添加到页面之后立刻开始下载。此技术的重点在于：无论在何处启动下载，文件的下载和运行都不会阻塞其它的页面处理过程。你甚至可以将这些代码放在< head>部分而不会对其余部分的页面代码造成影响（除了用于下载文件的HTTP链接）。
当文件使用动态脚本节点下载时，返回的代码通常立即执行（除了 Firefox 和 Opera，他们将等待此前的所有动态脚本节点执行完毕）。当脚本是“自运行”类型时这一机制运行正常，但是如果脚本只包含供页面其他脚本调用调用的接口，则会带来问题。这种情况下，你需要跟踪脚本下载完成并准备妥善的情况。可以使用动态< script>节点发出事件得到相关信息。Firefox, Opera, Chorme 和 Safari 3+会在< script>节点接收完成之后发出一个load事件。你可以监听这一事件，以得到脚本准备好的通知：

	var script = document.createElement ("script")
	script.type = "text/javascript";
	//Firefox, Opera, Chrome, Safari 3+
	script.onload = function(){
	alert("Script loaded!");
	};
	script.src = "file1.js";
	document.getElementsByTagName_r("head")[0].appendChild(script);
　　IE中支持另一种实现方式，它发出一个readystatechange事件，< script>标签有一个readyState属性，它的值随着下载外部文件的过程而改变。readyState有五种取值：

	"uninitialized" The default state 默认状态
	"loading" Download has begun 下载开始
	"loaded" Download has completed 下载完成
	"interactive" Data is completely downloaded but isn't fully available 下载完成但尚不可用
	"complete" All data is ready to be used 所有数据已经准备好
　　微软的文档说，在一个生命周期中这些值并不一定都会出现，但并没有说哪些不会。在实践中，我们最有用的是"loaded"和"complete",而这两个属性值也不是全会出现，有时有"loade"而不出现"complete"，有时反之。所以最安全的办法就是在readystatachange事件中检查这两个状态，且当一种状态出现时删除readystatachange事件句柄（保证不被处理两次）;

	var script = document.createElement ("script")
	script.type = "text/javascript";
	//Internet Explorer
	script.onreadystatechange = function(){
	if (script.readyState == "loaded" || script.readyState == "complete"){
		script.onreadystatechange = null;
		alert("Script loaded.");
	}
	};
	script.src = "file1.js";
	document.getElementsByTagName_r("head")[0].appendChild(script);
>下面总结上面所说，写一个兼容性的实现JavaScript的动态加载。

	function loadScript(url, callback){
	var script = document.createElement ("script")
	script.type = "text/javascript";
	if (script.readyState){ //IE
		script.onreadystatechange = function(){
			if (script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				callback();
			}
		};
	} else { //Others
		script.onload = function(){
			callback();
		};
	}
		script.src = url;
		document.getElementsByTagName_r("head")[0].appendChild(script);
	}
　　此函数传入两个参数：JavaScript文件的URL，和一个JavaScript接收完成的回调函数。此函数的使用方法如下：

	loadScript("file1.js", function(){
		alert("File is loaded!");
	});
　　当多个JavaScript文件同时加载时，除了Firefox和Opera能保证按顺序加载，其它浏览器都不能。所以可以利用回调函数来控制顺序：

	loadScript("file1.js", function(){
		loadScript("file2.js", function(){
			loadScript("file3.js", function(){
				alert("All files are loaded!");
			});
		});
	});

　　如果多个文件的次序十分重要，更好的办法是将这些文件按照正确的次序连接成一个文件。独立文件可以一次性下载所有代码（由于这是异步进行的，使用一个大文件并没有什么损失）。
>动态脚本加载是非阻塞 JavaScript 下载中最常用的模式，因为它可以跨浏览器，而且简单易用。

**3.XMLHttpRequest Script Injection XHR**
　　还有一种非阻塞方式获得脚本的方法是XMLHttpRequst(XHR)对象将脚本注入页面中。

	var xhr = new XMLHttpRequest();
	xhr.open("get", "file1.js", true);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
				var script = document.createElement ("script");
				script.type = "text/javascript";
				script.text = xhr.responseText;
				document.body.appendChild(script);
			}
		}
	};
	xhr.send(null);

　　这段代码向服务器发送一个获取文件file1.js的get请求。然后检测readyState是不是4，再继续检测TTTP状态码status（200表示有效回应，304是缓存响应），如果是有效相应就新建一个< script>元素，将其文本属性设置为返回响应的responseText字符串。
> + 这种方法的主要优点是， 你可以下载不立即执行的 JavaScript 代码。由于代码返回在< script>标签之外（换句话说不受< script>标签约束），它下载后不会自动执行，这使得你可以推迟执行，直到一切都准备好了。另一个优点是，同样的代码在所有现代浏览器中都不会引发异常。
> + 此方法最主要的限制是：JavaScript 文件必须与页面放置在同一个域内。正因为这个原因，大型网页通常不采用XHR脚本注入技术。

**4.Recommended Nonblocking Pattern 推荐的非阻塞模式**
>推荐的向页面加载大量 JavaScript 的方法分为两个步骤：第一步，包含动态加载 JavaScript 所需的代码，然后加载页面初始化所需的除 JavaScript 之外的部分。这部分代码尽量小，可能只包含loadScript()函数，它下载和运行非常迅速，不会对页面造成很大干扰。当初始代码准备好之后，用它来加载其余的 JavaScript。例如：

	<script type="text/javascript" src="loader.js"></script>
	<script type="text/javascript">
		loadScript("the-rest.js", function(){
			Application.init();
		});
	</script>
　　将这段代码放到< /body>标签之前。首先，这样可以确保JavaScript运行不会影响页面其它部分显示。其次，当第二部分 JavaScript 文件完成下载，所有应用程序所必须的 DOM 已经创建好了，并做好被访问的准备，避免使用额外的事件处理（例如 window.onload）来得知页面是否已经准备好了。
>也可以直接将loadScript函数嵌入在页面中，来避免另一次HTTP请求。

　　如果你决定使用这种方法，建议你使用“YUI Compressor”(参见第 9 章)或者类似的工具将初始化脚本缩小到最小字节尺寸。一旦页面初始化代码下载完成，你还可以使用loadScript()函数加载页面所需的额外功能函数。

**The YUI3 approach**
　　YUI 3 的核心设计理念为：用一个很小的初始代码，下载其余的功能代码。要在页面上使用YUI 3，首先包含 YUI 的种子文件.

	<script type="text/javascript"
	src=http://yui.yahooapis.com/combo?3.0.0/build/yui/yui-min.js></script>
　　此种子文件大约 10KB（gzipped 压缩后 6KB）包含从 Yahoo! CDN 下载 YUI 组件所需的足够功能。举例来说，如果你想使用DOM功能，你可以指出它的名字（"dom"），传递给 YUI 的 use()函数，再提供一个回调函数，当代码准备好时这个回调函数将被调用

	YUI().use("dom", function(Y){
		Y.DOM.addClass(docment.body, "loaded");
	})
**The LazyLoad library**
　　作为一个更通用的工具，Yahoo! Search 的 Ryan Grove 创建了 LazyLoad 库（参见 http://github.com/rgrove/lazyload/）。LazyLoad 是一个更强大的 loadScript()函数。LazyLoad 精缩之后只有大约 1.5KB（精缩，而不是用 gzip 压缩的）。lazyLoad可以下载多个JavaScript文件，并且能保证执行顺序，只需要LazyLoad.js()函数传递一个URL队列给它。但是仍应该尽可能的减少文件的数量。每次下载都是一个单独的HTTP请求。
**The LABjs library**
　　另一个非阻塞 JavaScript 加载库是 LABjs（http://labjs.com/），Kyle Simpson 写的一个开源库，由 Steve Souders 赞助。此库对加载过程进行更精细的控制，并尝试并行下载尽可能多的代码。LABjs 也相当小，只有 4.50KB（精缩，而不是用 gzip 压缩的），所以具有最小的页面代码尺寸。用法举例：

	<script type="text/javascript" src="lab.js"></script>
	<script type="text/javascript">
		$LAB.script("the-rest.js")
			.wait(function(){
			Application.init();
		});
	</script>
　　$LAB.script()函数用于下载一个 JavaScript 文件，$LAB.wait()函数用于指出一个函数，该函数等待文件下载完成并运行之后才会被调用。LABjs 鼓励链操作，每个函数返回一个指向$LAB 对象的引用。要下载多个 JavaScript 文件，那么就链入另一个$LAB.script()调用

	<script type="text/javascript" src="lab.js"></script>
	<script type="text/javascript">
		$LAB.script("first-file.js")
			.script("the-rest.js")
			.wait(function(){
				Application.init();
			});
	</script>

　　LABjs 通过 wait()函数允许你指定哪些文件应该等待其他文件。在前面的例子中，first-file.js 的代码不保证在 the-rest.js 之前运行。为保证这一点，你必须在第一个 script()函数之后添加一个 wait()调用：

	<script type="text/javascript" src="lab.js"></script>
	<script type="text/javascript">
		$LAB.script("first-file.js").wait()
			.script("the-rest.js")
			.wait(function(){
				Application.init();
			});
	</script>
　　现在，first-file.js 的代码保证会在 the-rest.js 之前执行，虽然两个文件的内容是并行下载的。

**总结：**
===
---
　　JavaScript代码的执行会阻塞其它浏览器的处理过程，比如界面的绘制等。只要遇到< script>标签，页面就必须要等待JavaScript代码的下载（如果是外部的）和执行。这样会影响性能，可能会让浏览者对着空白的浏览器等待很久。通过这一章的学习，可以总结出集中减少JavaScript对性能的影响：

> - 1.将所有的< script>标签尽量放在页面底部，也就是< /body>之前。这样可以保证页面在脚本运行前完成解析。
> - 2.将脚本成组打包。< script>标签的数量越少，页面加载速度也就越快，响应也会加速（外部脚本和内联代码都适用）。
> - 3.用几种非阻塞方式下载JavaScript：
>> - < script>标签加入defer(IE 及 Firefox3.5以上版本)。
>> - 用 DOM 动态创建< script>元素，用它下载并执行代码。
>> - 用 XHR 对象来下载代码，并注入页面中（需要同源）。

---
** *通过使用上述策略，你可以极大提高那些大量使用 JavaScript 代码的网页应用的实际性能。* **