title: JavaScript DOM编程优化
date: 2015-08-1 10:20:11
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-3
---
**第三章 DOM Scripting DOM  编程**
===
　　回去看了一下前面两章的内容，发现写的内容都很多，但是过于繁琐，基本与原文解释的内容差不多，在后面的文章中，我将更多的写自己的理解，而不是更多的原文内容，如果对优化很感兴趣，可以详细的看一下《高性能JavaScript》这本书。在每章结束时，依旧有总结。
<!--more-->
　　在这章主要讨论以下三个问题。
> - 1.访问和修改 DOM 元素。
> - 2.修改 DOM 元素的样式，造成重绘和重新排版。
> - 3.通过 DOM 事件处理用户响应。
　　DOM 在浏览器中主要是用来操作 HTML 文档的。它天生就很慢，当你每次访问 DOM 时都需要耗费性能，这就好比每次 ECMAScript 需要访问 DOM 时，你需要过桥，交一次“过桥费”。所以，当你操作 DOM 次数越多，费用就越高。看一下下面这个例子：

	function innerHTMLLoop() {
		for (var count = 0; count < 15000; count++) {
			document.getElementById('here').innerHTML += 'a';
		}
	}
　　这个例子中，你每次循环都要访问DOM两次，一次是读取innerHTML，另一次是写入它。再看一下下面的改进版本。

	function innerHTMLLoop2() {
		var content = '';
		for (var count = 0; count < 15000; count++) {
			content += 'a';
		}
		document.getElementById('here').innerHTML += content;
	}
　　**使用局部变量存储更新后的内容，在循环结束时一次性写入，如果循环非常大，你可能会发现性能会比之前快了几百倍。**

　　还有一种优化方式，是用 innerHTML 来代替纯DOM ，innerHTML 会比纯 DOM方法快一点，下面两个例子分别建1000行的表：
innerHTML方法：

	function tableInnerHTML() {
		var i, h = ['<table border="1" width="100%">'];
		h.push('<thead>');
		h.push('<tr><th>id<\/th><th>yes?<\/th><th>name<\/th><th>url<\/th><th>action<\/th><\/tr>');
		h.push('<\/thead>');
		h.push('<tbody>');
		for (i = 1; i <= 1000; i++) {
		h.push('<tr><td>');
		h.push(i);
		h.push('<\/td><td>');
		h.push('And the answer is... ' + (i % 2 ? 'yes' : 'no'));
		h.push('<\/td><td>');
		h.push('my name is #' + i);
		h.push('<\/td><td>');
		h.push('<a href="http://example.org/' + i + '.html">http://example.org/' + i + '.html<\/a>');
		h.push('<\/td><td>');
		h.push('<ul>');
		h.push(' <li><a href="edit.php?id=' + i + '">edit<\/a><\/li>');
		h.push(' <li><a href="delete.php?id="' + i + '-id001">delete<\/a><\/li>');
		h.push('<\/ul>');
		h.push('<\/td>');
		h.push('<\/tr>');
		}
		h.push('<\/tbody>');
		h.push('<\/table>');
		document.getElementById('here').innerHTML = h.join('');
	};
