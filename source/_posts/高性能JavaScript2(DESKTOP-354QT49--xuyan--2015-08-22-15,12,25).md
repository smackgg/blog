title: JavaScript数据访问的优化
date: 2015-07-31 13:42:30
tags: 高性能JavaScript学习笔记
categories: 高性能JavaScript-2
---
**第二章 Data Access 数据访问**
===
本文章结尾处有结论，不愿意看原理或者已经懂原理的可以直接看结论。
<!--more-->
---
　　经典计算机科学的一个问题是确定数据应当存放在什么地方， 以实现最佳的读写效率。数据存储的位置关系到访问的速度。在 JavaScript 中，有四种基本的数据访问位置：
> - 直接量： 包括字符串，数字，布尔值，对象，数组，函数，正则表达式，具有特殊意义的空值（null），以及未定义（undefined）。
> - 变量：用 var 关键字创建用于存储数据值。
> - 数组项：具有数字索引，存储一个 JavaScript 数组对象。
> - 对象成员：具有字符串索引，存储一个 JavaScript 对象。

　　在一些老的浏览器中，直接量和局部变量的访问速度远远快于数组项和对象成员的访问速度（Firefox3 中优化过数组项，所以访问速度非常快）。**所以，如果关心运行速度，建议尽量使用直接量和局部变量，限制数组项和对象成员的使用。下图是对不同数据类型进行 200 000 次读操作所用的时间
![对不同数据类型进行 200 000 次读操作所用的时间](http://7xkj1z.com1.z0.glb.clouddn.com/高性能js-img2-1.png)
> 下面介绍几种模式来避免这种情况并优化你的代码。

一.Managing Scope 管理作用域
===
---
　　无论是从性能还是功能考虑，作用域链都是理解JavaScript的关键。但是要理解速度与作用域的关系，首先要理解作用域的工作原理。
**1.Scope Chains and Identifier Resolution 作用域链和标识符解析**
在这里不详细叙述作用域的工作原理，只是简单的说明一下作用域链的工作过程。如果想看详细原理，请参看我的文章[作用域链和标识符详细解析](http://www.winnerweb.club/2015/07/31/%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE%E5%92%8C%E6%A0%87%E8%AF%86%E7%AC%A6%E8%AF%A6%E7%BB%86%E8%A7%A3%E6%9E%90/)。
　　每一段 JavaScript 代码（全局代码或者函数）都有一个与之关联的作用域链(scope chain)。这个作用域链是一个对象链表，这组对象定义了这段代码“作用域中”的变量。当JavaScript需要查找变量x的值得时候（这个过程叫做变量解析），它会从链中的第一个对象(第一个对象是局部变量)开始查找，如果这个对象有一个名为x的属性，则会直接使用，若第二个对象依然没有，则会继续寻找下一个对象。以此类推，直至全局对象。若作用域链上没有任何一个对象含有属性x，那么就会返回一个undefined，在严格规范的ECMAScript 5中，会抛出一个异常。函数运行时每个标识符都要经过这样的搜索过程，正是这种搜索过程影响了性能。

**Identifier Resolution Performance 标识符识别性能**
　　在运行期上下文中，一个标识符所处的位置越深，读写速度也就越慢，所以局部变量访问速度是最快的，全局变量位于作用域链的最后一个位置是最慢的。下图展示了不同深度标识符的读写速度。（第一个写，第二个是读）
![写操作的标识符识别速度](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-2.png)
![读操作的标识符识别速度](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-3.png)
　　采用优化JavaScript引擎的浏览器，如Safari4，访问域外标识符时没有性能的损失。其它浏览器都有较大幅度的影响。早期的IE6和Firefox2，有着令人难以置信的陡峭斜坡，如果此图包含它们的数据，曲线高点将超出图表边界。
> 所以，在没有优化JavaScript引擎的浏览器中，尽可能使用局部变量。用局部变量存储本地范围之外的变量值。如果在函数中多次使用，参考以下例子：

	function initUI(){
		var bd = document.body,
		links = document.getElementsByTagName_r("a"),
		i = 0,
		len = links.length;
		while(i < len){
			update(links[i++]);
		}
		document.getElementById("go-btn").onclick = function(){
			start();
		};
		bd.className = "active";
	}
　　次函数包含对document的引用，而document是全局变量。每次搜索此变量都要遍历整个作用域链。上述代码可以优化为：

	function initUI(){
		var doc = document,
		bd = doc.body,
		links = doc.getElementsByTagName_r("a"),
		i = 0,
		len = links.length;
		while(i < len){
			update(links[i++]);
		}
		doc.getElementById("go-btn").onclick = function(){
			start();
		};
		bd.className = "active";
	}
　　这个简单的函数不会显示出巨大的改进，如果几十个全局变量被反复访问，那么这么做性能将有显著的提高。
**Scope Chain Augmentation 改变作用域链**
　　一般来说，一个运行期上下文的作用域链不会被改变。但是，有两种表达式可以在运行时临时改变运行期上下文作用域链。第一个是 with 表达式。第二种是try-catch。with 表达式为所有对象属性创建一个默认操作变量。在其他语言中，类似的功能通常用来避免书写一些
重复的代码。initUI()函数可以重写成如下样式：

	function initUI(){
		with (document){ //avoid!
		var bd = body,
		links = getElementsByTagName_r("a"),
		i = 0,
		len = links.length;
		while(i < len){
			update(links[i++]);
		}
		getElementById("go-btn").onclick = function(){
			start();
		};
			bd.className = "active";
		}
	}
　　**此重写的 initUI()版本使用了一个with表达式，避免多次书写“document”。这看起来似乎更有效率，而实际上却产生了一个性能问题。**
当代码流执行到一个with表达式时，运行期上下文的作用域链被临时改变了。一个新的可变对象将被创建，它包含指定对象的所有属性。此对象被插入到作用域链的前端，意味着现在函数的所有局部变量都被推入第二个作用域链对象中，所以访问代价更高了，正因为这个原因，最好不要使用 with 表达式。正如前面提到的，只要简单地将 document 存储在一个
局部变量中，就可以获得性能上的提升。（见下图）。
![with 表达式改变作用域链](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-4.png)。
　　在 JavaScript 中不只是 with 表达式人为地改变运行期上下文的作用域链，try-catch 表达式的 catch 子句具有相同效果。当 try 块发生错误时，程序流程自动转入 catch 块，并将异常对象推入作用域链前端的一个可变对象中。在 catch 块中，函数的所有局部变量现在被放在第二个作用域链对象中。例如：

	try {
		methodThatMightCauseAnError();
	} catch (ex){
		alert(ex.message); //scope chain is augmented here
	}
**请注意，只要 catch 子句执行完毕，作用域链就会返回到原来的状态。**
　　如果使用得当， try-catch 表达式是非常有用的语句，所以不建议完全避免。 如果你计划使用一个 try-catch语句，请确保你了解可能发生的错误。一个 try-catch 语句不应该作为 JavaScript 错误的解决办法。如果你知道一个错误会经常发生，那说明应当修正代码本身的问题。
你可以通过精缩代码的办法最小化catch子句对性能的影响。一个很好的模式是将错误交给一个专用函数来处理。例子如下：

	try {
		methodThatMightCauseAnError();
	} catch (ex){
		handleError(ex); //delegate to handler method
	}
　　handleError()函数是 catch 子句中运行的唯一代码。此函数以适当方法自由地处理错误，并接收由错误产生的异常对象。由于只有一条语句，没有局部变量访问，作用域链临时改变就不会影响代码的性能。
**Dynamic Scopes 动态作用域**
　　无论是 with 表达式还是 try-catch 表达式的 catch 子句，以及包含()的函数，都被认为是动态作用域。一个动态作用域只因代码运行而存在，因此无法通过静态分析（察看代码结构）来确定（是否存在动态作用域）

	function execute(code) {
		(code);
		function subroutine(){
			return window;
		}
		var w = subroutine();
		//what value is w?
	};
　　execute()函数看上去像一个动态作用域，因为它使用了()。w 变量的值与 code 有关。大多数情况下，w将等价于全局的window对象，但是请考虑如下情况：
	
	execute("var window = {};")
　　这种情况下，()在 execute()函数中创建了一个局部window变量。所以w将等价于这个局部window变量而不是全局的那个。所以说，不运行这段代码是没有办法了解具体情况的，标识符 window 的确切含义不能预先确定。
　　优化的 JavaScript 引擎，例如 Safari 的 Nitro 引擎，企图通过分析代码来确定哪些变量应该在任意时刻被访问，来加快标识符识别过程。这些引擎企图避开传统作用域链查找，取代以标识符索引的方式进行快速查找。当涉及一个动态作用域后，此优化方法就不起作用了。引擎需要切回慢速的基于哈希表的标识符识别方法，更像传统的作用域链搜索。
　　正因为这个原因，只在绝对必要时才推荐使用动态作用域。
**Closures, Scope, and Memory 闭包，作用域，和内存**
　　闭包是 JavaScript 最强大的一个方面，它允许函数访问局部范围之外的数据。闭包的使用通过 Douglas
Crockford的著作流行起来，当今在最复杂的网页应用中无处不在。不过，有一种性能影响与闭包有关。
　　为了解与闭包有关的性能问题，考虑下面的例子：

	function assignEvents(){
		var id = "xdi9592";
		document.getElementById("save-btn").onclick = function(event){
			saveDocument(id);
		};
	}
　　当 assignEvents()被执行时，一个激活对象被创建，并包含了一些应有的内容，其中包括 id变量。它将成为运行期上下文作用域链上的第一个对象，全局对象是第二个。当闭包创建时，[[Scope]]属性与这些对象一起被初始化（见下图）。
![assignEvents()运行期上下文的作用域链和闭包](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-5.png)。
　　由于闭包的[[Scope]]属性包含与运行期上下文作用域链相同的对象引用，会产生副作用。通常，一个函数的激活对象与运行期上下文一同销毁。当涉及闭包时，激活对象就无法销毁了，因为引用仍然存在于闭包的[[Scope]]属性中。这意味着脚本中的闭包与非闭包函数相比，需要更多内存开销。在大型网页应用中，
这可能是个问题，尤其在 Internet Explorer 中更被关注。IE 使用非本地 JavaScript 对象实现 DOM 对象，闭包可能导致内存泄露（更多信息参见第 3 章）。
　　当闭包被执行时，一个运行期上下文将被创建，它的作用域链与[[Scope]]中引用的两个相同的作用域链同时被初始化，然后一个新的激活对象为闭包自身被创建（参见下图）。
![闭包运行](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-6.png)。
　　注意闭包中使用的两个标识符，id 和 saveDocument，存在于作用域链第一个对象之后的位置上。这是闭包最主要的性能关注点：你经常访问一些范围之外的标识符，每次访问都导致一些性能损失。
>在脚本中最好是小心地使用闭包，内存和运行速度都值得被关注。但是，你可以通过本章早先讨论过的关于域外变量的处理建议，减轻对运行速度的影响：将常用的域外变量存入局部变量中，然后直接访问局部变量。

**Prototypes 原形**
　　JavaScript中的对象是基于原形的。原形是其他对象的基础，定义并实现了一个新对象所必须具有的成员。这一概念完全不同于传统面向对象编程中“类”的概念，它定义了创建新对象的过程。原形对象为所有给定类型的对象实例所共享，因此所有实例共享原形对象的成员。
　　一个对象通过一个内部属性绑定到它的原形。Firefox，Safari，和 Chrome 向开发人员开放这一属性，称作__proto__其他浏览器不允许脚本访问这一属性。任何时候你创建一个内置类型的实例，如 Object 或 Array，这些实例自动拥有一个 Object 作为它们的原形。
　　因此，对象可以有两种类型的成员：实例成员（也称作“own”成员）和原形成员。实例成员直接存在于实例自身，而原形成员则从对象原形继承。考虑下面的例子：

	var book = {
		title: "High Performance JavaScript",
		publisher: "Yahoo! Press"
	};
	alert(book.toString()); //"[object Object]"
此代码中，book 对象有两个实例成员：title 和 publisher。注意它并没有定义 toString()接口，但是这个接口却被调用了，也没有抛出错误。toString()函数就是一个 book 对象继承的原形成员。下图显示出它们之间的关系。
![实例与原形的关系](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-7.png)。
　　处理对象成员的过程与变量处理十分相似。当 book.toString()被调用时，对成员进行名为“toString”的搜索，首先从对象实例开始，如果 book 没有名为 toString 的成员，那么就转向搜索原形对象，在那里发现了toString()方法并执行它。通过这种方法，booke 可以访问它的原形所拥有的每个属性或方法。
　　你可以使用 hasOwnProperty()函数确定一个对象是否具有特定名称的实例成员，（它的参数就是成员名称）。要确定对象是否具有某个名称的属性，你可以使用操作符 in。例如：

	var book = {
		title: "High Performance JavaScript",
		publisher: "Yahoo! Press"
	};
	alert(book.hasOwnProperty("title")); //true
	alert(book.hasOwnProperty("toString")); //false
	alert("title" in book); //true
	alert("toString" in book); //true
　　此代码中， hasOwnProperty()传入“title”时返回true， 因为title是一个实例成员。 传入“toString”时返回false，因为 toString 不在实例之中。如果使用 in 操作符检测这两个属性，那么返回都是 true，因为它既搜索实例又搜索原形。
**Prototype Chains 原形链**
对象的原形决定了一个实例的类型。默认情况下，所有对象都是 Object 的实例，并继承了所有基本方法，如 toString()。你可以用“构造器”创建另外一种类型的原形。例如：
	
	function Book(title, publisher){
		this.title = title;
		this.publisher = publisher;
	}
	Book.prototype.sayTitle = function(){
		alert(this.title);
	};
	var book1 = new Book("High Performance JavaScript", "Yahoo! Press");
	var book2 = new Book("JavaScript: The Good Parts", "Yahoo! Press");
	alert(book1 instanceof Book); //true
	alert(book1 instanceof Object); //true
	book1.sayTitle(); //"High Performance JavaScript"
	alert(book1.toString()); //"[object Object]"
原型链关系如下图：
![原形链](http://7xkj1z.com1.z0.glb.clouddn.com/高性能JavaScript-img2-8.png)
　　注意，两个 Book 实例共享同一个原形链。每个实例拥有自己的 title 和 publisher 属性，但其他成员均继承自原形。当 book1.toString()被调用时，搜索工作必须深入原形链才能找到对象成员“toString”。正如你所
怀疑的那样，深入原形链越深，搜索的速度就会越慢。图2-11显示出成员在原形链中所处的深度与访问时间的关系。
　　虽然使用优化 JavaScript 引擎的新式浏览器在此任务中表现良好，但是老的浏览器，特别是 Internet Explorer 和 Firefox 3.5，每深入原形链一层都会增加性能损失。记住，搜索实例成员的过程比访问直接量
或者局部变量负担更重，所以增加遍历原形链的开销正好放大了这种效果。

**Nested Members 嵌套成员**
　　由于对象成员可能包含其它成员， 例如不太常见的写法 window.location.href 这种模式每遇到一个点号，JavaScript 引擎就要在对象成员上执行一次解析过程。成员嵌套越深，访问速度越慢。location.href 总是快于 window.location.href，而后者也要
比 window.location.href.toString()更快。
**Caching Object Member Values 缓存对象成员的值**

	function hasEitherClass(element, className1, className2){
		return element.className == className1 || element.className == className2;
	}
　　这段代码中element.className被访问了两次，而且在这个函数过程中它的值是不会变的。所以优化如下：

	function hasEitherClass(element, className1, className2){
		var currentClassName = element.className;
		return currentClassName == className1 || currentClassName == className2;
	}
>一般来说，如果在同一个函数中你要多次读取同一个对象属性，最好将它存入一个局部变量。以局部变量替代属性，避免多余的属性查找带来性能开销。在处理嵌套对象成员时这点特别重要，它们会对运行速度产生难以置信的影响。

Summary 总结
===
---
　　在JavaScript中，数据存储位置可以对代码整体性能产生重要影响。有四种数据访问类型：直接量，变量，数组项，对象成员。它们有不同的性能考虑。

> - 直接量和局部变量访问速度非常快，数组项和对象成员需要更长时间。
> - 局部变量比域外变量快，因为它位于作用域链的第一个对象中。变量在作用域链中的位置越深，访问所需的时间就越长。全局变量总是最慢的，因为它们总是位于作用域链的最后一环。
> - 避免使用 with 表达式， 因为它改变了运行期上下文的作用域链。 而且应当小心对待 try-catch 表达式的catch子句，因为它具有同样效果。
> - 嵌套对象成员会造成重大性能影响，尽量少用。
> - 一个属性或方法在原形链中的位置越深，访问它的速度就越慢。
> - 一般来说，你可以通过这种方法提高JavaScript代码的性能：将经常使用的对象成员，数组项，和域外变量存入局部变量中。然后，访问局部变量的速度会快于那些原始变量。

---
通过使用这些策略，你可以极大地提高那些需要大量 JavaScript 代码的网页应用的实际性能。