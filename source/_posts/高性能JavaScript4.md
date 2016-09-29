title: JavaScript 算法和流程控制的优化
date: 2015-08-2 23:12:08
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-4
---
**第四章 Algorithms and Flow Control 算法和流程控制**
===
本章主要讨论算法和流程控制的优化。
<!--more-->
---
> - 在循环中，只有for-in明显比其它的循环要慢。
由于每次迭代操作要搜索实例或原形的属性，for-in 循环每次迭代都要付出更多开销，所以比其他类型循环慢一些。因此除非需要对不知道数目的对象进行操作，否则尽量避免使用for-in循环。

> - 循环中length局部变量缓存，在上章讨论过，这里不再多说。

	for (var i=0, len=items.length; i < len; i++){
		process(items[i]);
	}
> - 使用达夫设备来减少循环迭代的次数(达夫设备在这里不详细叙述，感兴趣可以自己查资料学习一下)。

	//credit: Jeff Greenberg
	var iterations = Math.floor(items.length / 8),
	startAt = items.length % 8,
	i = 0;
	do {
		switch(startAt){
			case 0: process(items[i++]);
			case 7: process(items[i++]);
			case 6: process(items[i++]);
			case 5: process(items[i++]);
			case 4: process(items[i++]);
			case 3: process(items[i++]);
			case 2: process(items[i++]);
			case 1: process(items[i++]);
		}
		startAt = 0;
	} while (--iterations);

> - 可以利用二分法优化if-else。 在条件不规则而且很多的情况下，switch要比if-else快一些。

> - 当有大量离散的值需要测试时，尽量使用查表法代替switch或if-else。

	//define the array of results
	var results = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10]
	//return the correct result
	return results[value];
> - 错误的递归会导致长时间的运行，还会遇到浏览器调用栈大小的限制。
> - 使用优化的循环替代长时间运行的递归函数可以提高性能。因为运行一个循环比反复调用一个函数的开销要低。

> - 利用制表来将每次循环或递归的结果缓存，来优化性能。

	function memfactorial(n){
	if (!memfactorial.cache){
		memfactorial.cache = {
		"0": 1,
		"1": 1
	};
	}
	if (!memfactorial.cache.hasOwnProperty(n)){
		memfactorial.cache[n] = n * memfactorial (n-1);
	}
	return memfactorial.cache[n];

下面代码是封装一个制表的函数。

	function memoize(fundamental, cache){
		cache = cache || {};
		var shell = function(arg){
			if (!cache.hasOwnProperty(arg)){
				cache[arg] = fundamental(arg);
			}
			return cache[arg];
		};
		return shell;
	}
	
---
Summary 总结
===
---

> - for，while，do-while 循环的性能特性相似，谁也不比谁更快或更慢。
> - 除非你要迭代遍历一个属性未知的对象，否则不要使用 for-in 循环。
> - 改善循环性能的最好办法是减少每次迭代中的运算量，并减少循环迭代次数。
> - 一般来说，switch 总是比 if-else 更快，但并不总是最好的解决方法。
> - 当判断条件较多时，查表法比 if-else 或者 switch 更快。
> - 浏览器的调用栈尺寸限制了递归算法在 JavaScript 中的应用；栈溢出错误导致其他代码也不能正常执行。
> - 如果你遇到一个栈溢出错误，将方法修改为一个迭代算法或者使用制表法可以避免重复工作。
> - 运行的代码总量越大，使用这些策略所带来的性能提升就越明显。