如果使用 DOM 方法创建同样的表，代码有些冗长：

	function tableDOM() {
		var i, table, thead, tbody, tr, th, td, a, ul, li;
		tbody = document.createElement ('tbody');
		for (i = 1; i <= 1000; i++) {
			tr = document.createElement ('tr');
			td = document.createElement ('td');
			td.appendChild(document.createTextNode((i % 2) ? 'yes' : 'no'));
			tr.appendChild(td);
			td = document.createElement ('td');
			td.appendChild(document.createTextNode(i));
			tr.appendChild(td);
			td = document.createElement ('td');
			td.appendChild(document.createTextNode('my name is #' + i));
			tr.appendChild(td);
			a = document.createElement ('a');
			a.setAttribute('href', 'http://example.org/' + i + '.html');
			a.appendChild(document.createTextNode('http://example.org/' + i + '.html'));
			td = document.createElement ('td');
			td.appendChild(a);
			tr.appendChild(td);
			ul = document.createElement ('ul');
			a = document.createElement ('a');
			a.setAttribute('href', 'edit.php?id=' + i);
			a.appendChild(document.createTextNode('edit'));
			li = document.createElement ('li');
			li.appendChild(a);
			ul.appendChild(li);
			a = document.createElement ('a');
			a.setAttribute('href', 'delete.php?id=' + i);
			a.appendChild(document.createTextNode('delete'));
			li = document.createElement ('li');
			li.appendChild(a);
			ul.appendChild(li);
			td = document.createElement ('td');
			td.appendChild(ul);
			tr.appendChild(td);
			tbody.appendChild(tr);
		}
		tr = document.createElement ('tr');
		th = document.createElement ('th');
		th.appendChild(document.createTextNode('yes?'));
		tr.appendChild(th);
		th = document.createElement ('th');
		th.appendChild(document.createTextNode('id'));
		tr.appendChild(th);
		th = document.createElement ('th');
		th.appendChild(document.createTextNode('name'));
		tr.appendChild(th);
		th = document.createElement('th');
		th.appendChild(document.createTextNode('url'));
		tr.appendChild(th);
		th = document.createElement('th');
		th.appendChild(document.createTextNode('action'));
		tr.appendChild(th);
		thead = document.createElement('thead');
		thead.appendChild(tr);
		table = document.createElement('table');
		table.setAttribute('border', 1);
		table.setAttribute('width', '100%');
		table.appendChild(thead);
		table.appendChild(tbody);
		document.getElementById('here').appendChild(table);
	};
>注意：在 webkit内核的浏览器中，DOM的方法更快。所以，决定使用哪种方法更快取决于你的浏览器。如果在一个性能苛刻的操作中更新一大块 HTML 页面，innerHTML 在大多数浏览器中执行更快。但对于大多数日常操作而言，其差异并不大，所以你应当根据代码可读性，可维护性，团队习惯，代码风格来
综合决定采用哪种方法。

　　上面说到的建1000行表也可以用节点克隆来解决，但是性能提高的不是很明显，这里不再细说。

---
HTML 集合是用于存放 DOM 节点引用的类数组对象。下列函数的返回值就是一个集合：

	document.getElementsByName()
	document.getElementsByClassName()
	document.getElementsByTagName()
	document.images
	document.links
	...
这里有一点需要优化的就是集合的遍历，集合的遍历是没有数组的遍历速度快的，所以尽量的将HTML集合拷贝到一个数组中，再进行遍历，看一下下面的例子：

	function toArray(coll) {
		for (var i = 0, a = [], len = coll.length; i < len; i++) {
			a[i] = coll[i];
		}
		return a;
	}
	var coll = document.getElementsByTagName_r('div');
	var arr = toArray(coll)
	//比较下面两个函数的快慢。
	//slower
	function loopCollection() {
		for (var count = 0; count < coll.length; count++) {
		}
	}
	// faster
	function loopCopiedArray() {
		for (var count = 0; count < arr.length; count++) {
		}
	}
这个例子中还有很多的地方可以优化，比如“.length”，无论是调用数组还是集合的length属性，都意味着每次都要重新运行查询过程。所以，最好的办法是将length属性缓存到局部变量中，同样的，如果再循环中多次访问同一个集合元素，也用局部变量缓存它：
	
	function collectionNodesLocal() {
		var coll = document.getElementsByTagName_r('div'),
		len = coll.length,
		name = '',
		el = null;
		for (var count = 0; count < len; count++) {
			el = coll[count];
			name = el.nodeName;
			name = el.nodeType;
			name = el.tagName;
		}
		return name;
	};

这样才能让你的DOM访问更有效率，节省性能的开销。

---
在抓取节点的时候，因为节点的类型有很多，如注释节点和文本节点等。而我们常用的是元素节点，所以，此时选择只表示元素节点的DOM属性:
![只表示元素节点的 DOM 属性（HTML 标签）和表示所有节点的属性](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img3-1.png)

