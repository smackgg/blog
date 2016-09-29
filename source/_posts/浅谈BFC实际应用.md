title: 浅谈BFC的实际应用
date: 2015-08-8 12:19:21
tags: CSS
categories: 浅谈BFC实际应用
---
BFC在开发非常重要，每个人对其理解都有不同。本文章主要讨论BFC的一些实际应用。
<!--more-->
　　BFC 的英文全称是：block formatting context（块级格式化文本）。BFC可以理解为一个独立的渲染块，或者说是CSS布局单位。

常见BFC的触发条件
===
---
常见BFC的触发条件有：

{% codeblock lang:css %}
	position: absolute/fixed;
	diplay: inline-block/table-cells/table-captions;
	overflow: hidden;/* 不为visible的值 */
	float: left/right;
{% endcodeblock %}
下面来简单的看一个例子。
由于< span>标签默认是行级元素，所以不能给其设置宽高，如果添加属性diplay：block; 它就可以设置宽高了。
{% codeblock lang:css %}
	span{
		position: absolute;
		width: 100px;
		height: 100px;
		background-color: #000;
	}
{% endcodeblock %}

将这样一段CSS添加给< span>标签，改变的宽高就会生效。但并没有给其添加display:block属性。同样的"float: left/right;"和 "position: absolute/fixed;"也都会使其生效。实际上在使用这些属性的过程中，相当于隐式的给< span>标签添加了属性"display: inline-block"。
这一性质其实并不常用，因为即使你不知道这些，你也可以在< span>标签中手动的添加一个"display: block"来改变其宽高。

---
margin塌陷问题
===
先看一下这段代码：

{% codeblock lang:css %}
/* CSS代码 */
	.wrapper{
		width: 200px;
		height: 200px;
		background-color: #fcc
	}
	.content{
		margin-top: 100px;
		width: 100px;
		height: 100px;
		background-color: #ffc;
	}
{% endcodeblock %}
{% codeblock lang:html %}
// HTML代码
	<div class="wrapper">
		<div class="content"></div>
	</div>
{% endcodeblock %}

我们再看一下这段代码执行后的效果：
![margin塌陷](http://7xkj1z.com1.z0.glb.clouddn.com/BFC1.png)
按正常的理解，这段代码执行后的效果不应该是这样，我们想要的是子容器在父容器内部产生margin-top，而不是父容器产生margin-top。这就是大家熟知的margin塌陷问题，解决这个问题的方法有很多，有一种bug解决方法，可以在".wrapper"中加入"border:1px solid #ccc;"。当然，正常的解决方式就是利用BFC。
将触发BFC的条件属性写入".wrapper"中，在这里不在写出代码。就可以解决这个问题。解决之后的效果是这样的：
![margin塌陷](http://7xkj1z.com1.z0.glb.clouddn.com/BFC2.png)
上面的例子中还有一个很好玩的地方：

{% codeblock lang:css %}
/* CSS代码 */
	.wrapper{
		width: 200px;
		height: 200px;
		background-color: #fcc
		margin-top: 100px;
	}
	.content{
		margin-top: 100px;
		width: 100px;
		height: 100px;
		background-color: #ffc;
	}
{% endcodeblock %}
{% codeblock lang:html %}
// HTML代码
	<div class="wrapper">
		<div class="content"></div>
	</div>
{% endcodeblock %}
这段代码执行的结果与上面的一样，为什么我们给父容器添加的margin-top没有生效？其实这里不仅仅是发生了margin塌陷现象，实际上还发生了margin的重叠现象。子容器的margin-top与父容器的margin-top重叠了。解决办法同上，还是给父容器添加BFC。添加完BFC就会出现我们想要的效果。
![margin塌陷](http://7xkj1z.com1.z0.glb.clouddn.com/BFC3.png)

---
margin重叠
===
上面例子里有说到margin重叠，下面还有几种margin重叠的问题。看一下下面的例子。
{% codeblock lang:css %}
/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		margin-bottom: 100px;
	}
	.content2{
		height: 100px;
		width: 100px;
		background-color: green;
		margin-top: 100px;
	}
{% endcodeblock %}
{% codeblock lang:html %}
// HTML代码
	<div class="content1"></div>
	<div class="content2"></div>
{% endcodeblock %}
这段代码运行的结果为：
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC4.png)
看出问题了么，这两个margin发生了重叠，中间只有 100px 的距离。实际上，在这里的margin会取两个margin中大的数值作为实际显示出的数值。解决这个问题同样使用BFC。
{% codeblock lang:css %}
/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		margin-bottom: 100px;
	}
	.content2{
		height: 100px;
		width: 100px;
		background-color: green;
		margin-top: 100px;
	}
	.wrapper{
		overflow: hidden;
		/*position: fixed;*/
		/*position: absolute;*/
		/*display: inline-block;*/
		/*float: left;*/
	}
{% endcodeblock %}
{% codeblock lang:html %}
// HTML代码
	<div class="content1"></div>
	<div class="wrapper">
		<div class="content2"></div>
	</div>
{% endcodeblock %}
给任意一个content添加一个含有BFC的父容器，就可以解决这个问题。
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC5.png)
同样的问题会发生在其它块级元素中，比如< p>标签也会发生这种现象。

