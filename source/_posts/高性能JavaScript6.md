title: JavaScript 响应接口的优化
date: 2015-08-4 08:02:42
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-6
---
第六章 Responsive Interfaces 响应接口
<!--more-->
---

第六章 Responsive Interfaces 响应接口
---

- 浏览器在JavaScript运行上采取了限制：调用栈尺寸的限制和运行时间的限制。
每种浏览器的行为大致相同。当脚本执行时，UI 不随用户交互而更新。此时 JavaScript 任务作为用户交互的结果被创建被放入队列，然后当原始JavaScript任务完成时队列中的任务被执行。用户交互导致的UI更新被自动跳过，因为优先考虑的是页面上的动态部分。因此，当一个脚本运行时点击一个按钮，将看不到它被按下的样子，即使它的 onclick 句柄被执行了。尽管浏览器尝试在这些情况下做一些符合逻辑的事情，但所有这些行为导致了一个间断的用户体验。因此最好的方法是，通过限制任何 JavaScript 任务在 100 毫秒或更少时间内完成，避免此类情况出现。这种
测量应当在你要支持的最慢的浏览器上执行
- 解决上面的办法可以使用定时器来分割JavaScript运行的时间。使每部分JavaScript代码可以在100ms内完成。
- 定时器的延迟时间精度不准确，所以不能用定时器来判断精确的时间。
- 一种基本异步代码模式如下：
```js
	var todo = items.concat(); //create a clone of the original
	setTimeout(function(){
		//get next item in the array and process it
		process(todo.shift());
		//if there's more items to process, create another timer
		if(todo.length > 0){
			setTimeout(arguments.callee, 25);
		} else {
			callback(items);
		}
	}, 25);

下面封装此模式：

	function processArray(items, process, callback){
		var todo = items.concat(); //create a clone of the original
		setTimeout(function(){
			process(todo.shift());
			if (todo.length > 0){
				setTimeout(arguments.callee, 25);
			} else {
				callback(items);
			}
		}, 25);
	}
```
- 可通过原生的 Date 对象跟踪代码的运行时间。这是大多数 JavaScript 分析工具所采用的工作方式:
```
	var start = +new Date(),
	stop;
	someLongProcess();
	stop = +new Date();
	if(stop-start < 50){
		alert("Just about right.");
	} else {
		alert("Taking too long.");
	}
```
- 定时器使你的 JavaScript 代码整体性能表现出巨大差异，但过度使用它们会对性能产生负面影响。同一时间只有一个定时器存在，只有当这个定时器结束时才创建一个新的定时器，以这种方式使用定时器不会带来性能问题。

- 工人线程在 UI 线程之外运行，这种阻塞不会影响 UI 响应。例如：
```js
	//inside code.js
	importScripts("file1.js", "file2.js");
	self.onmessage = function(event){
		self.postMessage("Hello, " + event.data + "!");
	};
```
- 工人线程可以另以下任务受益：

- 编/解码一个大字符串
- 复杂数学运算（包括图像或视频处理）
- 给一个大数组排序

---
Summary 总结
===
JavaScript和用户界面更新在同一个进程内运行，同一时刻只有其中一个可以运行。 这意味着当JavaScript代码正在运行时，用户界面不能响应输入，反之亦然。有效地管理 UI 线程就是要确保 JavaScript 不能运行太长时间，以免影响用户体验。最后，请牢记如下几点：

> - JavaScript 运行时间不应该超过 100 毫秒。过长的运行时间导致 UI 更新出现可察觉的延迟，从而对整体用户体验产生负面影响。
> - JavaScript 运行期间，浏览器响应用户交互的行为存在差异。无论如何，JavaScript 长时间运行将导致用户体验混乱和脱节。
> - 定时器可用于安排代码推迟执行，它使得你可以将长运行脚本分解成一系列较小的任务。
> - 网页工人线程是新式浏览器才支持的特性，它允许你在 UI 线程之外运行 JavaScript 代码而避免锁定 UI。
> - 网页应用程序越复杂，积极主动地管理 UI 线程就越显得重要。没有什么 JavaScript 代码可以重要到允许影响用户体验的程度。
