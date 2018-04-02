title: JavaScript 编程实践
date: 2015-08-4 19:21:18
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-8
---
第八章 Programming Practices 编程实践
<!--more-->
第八章 Programming Practices 编程实践
---
每种编程语言都有痛点，而且低效模式随着时间的推移不断发展。其原因在于，越来越多的人们开始使用这种语言，不断扩种它的边界。自 2005 年以来，当术语“Ajax”出现时，网页开发者对 JavaScript 和浏览器的推动作用远超过以往。其结果是出现了一些非常具体的模式，即有优秀的做法也有糟糕的做法。这些模式的出现，是因为网络上 JavaScript 的性质决定的。

- JavaScript与许多脚本语言一样，允许你在程序中获取一个包含代码的字符串然后运行它。有四种标准方法可以实现： eval_r()， Function()构造器， setTimeout()和 setInterval()。每个函数允许你传入一串 JavaScript代码，然后运行它。例如：
```
	var num1 = 5,
	num2 = 6,
	//eval_r() evaluating a string of code
	result = eval_r("num1 + num2"),
	//Function() evaluating strings of code
	sum = new Function("arg1", "arg2", "return arg1 + arg2");
	//setTimeout() evaluating a string of code
	setTimeout("sum = num1 + num2", 100);
	//setInterval() evaluating a string of code
	setInterval("sum = num1 + num2", 100);
```
    大多数情况下，没必要使用 eval_r()或 Function()，如果可能的话，尽量避免使用它们。至于另外两个函数，setTimeout()和 setInterval()，第一个参数传入一个函数而不是一个字符串。例如：
    ```js
    	setTimeout(function(){
    		sum = num1 + num2;
    	}, 100);
    	setInterval(function(){
    		sum = num1 + num2;
    	}, 100);
    ```
- 尽量使用对象直接量。这样可以提高性能，同时减少代码量。

- 不要做重复的工作。下面例子解决重复工作的问题。
```js
	function addHandler(target, eventType, handler){
		if (target.addEventListener){ //DOM2 Events
			target.addEventListener(eventType, handler, false);
		} else { //IE
			target.attachEvent("on" + eventType, handler);
		}
	}
	function removeHandler(target, eventType, handler){
		if (target.removeEventListener){ //DOM2 Events
			target.removeEventListener(eventType, handler, false);
		} else { //IE
			target.detachEvent("on" + eventType, handler);
		}
	}
```
    隐藏的性能问题在于每次函数调用时都执行重复工作。每一次，都进行同样的检查，看看某种方法是否存在。如果你假设 target 唯一的值就是 DOM 对象，而且用户不可能在页面加载时魔术般地改变浏览器，那么这种判断就是重复的。如果 addHandler()一上来就调用addEventListener()那么每个后续调用都要出现这句代码。在每次调用中重复同样的工作是一种浪费，有多种办法避免这一点。

    可以使用延迟加载：
    ```js
    	function addHandler(target, eventType, handler){
    			//overwrite the existing function
    		if (target.addEventListener){ //DOM2 Events
    			addHandler = function(target, eventType, handler){
    				target.addEventListener(eventType, handler, false);
    			};
    		} else { //IE
    			addHandler = function(target, eventType, handler){
    				target.attachEvent("on" + eventType, handler);
    			};
    		}
    		//call the new function
    		addHandler(target, eventType, handler);
    		}
    		function removeHandler(target, eventType, handler){
    			//overwrite the existing function
    			if (target.removeEventListener){ //DOM2 Events
    				removeHandler = function(target, eventType, handler){
    					target.addEventListener(eventType, handler, false);
    				};
    			} else { //IE
    				removeHandler = function(target, eventType, handler){
    				target.detachEvent("on" + eventType, handler);
    			};
    		}
    		//call the new function
    		removeHandler(target, eventType, handler);
    	}
    ```
    条件预加载：
    ```js
    	var addHandler = document.body.addEventListener ?
    	function(target, eventType, handler){
    		target.addEventListener(eventType, handler, false);
    	}:
    	function(target, eventType, handler){
    		target.attachEvent("on" + eventType, handler);
    	};
    	var removeHandler = document.body.removeEventListener ?
    	function(target, eventType, handler){
    		target.removeEventListener(eventType, handler, false);
    	}:
    	function(target, eventType, handler){
    		target.detachEvent("on" + eventType, handler);
    	};
    ```
- 使用位操作符可以提升性能。
- 尽量使用原生方法，可以提高性能。如Math.abs(num)等。

---
Summary 总结
===

JavaScript 提出了一些独特的性能挑战，关系到你组织代码的方法。网页应用变得越来越高级，包含的
JavaScript 代码越来越多，出现了一些模式和反模式。请牢记以下编程经验：

- 通过避免使用 eval_r()和 Function()构造器避免二次评估。此外，给 setTimeout()和 setInterval()传递函数参数而不是字符串参数。
- 创建新对象和数组时使用对象直接量和数组直接量。它们比非直接量形式创建和初始化更快。
- 避免重复进行相同工作。当需要检测浏览器时，使用延迟加载或条件预加载。
- 当执行数学远算时，考虑使用位操作，它直接在数字底层进行操作。
- 原生方法总是比 JavaScript 写的东西要快。尽量使用原生方法。
- 本书涵盖了很多技术和方法，如果将这些优化应用在那些经常运行的代码上，你将会看到巨大的性能提升。