---
BFC可以看到BFC
===
叫这个标题感觉怪怪的，看一下下面的例子你就明白了。

{% codeblock lang:css %}
	/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		float: left;
	}
	.content2{
		height: 200px;
		width: 200px;
		background-color: green;
		/*float: left;*/
	}
{% endcodeblock %}
{% codeblock lang:html %}
	// HTML代码
	<div class="content1"></div>
	<div class="content2"></div>
{% endcodeblock %}
这个例子显示的结果为：
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC6.png)
这段代码第一个容器中添加了"float: left;"属性,这样content1就会覆盖content2，如果我们不想让它覆盖，可以给第二个容器添加属性"float:left;"。实际上，我们也可以给第二个容器中添加BFC的触发条件，这样也同样能解决这个问题。这个过程，你可以这样理解，第一个容器添加了"float:left;"这个BFC触发条件，使第二个容器看不到它，所以会覆盖，如果想让第二个容器看到第一个容器，就为它添加一个BFC，因为BFC可以看到BFC。（注意：有一点要特殊说明，虽然BFC可以解决这个问题，但是其中不包括position，因为实际上position是个定位属性，在这个问题中，即使BFC看到了BFC，它也会按照position原本的定位去执行，如果觉得我说的抽象，可以自己敲代码试试。）

---
清除浮动
===
至于清除浮动的原理和为什么要清除浮动在这里不细说，过两天可能会单独写一章来说清除浮动。这里要说的是利用BFC可以清除浮动。
{% codeblock lang:css %}
	/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		float: left;
	}
	.wrapper{
		border: 5px solid #000;
	}
{% endcodeblock %}
{% codeblock lang:html %}
	// HTML代码
	<div class="wrapper">
		<div class="content"></div>
		<div class="content"></div>
		<div class="content"></div>
	</div>
{% endcodeblock %}
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC7.png)
这里给父容器设置了border，是为了更方便的看出父容器没有被撑开，所以需要清除浮动。用BFC清除浮动很简单，只需要在父容器中添加BFC触发条件就可以。比如：
{% codeblock lang:css %}
	/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		float: left;
	}
	.wrapper{
		border: 5px solid #000;
		overflow: hidden;
	}
{% endcodeblock %}
{% codeblock lang:html %}
	// HTML代码
	<div class="wrapper">
		<div class="content"></div>
		<div class="content"></div>
		<div class="content"></div>
	</div>
{% endcodeblock %}
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC8.png)
再来一个添加"float:left;"的效果图
![margin重叠](http://7xkj1z.com1.z0.glb.clouddn.com/BFC9.png)
注意：利用BFC清除浮动其实有很多问题
position:relative 在这里不会清除浮动，不细说。
position:absolute 将父容器的定位都改变了，在开发中这不是一个很好的做法。
float: left 也是同理，虽然清除了子元素的浮动，却给父元素添加了浮动，如果不是特殊需要，这种方法也不是一个好的方法。
overflow: hidden 有一个致命的问题，如果内容超出父容器或定位到父容器，就不会被看到，而且它不是按宽高撑开的。
display: inline-block 在IE6 和IE7中没有这个属性值，所以行不通。
补充: IE6 和 IE7 中清除浮动，我们需要触发其中的hasLayout为true，hasLayout为true就相当于BFC，那么怎么触发呢？只要将zoom设置为不为0的值。（zoom值为同比例缩放）,下面是css hack解决方式(开发中尽量避免css hack)。
{% codeblock lang:css %}
	/* CSS代码 */
	.content1{
		height: 100px;
		width: 100px;
		background-color: red;
		float: left;
	}
	.wrapper{
		border: 5px solid #000;
		overflow: hidden;
		_zoom: 1;	IE6
		*zoom: 1; 	IE6/7
	}
{% endcodeblock %}
{% codeblock lang:html %}
	// HTML代码
	<div class="wrapper">
		<div class="content"></div>
		<div class="content"></div>
		<div class="content"></div>
	</div>
{% endcodeblock %}

---
BFC的一些常见的简单应用就写到这里，可能后续还会有补充。关于BFC详细原理可以自己查一下，网上有很多介绍。有什么问题欢迎评论！