使用CSS选择器尽量使用浏览器原生的DOM函数，如： querySelectorAll()、querySelector等。

---
尽量阻止重排现象，否则会导致你的性能大减。在下述情况中会发生重排版：

> - 添加或删除可见的 DOM 元素.
> - 元素位置改变.
> - 元素尺寸改变（因为边距，填充，边框宽度，宽度，高度等属性改变）
> - 内容改变，例如，文本改变或图片被另一个不同尺寸的所替代
> - 最初的页面渲染
> - 浏览器窗口改变尺寸

　　根据改变的性质，渲染树上或大或小的一部分需要重新计算。某些改变可导致重排版整个页面：例如，当一个滚动条出现时。

　　大多数浏览器通过队列化修改和批量显示优化重排版过程。然而，你可
能（经常不由自主地）强迫队列刷新并要求所有计划改变的部分立刻应用。获取布局信息的操作将导致刷新队列动作，这意味着使用了下面这些方法：

	offsetTop, offsetLeft, offsetWidth, offsetHeight
	scrollTop, scrollLeft, scrollWidth, scrollHeight
	clientTop, clientLeft, clientWidth, clientHeight
	getComputedStyle() (currentStyle in IE)（在 IE 中此函数称为 currentStyle)
在改变风格的过程中，最好不要使用前面列出的那些属性。任何一个访问都将刷新渲染队列，即使你正在获取那些最近未发生改变的或者与最新的改变无关的布局信息。

在改变CSS属性时，尽量将所有改变合并在一起执行。只修改一次DOM。可以通过cssText来实现：

	var el = document.getElementById('mydiv');
	el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px;';
下面例子是常见的写法，与上面的例子相比慢了很多。

	var el = document.getElementById('mydiv');
	el.style.borderLeft = '1px';
	el.style.borderRight = '2px';
	el.style.padding = '5px';
减少重排的方法一：
　　从文档流中摘除该元素-->对其应用多重改变-->将元素带回文档中
摘除元素可以用以下方法来进行：
> - 隐藏元素，进行修改，然后再显示它。
> - 使用一个文档片断在已存 DOM 之外创建一个子树，然后将它拷贝到文档中。
> - 将原始元素拷贝到一个脱离文档的节点中，修改副本，然后覆盖原始元素。
减少重排的方法二：
　　在文档之外创建并更新一个文档片断，然后将它附加在原始列表上。文档片断是一个轻量级的 document 对象，它被设计专用于更新、移动节点之类的任务。文档片断一个便利的语法特性是当你向节点附加一个片断时，实际添加的是文档片断的子节点群，而不是片断自己。
减少重排的方法三：
　　创建要更新节点的副本，然后在副本上操作，最后用新节点覆盖老节点。

---
> - 大量的使用hover会降低反应速度，在IE8中更显著。

> - 尽量使用时间托管来绑定事件，来提高性能。

---
Summary 总结
===
---
　　DOM 访问和操作是现代网页应用中很重要的一部分。 但每次你通过桥梁从 ECMAScript 岛到达 DOM 岛时，都会被收取“过桥费”。为减少 DOM 编程中的性能损失，请牢记以下几点：

> - 最小化 DOM 访问，在 JavaScript 端做尽可能多的事情。
> - 在反复访问的地方使用局部变量存放 DOM 引用.
> - 小心地处理 HTML 集合，因为他们表现出“存在性”，总是对底层文档重新查询。将集合的 length 属性缓存到一个变量中，在迭代中使用这个变量。如果经常操作这个集合，可以将集合拷贝到数组中。
> - 如果可能的话，使用速度更快的 API，诸如 querySelectorAll()和 firstElementChild。
> - 注意重绘和重排版；批量修改风格，离线操作 DOM 树，缓存并减少对布局信息的访问。
> - 动画中使用绝对坐标，使用拖放代理。
> - 使用事件托管技术最小化事件句柄数量。