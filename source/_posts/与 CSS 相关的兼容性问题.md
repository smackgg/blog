title: 与 CSS 相关的兼容性问题
date: 2015-08-21 01:25:32
tags: 兼容性
categories: 与 CSS 相关的兼容性问题
keywords: CSS, CSS兼容性, 前端兼容性, 兼容性
---
不同浏览器的兼容问题一直是前端开发工程师最头疼的问题，本系列文章记录一些常见和不常见的兼容性问题，因为兼容性问题太多了，所以内容可能有些杂乱，涉及的方面也肯定非常广,这里大多数只叙述问题和解决办法，而不细说原理，想了解原理的可以自行在网上查找。下面开始正文，本系列先从CSS开始。
<!--more-->

---
一：语法和基本数据类型
===
> - 1、@charset 一定要放在样式表的最前面，否则在 Chrome和Safari中，@charset后面的规则集(样式)将失效。
> - 2、如果一个外部 CSS 文件的编码与引入该文件的 HTML 文件的编码不一致，并且没有显式的声明该 CSS 文件的编码，在某些情况下会造成 CSS 的解析错误。解决办法：统一编码。

{% codeblock lang:css %}
	h1 {
	  margin:0;
	  width:100px;
	  height:100px;
	  background:blue;
	  font:20px/100px "黑体";
	  text-decoration:underline;
	  color:red;
	}
{% endcodeblock %}
如果上述CSS文件编码为GB2312，而引入的页面编码为UTF-8，在IE6中会从“黑体”往后的所有都被忽略（包括“黑体”），在其他浏览器只会将“黑体”忽略。
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性1.png)
解决办法之一就是在CSS文件头部添加@charset "UTF-8"。
> - 3、url中出现空白，在大部分浏览器中无法正确读取地址。但是IE6和IE7可以识别(经测试IE6/7也只能识别TAB和回车，空格也识别不出)。解决办法：避免url中出现空白。

{% codeblock lang:html %}
	<!DOCTYPE html>
	<html>
	<head>
	<style>
		div.text { font-size:40px; float:left; border:1px solid black; color:navy; }
		#text2 { background-image:url(go    ogle.
		gif); }
	</style>
		</head>
		<body style="font:12px/1.2 'Trebuchet MS';">
		<div id="text1" class="text" style="background-image:url(goo  gle_s
		mall.gif);">some text 1</div>
		<br /><br /><br /><br /><br />
		<div id="text2" class="text">some text 2</div>
	</body>
	</html>
{% endcodeblock %}
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性2.png)
> - 4、正确地使用 CSS 的空白字符，避免使用表意空格 (U+3000)（表意空格（Ideographic Space），也可以叫全角空格（Full-width Space），对应的 HTML 实体字符为“&#12288”。在相同的等宽中文字体下，全角空格的宽度与普通汉字的宽度相等）。这个不一一列举了，每个浏览器支持情况不同，避免使用就好。

---
二：选择器
===
> - 1、IE6/IE7(Q)/IE8(Q)中不支持子选择器(如 ul>li)、兄弟选择器(如 div+p)、属性选择器([att]、[att=val]、[att~=val]、[att|=val])、 ':first-child'伪元素，避免在上述情况使用。
> - 2、a标签的四个常用的伪类：':link'、':visited'、':hover'、':active',使用的顺序一定要是：L-V-H-A 来排序，虽然这一问题在IE6/IE7(Q)/IE8(Q)没有影响，但是其它的浏览器还是会有各种问题。
> - 3、IE6/IE7(Q)/IE8(Q)中不支持a元素以外的元素使用':hover'伪类。
>>解决办法：使用 JavaScript 绑定 'onmouseover' 和 'onmouseout'（模仿 ':hover'）；使用 Whatever:hover 插件，该插件利用 IE 特有的 CSS 行为（behavior）及通过 JavaScript 来模拟 ':hover' 伪类的效果。
> - 4、IE6/IE7/IE8(Q)中不支持a元素以外的元素使用':active'伪类。
>>解决办法：使用 JavaScript 绑定 'onmousedown' 和 'onmouseup'（模仿 ':active'）；同样的你可以使用 Whatever:hover 插件。
> - 5、IE6/IE7/IE8(Q)不支持':focus'伪类。
>>解决办法：使用 JavaScript 绑定 onfocus onblur 事件模仿 ':focus'效果；
或者使用 Whatever:hover。
> - 6、IE6/IE7/IE8(Q)不支持 ':before' 和 ':after' 伪元素	
>>解决办法：使用 JavaScript 判断 IE6 IE7 IE8(Q) 并在其中通过脚本实现 ':before' 及 ':after' 伪元素的效果；使用 jQuery 的插件 Pseudo Plugin，该组件利用 IE 特有的 CSS 行为（behavior）及 CSS 表达式来模拟 ':before' 及 ':after' 伪元素的效果。

---
三、指定特性值，层叠和继承
===
> - 1、IE6/IE7/IE8/Opera 中不支持'inherit'这个继承属性。

IE8(S)中，块级元素无法通过设置'display:inherit'、特性值，显式性继承绝大部分行内元素的默认'display'特性值，但却可以显示性继承 BUTTON 元素的默认 'display' 特性。在Opera 中，P 元素无法通过设置 'border:inherit' 特性值，显式性继承 BUTTON 元素的默认 'border' 特性。
解决办法：
使用标准模式渲染页面；
在 IE6 IE7 退出舞台之前避免使用 'inherit' 值显式性的继承样式设定；
在 IE8 内不使用 'inherit' 值显式性继承行内元素的默认 'display' 特性值；
在 Opera 内，不对使用 'inherit' 值显式性继承 BUTTON 元素默认 'border' 特性值。
> - 2、在 Chrome 和 Safari 中，默认样式下的 B、STRONG 元素的 'font-weight' 特性计算值可能会受到其继承来的 'font-weight' 特性影响，在 IE8(S) 中，除 B、STRONG 外，H1~H6、TH 元素的'font-weight'特性也会受影响。在其他浏览器中，则完全不受影响。
>>解决办法：尽量为元素设置绝对明确的 'font-weight' 特性的值，避免使用 bolder、lighter 这类相对量以及浏览器的默认样式。
> - 3、 IE6 IE7(Q) IE8(Q) 不完全支持 !important 规则。不支持位于同一个选择器内的 '!important' 规则。

{% codeblock lang:html %}
	<style type="text/css">
	    div{
	        width:100px;
	        height:30px;
	        background-color:gold !important;
	        background-color:silver;
	    }
	</style>
	<div></div>
{% endcodeblock %}
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性3.png)
{% codeblock lang:html %}
	<style>
	  .c1 { background:blue !important; }
	  .c2 { background:green; }
	</style>
	<div style="width:100px; height:100px;" class="c1 c2"></div>
{% endcodeblock %}
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性4.png)

解决办法：这是浏览器的 Bug 导致，无法通过常规方式解决。不过，一般 '!important' 规则常常用于 CSS hack 以区分 IE6 与其他浏览器，其作为 hack 存在的意义已大于其本身的含义。

---
四、盒模型
===
> - 1、IE6 IE7 IE8(Q) 负边距 (margin) 导致元素溢出 hasLayout 容器时显示异常。
>> 解决办法：在确保元素的容器触发 hasLayout 的前提下，为该元素同时设置 'position:relative' 和 'zoom:1'。
首先需要保证容器在IE中触发 hasLayout 属性，可以通过zoom:1实现。在 IE7(S) 中，当使设置了负值 'margin' 的元素的 hasLayout 属性为 'true' ，即触发该元素的hasLayout特性后，此Bug现象消失，例如为该元素设置宽度或高度，或者在完全不影响该元素盒模型的情况下使用zoom:1 来触发 hasLayout 从而消除此 Bug 。在 IE6 IE7(Q) IE8(Q) 中，仅仅触发 hasLayout 特性并不一定能消除此 Bug ，同时还需要为该元素设置 'position:relative'，即在完全不影响该元素盒模型的情况下使用 zoom:1 'position:relative' 。
> - 2、Chrome Safari ，在 WebKit 内核的浏览器中，当元素满足三个条件时，宽度计算不符合规范：
元素的兄弟元素是浮动元素；元素的 'width' 特性值为 'auto'，'overflow' 特性值不是 'visible'；元素设置了与浮动同方向的 'margin' 值(如：当 'float:left' 时，设置 'margin-left' 值，当 'float:right' 时，设置 'margin-right')。
>>解决办法：
>>- 为该创建了 BFC 的元素设置一个明确的宽度; 
>>- 如果 'margin' 值不小于浮动元素的 margin box 的宽时，去掉'overflow:hidden'。
> - 3、Firefox 中 'display:table' 的元素的外边距不会与包含块的外边距折叠(也就是margin塌陷)。

{% codeblock lang:html %}
	<div style="background:gold;">Top line</div>
	<div style="background:gray; width:300px; margin:20px 0;">
	    <table cellpadding="0" cellspacing="0" style="background:pink; width:200px; margin:10px 0;">
	        <tr>
	            <td>TD</td>
	        </tr>
	    </table>
	</div>
	<div style="background:gold;">Bottom line</div>
{% endcodeblock %}
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性5.png)
>> 解决办法：由于 IE6 IE7 IE8(Q) Firefox 元素的 'margin' 处理与 W3C 规范中的差异，若我们需要利用 "margin collapse" 达到某些布局效果时，在这几种浏览器中可能会由于没有发生 "margin collapse" 而出现 "额外边距" 的情况。所以应避免为表格设置上下边距，以及导致其 "margin collapse" 的发生，可以使用为表格的父元素使用 'padding' 代替表格元素的 'margin' 。

> - 4、IE6 IE7 IE8(Q) 中浮动元素和定位元素某些情况下会影响普通流中毗邻 'margin' 的折叠。
>> 解决办法：
>> - 根据具体需求，调整 'margin' 的位置和大小；
>> - 使用 CSS hack 设置 IE 中的 'margin' 大小，以避免 IE 跟其他浏览器的布局差异。
> - 5、在 IE6 IE7 IE8(Q)下，容器触发 hasLayout 导致其左浮动子元素 'margin-bottom' 消失。

{% codeblock lang:html %}
	<span>content_text</span>
	<div style="zoom:1; overflow:hidden; background:lightgrey;">
	    <div style="float:left; width:50px; height:50px; margin:20px; background:dimgray;"></div>
	</div>
	<span>content_text</span>
{% endcodeblock %}
![CSS兼容性](http://7xkj1z.com1.z0.glb.clouddn.com/CSS兼容性6.png)
>> 解决办法：为容器显式地设置高度。若容器高度不定，则要避免在触发了 hasLayout 的容器内的浮动子元素上设置 'margin-bottom' 特性，可以通过为容器设置 'padding-bottom' 达到相似的效果。只要不同时触发父元素hasLayout、子元素左浮动、左浮动子元素拥有非零的 margin-bottom 值，这三个条件中任意一项，均可解决此问题。

> - 6、IE6 IE7 IE8(Q) 中，若一个触发了 hasLayout 的元素其内第一个非空白节点 (即 children[0]) 为 TEXTAREA 元素 或者 type 属性值为 text、password、submit、reset、button、file 的 INPUT 元素，并且这个元素设定了 'margin-left'、'margin-right' 特性，则 'margin-left'、'margin-right' 特性指定的值会应用于其相应方向的 padding 上。
>> 解决办法：在 INPUT、TEXTAREA 元素之前放一个触发了 hasLayout 的空 SPAN 元素。

---
五、渲染模型
===
> - 1、各浏览器对 'display' 特性值的支持程度不同。
>> 解决办法：尽量仅使用所有浏览器都支持的 'display' 特性值：'inline'、'block'、'list-item'、'none'。在 IE6 IE7 IE8(Q) 中实现块元素的 'display:inline-block' 特性值支持，需要先将块元素设置为行内元素，并设置可以在 IE6 IE7 IE8(Q) 内触发 haslayout 特性的专有特性 'zoom:1'。行内元素实现 'display:inline-block' 特性值支持只需直接设置此特性值或同样使用 'zoom:1' 即可。

> - 2、在IE早期版本中的元素触发了haslayout，但是没有触发BFC，会导致在IE和其它浏览器中的布局有差异。（如何触发haslayout和BFC在这里不细说）
>> 解决办法：仅当一个元素即在 IE 早期版本中触发了 hasLayout，又在其他浏览器中创建了 block formatting context 时，才能避免上述问题的发生。即同时启用上述两者以保证各浏览器的兼容，或者相反，两者皆不启用。

> - 3、BFC在各浏览器中的问题：
1.当容器有足够的剩余空间容纳 BFC 的宽度时，所有浏览器都会将 BFC 放置在浮动元素所在行的剩余空间内。
2.在 IE6 IE7 IE8 Chrome Opera 中，当 BFC 的宽度介于 "容器剩余宽度" 与 "容器宽度" 之间时，BFC 会显示在浮动元素的下一行；在 Safari 中，BFC 则仍然保持显示在浮动元素所在行，并且 BFC 溢出容器；在 Firefox 中，当容器本身也创建了 BFC 或者容器的 'padding-top'、'border-top-width' 这些特性不都为 0 时表现与 IE8(S)、Chrome 类似，否则表现与 Safari 类似。
3.在 IE6 IE7 IE8 Opera 中，当 BFC 的宽度大于 "容器宽度" 时，BFC 会显示在浮动元素的下一行；在 Chrome Safari 中，BFC 则仍然保持显示在浮动元素所在行，并且 BFC 溢出容器；在 Firefox 中，当容器本身也创建了 BFC 或者容器的 'padding- top'、'border-top-width' 这些特性不都为 0 时表现与 IE8(S) 类似，否则表现与 Chrome 类似。
>> 解决办法：合理地设置容器的宽度、浮动元素的宽度、BFC 的宽度的值，尽量保证 BFC 的宽度小于 "容器的剩余空间宽度" 。若需要 BFC 折行显示在新的一行上，可以通过 BFC 设置 'clear' 特性等手段使其换行。

> - 4、在 IE6 IE7 IE8(Q) 中，一个零高度的浮动元素仍能阻挡与其向相同方向浮动的兄弟元素。
>> 解决办法：如果希望一个浮动元素能阻挡与其向相同方向浮动的兄弟元素，请确保其高度不为零；否则，请隐藏该元素，以使页面布局在各浏览器中的表现一致。

> - 5、IE6 IE7 IE8(Q) 下，若浮动元素之前存在兄弟行内非浮动元素，IE 会将浮动元素所在的“当前行”认为是其前边的兄弟行内元素所产生的匿名框的底边，导致该浮动元素折行。
>> 解决办法：依具体情况可以使用三种方法：使用绝对定位模拟右浮动、使用 IE hack 专门在IE6 IE7 中设置负的上外边距、将右浮动的 SPAN 元素调整到所有非浮动 SPAN 元素之前。

> - 6、在 IE6 IE7 IE8(Q) 下，为 'clear' 元素设置负的 'margin-top' 时， 'clear' 元素的顶部 'border-box' 出现在了其之前浮动元素的底部 'margin-box' 之上。
>> 解决办法：尽量避免为 'clear' 特性不为 none 的元素（即清理元素）设置 'margin-top' 特性，尤其是负值。若需要为该元素设置正的 'margin-top' 特性，可以将 'clear' 元素当做容器，在其内部加入设置了 'margin-top' 的元素。若需要为该元素设置负的 'margin-top' ，可以为浮动元素设置负的 'margin-bottom' 以缩小其 'margin-box' ，提高了其底部 'margin-box' 的位置，从而使 'clear' 元素可以产生向上移动的效果。

> - 7、IE6 IE7 IE8(Q) 中，使用 'clear' 特性清除浮动后，浮动元素的容器若没有触发 hasLayout，则其背景将会丢失。
>> 解决办法：使丢失背景的容器触发 IE 浏览器特有的 hasLayout，如 'zoom:1'，或者设置宽度和高度。

> - 8、在IE6 IE7 IE8(Q)中，如果 clear 特性被设置在一个浮动的元素上，该浮动元素会与其前边的浮动元素放置在同一行。位于其后的浮动元素的外顶边高于该元素的外顶边。
>> 解决办法：不要将 'clear' 特性应用在浮动元素上，以免出现上述不兼容的问题。

> - 9、IE6 IE7 IE8(Q) 中一些拥有默认上下外边距的块级元素（浏览器设置的）在浮动，或触碰到触发了 hasLayout 特性的容器后，上下外边距会消失。
>> 解决办法：用自定义的 'margin' 取代浏览器的默认外边距样式。

> - 10、IE 中触发了 hasLayout 的容器同时使用 'clear' 特性清除浮动在某些情况下导致 'padding-top' 渲染异常。
>> 解决办法：
>> - 不触发容器的 hasLayout 特性；
>> - 若容器触发了hasLayout 特性，尽量不为其设置 'padding-top' 特性；
>> - 若容器触发了hasLayout 特性，且必须为容器设置 'padding-top' 特性，可以考虑使用 ':after' 的清除方式。

> - 11、Firefox 浏览器对 'display:table' 中绝对定位元素包含块的判定有错误，可能会导致绝对定位元素位置跟其他浏览器中有差异。
>> 解决办法：这是 Firefox 的一个 bug，绝对定位元素无法根据 'display' 特性是 'table' 且是绝对定位的祖先元素定位。为达到相同的效果可以改变元素的 containing block 或者改变元素的定位方式。为达到相同的效果，可以采用如下方式替代：
改变元素的 containing block：让绝对定位元素相对于 TABLE 元素的单元格定位，即，在 TD 上设置 'position:absolute' ；或者改变元素的定位方式：把绝对定位元素的 'absolute' 改为 'relative' ，用相对定位。

> - 12、 IE6 IE7 IE8(Q) Firefox Opera 中若绝对定位元素没有设置其 'top' 、 'right' 、 'bottom' 、 'left' 特性，则这四个特性的值为默认的 'auto' ，由于各浏览器对规范理解的差异，会导致页面布局差异。
>> 解决办法：首先对于绝对定位元素，应尽可能避免使其 'top'、'right'、'bottom'、'left' 特性的值均为 'auto'。若必须这么做，则尽可能的保证绝对定位元素之前的兄弟元素为非浮动的块级元素。

> - 13、IE6 IE7(Q) IE8(Q) 不支持固定定位（position:fixed）。
>> 解决办法：在 IE6 IE7(Q) IE8(Q) 中为固定定位元素设置 'position:absolute'，再通过 JavaScript 脚本或者 CSS Expression 动态设置其偏移量。参考代码如下：

	<body style="font:12px Arial; _background-attachment:fixed; _background-image:url(about:blank);">
	<div style="width:10000px; height:10000px;"></div>
	<div id="d" style="position:fixed; top:0; left:0; _position:absolute; _top:expression(offsetParent.scrollTop); _left:expression(offsetParent.scrollLeft); background:#ddd; width:100px; height:100px;"></div>
	</body>

> - 14、在 IE6 IE7 IE8(Q) 下，对于宽度超过容器的浮动元素，浏览器违背了浮动基本规则，导致其在浮动方向上溢出包含块。
>> 解决办法：当文字方向为 'ltr' 时应避免使右浮动元素的宽度超出其包含块的宽度。同样地，当文字方向为 'rtl' 时应避免使左浮动元素的宽度超出其包含块的宽度。

> - 15、当定位元素的 'z-index' 未设置时（默认为 auto），在 IE6 IE7 IE8(Q) 下将会创建一个新的局部层叠上下文。而在其它浏览器下，则严格按照规范，不产生新的局部层叠上下文。
>> 解决办法：理解层叠上下文、层叠级别与 'z-index' 之间的关系。在可能出现定位元素相互覆盖的情况时，明确指定定位元素的 'z-index' 特性，避免此问题的出现。

> - 16、IE6 IE7 IE8(Q) 中溢出容器的浮动元素导致容器兄弟元素文本定位错误。
>> 解决办法：及时地为容器清除浮动，并且确保浮动元素没有溢出容器。


> - 17、在 IE7(S) 中一个元素溢出的部分会被触发了 hasLayout 特性的元素遮盖。
>> 解决办法：合理设置元素的 'width'、'height' 和 'overflow' 特性，避免内容溢出容器。

> - 18、在 IE6 IE7(Q) IE8(Q) 下，若包含块没有触发 hasLayout 特性，则其内参照其定位的绝对定位元素的偏移位置计算会出现问题。
>> 解决办法：使包含块触发 hasLayout 特性。如 'zoom:1' 或者设置明确的宽度、高度。

> - 19、IE6 IE7 IE8(Q) Firefox 不支持 'display:run-in'。
>> 解决办法：'display:run-in' 特性目前用的地方不多，应用此特性的元素的最终状态 (inline-level 或 block-level) 要根据其上下文来判断，目前建议直接使用 'display:inline' 或 'display:block' 来固定元素的状态。

> - 20、包含块是行内元素，行内元素的绝对定位子元素位置，在各浏览器有差异。
>> 解决办法：各浏览器对于行内元素的包含块范围计算有误，因此建议，应尽可能避免将行内元素边界作为计算包含块边界的情况出现。


> - 21、在 IE6 IE7 IE8(Q) 中，TD/TH 及 TD 元素对设定 'position:relative' 特性及偏移有效，其他均无效；
在 IE8(S) 中，TD/TH 及 CAPTION 元素及它们相对于 CSS 中 display 特性值对设定 'position:relative' 特性及偏移有效，其他均无效；
在 Firefox 中，除 TABLE 之外的所有表格类元素以及它们相对于 CSS 中 display 特性值对设定 'position:relative' 特性及偏移均无效
在 Chrome Safari 中，CAPTION 元素及它相对于 CSS 中 display 特性值 'caption' 对设定 'position:relative' 特性及偏移有效，其他均无效；
在 Opera 中，COL、COLGROUP 元素以及它们相对于 CSS 中 display 特性值对设定 'position:relative' 特性及偏移无效，其他均有效。
>> 解决办法：由于除 TABLE 之外的表格类元素以及它们相对于 CSS 中 display 特性值设定了相对定位后的效果 CSS2.1 规范中没有明确定义，而各浏览器的实现又存在很大差异。所以应避免为这些元素设定 'position:relative'。若需要实现如冻结表格行或列的效果，可以考虑使用绝对定位其他 TABLE 元素的方式模拟。

> - 22、在 Safari Chrome 等使用 webkit 渲染引擎的浏览器中，'float:center' 是合法值，他等同于 'float:none' 设置，而其他浏览器则认为 ‘float’ 特性中 'center' 是个非法值，遵循规范应忽略此处的 'float' 特性设置。
>> 解决办法：避免使用非法的 'float' 特性值。

---
六、渲染模型的细节
===

> - 1、如果一个页面使浏览器工作在混杂模式下，那么当给一个设置了 'padding' 或 'border-width' 的非替换元素设置 'width' 或 'height' 以控制其尺寸时，这个元素在 IE 和其他览器中的实际尺寸将是不同的。
>> 解决办法：- 使用能触发标准模式 (S) 的 DTD
- 使用 CSS 3 的新特性：box-sizing


> - 2、在 IE6 IE7(Q) IE8(Q) 中，如果一个非替换元素的 'overflow' 为 'visible'，当该元素无法完全容纳其非绝对定位的内容时，该元素的尺寸将被其内容撑大。
在上述情况发生时，为这个非替换元素设置的 'width' 和 'height' 与 CSS 2.1 中的 'min-width' 和 'min-height' 的作用类似：设定值不是最终的实际值，实际值可能更大。
>> 解决办法：使用能触发标准模式 (S) 的 DTD，以将受此问题影响的浏览器的范围缩小到仅 IE6(S)。
如果不能保证一个希望尺寸固定的非替换元素总是能容纳其内容，请将该元素的 'overflow' 设置为非 'visible' 的值。


> - 3、在 IE6 IE7 IE8 中，'width' 或 'height' 任意一个或两个都设置为 '0' 的 IFRAME 元素是不可见的，而在其它浏览器中这样设置后的 IFRAME 元素仍可见。
>> 解决办法：根据实际情况选择使用 'visibility:hidden' 或者 'display:none' 隐藏 IFRAME 。


> - 4、在 IE6 IE7 IE8(Q) 中，如果一个浮动元素的宽度是 shrink-to-fit，该元素的最终宽度可能比预期的小，并被尽可能的向上布局。
>> 解决办法：这个问题的影响较大，避免该问题的最直接的方式是给浮动非替换元素指定一个宽度，而不使用其默认值 'auto'，从而避免其宽度为 shrink-to-fit，以使页面布局在各浏览器中的表现一致。

> - 5、在 Chrome Safari 中，若浮动元素之前存在一个非 inline 级元素（包括 block、table 等），且它们的包含块 'width' 特性计算值为 auto，则包含块的 shrink-to-fit 宽度计算会出现错误。
>> 解决办法：在容器为绝对定位、浮动或行内块元素且没有明确设定宽度时，若浮动元素之前出现非 inline 级元素，则要小心这个元素对容器 shrink-to-fit 宽度的影响。可以为容器明确的设定一个宽度。

> - 6、在 IE6 IE7 IE8(Q) 中，一个右浮动元素将尽可能的向右布局，并撑大其所有宽度为 'auto' 的祖先级元素的宽度，直到遇到一个明确设定了宽度的祖先级元素为止。
注：这种现象仅在该元素有宽度为 shrink-to-fit 的的祖先级元素时才可以看到。
>> 解决办法：如果有一个右浮动元素，应注意避免其祖先级元素的宽度为 shrink-to-fit，即给它们设定一个明确的宽度。以使页面布局在各浏览器中的表现一致。

> - 7、IE6 IE7 IE8 Opera 中对 shrink-to-fit 计算时会考虑浮动元素的宽度，这其中包含非替换浮动元素、非替换绝对定位元素、为替换行内块元素。
>> 解决办法：尽量为非替换浮动元素、非替换绝对定位元素、非替换行内块元素显式地设置一个宽度，防止浏览器在 'width:auto' 时对于 shrink-to-fit 的宽度计算方式不同造成布局上的差异。

> - 8、IE6 及 IE7/8 的混杂模式下，非替换绝度定位元素当指定了 'left' 及 'right'，而 'width' 为默认值 "auto" 。此时浏览器无法正确地计算出 'width' 的值，对于高度的计算也是如此。
>> 解决办法：若能为非替换绝对定位元素设定固定的宽度及高度，则尽量不使用此方式自动计算绝对定位元素的 'width' 及 'height'；若无法避免使用此方式，则可以通过判断浏览器，仅在 IE6 中使用 CSS Expression 控制绝对定位元素的宽度及高度。

> - 9、IE6 IE7 IE8(Q) 在超过一个行内元素排列生成行框时，识别行框的顶边和底边位置时会参照文本实际高度的顶边和底边尺寸，而不是行框内最高行内框的顶边和最底行内框的底边位置。
>> 解决办法：为了取得正常布局，建议 'line-height' 计算值设置永远大于 'font-size' 计算值设置。

> - 10、IE6 IE7(Q) IE8(Q)不支持 'min-width' 和 'max-width' 特性。
>> 解决办法：使用 Javascript 实现 'min-width' 和 'max-width' 特性功能。

> - 11、IE6 IE7 IE8(Q) 中行内非替换元素中的非文本文字可能会撑高其高度。
>> 解决办法：针对不同的需求，可以采取不同的解决方案，例如，将外层的行内元素改为一个块级元素、给外层行内元素设置 'display:inline-block'、给外层行内元素设置合适的 'font-size' 值等。

> - 12、不同浏览器内 'line-height' 样式设置会影响 INPUT BUTTON 元素的显示高度。
>> 解决办法：尽量避免使用 'line-height' 为 INPUT[type=text]、INPUT[type=password]、INPUT[type=button]、INPUT[type=file]、input[type=submit] 和 BUTTON 标记设置 ‘line-height’，而应改用规范内说明的 'height' 属性。

> - 13、IE6 IE7 IE8(Q) 中触发 hasLayout 的空块级非替换元素的高度不为 0。
>> 解决办法：如果想让一个触发了 hasLayout 的块级非替换元素的高度为 0，可以给这个空的块级非替换元素增加一个空的注释块：

	<div style="zoom:1"><!-- --></div>
另外，不让元素在 IE 中触发 hasLayout 也可以避免此 BUG 。

> - 14、IE 的混杂模式中行内非替换元素的宽高可设置。
>> 解决办法：在页面上添加<!DOCTYPE HTML>，使页面工作在标准模式下。

> - 15、IE6 IE7(Q) IE8(Q) 不支持 'min-height' 和 'max-height' 特性。
>> 解决办法：使用 Javascript 实现 'min-height' 和 'max-height' 特性功能。

> - 16、不同浏览器对单行文本输入框和显示为按钮的控件基线位置理解不同。
>> 解决办法：避免使用 'baseline' 对齐方式，为元素指定 'vertical-align' 值非 'baseline'，推荐使用 'vertical-align:bottom' 或 'vertical-align:top'。

> - 17、Webkit 浏览器下行框高度计算还依赖于 'font-size' 属性值，在 'line-height' 属性值明显小于 'font-size' 属性值设置时，将导致实际计算出的行框高度大于其他浏览器。
>> 解决办法：为了取得正常布局，建议 'line-height' 计算值永远大于 'font-size' 计算值设置。

> - 18、容器高度被明确设定，容器内容高度仅由行高累加决定的情况下，Safari Chrome 中容器元素的 'overflow' 值为非默认值时，其最后一个内联子元素的半差异高度可能会被忽略。
>> 解决办法：为了准确得到容器高度，建议避免使用行高为行内元素指定高度，而应改用块标记，并且明确的指定其 'height' 值。

> - 19、对于行内元素绝对定位后静态位置中的 'top' 特性的计算值，IE6 IE7 IE8(Q) 会将其计算为静态位置下 content area 距包含块顶边的距离（即半差异的高度），其他浏览器则计算为 0。
>> 解决办法：在使行内元素绝对定位的时候，要注意其行高对静态位置带来的影响，明确设置定位的元素偏移位置。

> - 20、在非标准文档模式中（包括混杂模式和近乎标准模式），当唯一的非表单控件类行内替换元素存在于其包容块中时，其父框的行高并不一定会计算文本基线高度。
>> 解决办法：如果在非标准模式中，需要父容器在仅有行内替换元素的情况下计算出包含文本基线高度的行高值，则必须加入其他行内文本元素。相反的，如果在标准模式中，需要行内替换元素与其父容器底部无间隙，请修改 'vertical-align' 值为非 'baseline' 。

> - 21、若容器中包含 MARQUEE 元素，且容器遵循 shrink-to-fit 宽度算法，则容器及 MARQUEE 元素的宽度在不同浏览器中存在差异。
>> 解决办法：给 MARQUEE 元素及替换元素定义具体的宽度，保证各浏览器兼容。

> - 22、对于宽度为 0% 的 IMG 元素的包含块的 shrink-to-fit 算法，Firefox Chrome Safari 与 IE6 IE7 IE8 Opera 存在差异。
>> 解决办法：尽量避免设置 IMG 元素的宽度为 0%，可以用 0px 替代。

> - 23、IE6 IE7(Q) IE8(Q) 中，如果父需要使用 shrink-to-fit 算法，并且其子元素触发了 hasLayout 特性以及 'width' 特性值为默认的 'auto'，那么会导致父元素 shrink-to-fit 计算值有误。
>> 解决办法：由于在 IE 浏览器中很难避免不触发 hasLayout 特性，因此建议在使用 ‘float’ ‘position:absolute' 这两个样式时，为 'width' 特性设置具体值。这样可以从根源上避免触发 shrink-to-fit 计算规则，由此来规避 IE6 IE7(Q) IE8(Q) 中由于 hasLayout 特性带来的渲染问题。

> - 24、在 IE7(S) Firefox 中，若元素的高度出于某种原因使用了其 'min-height' 或 'max-height' 设定的值，则其生成的包含块的高度为元素的实际高度；而在 IE8(S) Chrome Safari Opera 中，生成的包含块的高度仍然为元素原始的高度。
>> 解决办法：在子孙元素参照设定并在计算值上应用了 'min-height'、'max-height' 特性的元素生成的包含块的高度时需格外注意，此时尽量避免使用百分比等需要参照包含块计算的单位。

> - 25、当采用如下布局方法时，各浏览器可能会造成 shrink-to-fit 计算规则处理差异：
1.父元素采用浮动或绝对定位样式，宽度值为 'auto'；
2.子元素存在两个以上连续的行内元素；
3.两个行内元素之间存在空文本节点而非标记首尾紧密相连；
4.第二个行内元素采用绝对定位样式，且 'top' 'left' 'bottom' 'right' 都为 'auto' 。
此时，Safari 和 Chrome 中的父元素采用 shrink-to-fit 计算规则时，可能使用了 preferred minimum width 来作为 preferred width ，导致在空文本节点处产生换行，使依赖元素普通流位置的绝对定位元素显示位置产生差异。
>> 解决办法：建议在使用 ‘float’ ‘position:absolute' 这两个样式时，为 'width' 特性设置具体值。这样可以从根源上避免触发 shrink-to-fit 计算规则带来的差异。

> - 26、各浏览器对于未明确设定高度的包含块内包含百分比单位高度的块级元素的高度计算存在差异。
>> 解决办法：要对设置有百分比高度的块级元素的包含块设置明确的 'height' 属性值。

> - 27、当 IMG 元素没有设置 'width' 特性且设置了值单位为百分比的 'min-width' 或 'max-width' 特性， 则在各浏览器中该 IMG 元素的包含块的 'shrink-to-fit' 算法存在差异。
>> 解决办法：在包含块的宽度计算需要依赖其内 IMG 元素时，尽量避免给 IMG 元素的 'min-width' 和 'max-width' 特性设置百分比单位的值。

> - 28、在正常文档流中，当包含块宽度为 0，其内未设定明确宽度的块级元素由于设定了 'margin' 溢出包含块时，则该块级元素的宽度计算在 Chrome Safari 中会计算为 0。
>> 解决办法：尽量避免出现未明确设定宽度 (值为 'auto') 的块级元素由于设定了 'margin' 导致其溢出其宽度为 0 的包含块，应为其设定一个明确的宽度。

> - 29、当页面中存在一个空的非替换行内元素时，如果给这个元素设置了边框或者背景样式，那么在 IE6 IE7 IE8(Q) 中这些样式将无法显示出来。
>> 解决办法：应尽量避免使用的空的非替换行内元素，以及避免为空元素添加显示用样式。

---
七、可视效果
===

> - 1、当一个元素的 'overflow-x' 或 'overflow-y' 指定值为 'hidden'，另一个特性的指定值为 'visible' 时， 该元素最终渲染使用的 'overflow-y' 或 'overflow-x' 值不同。IE6 IE7 IE8 使用 'hidden'，其它浏览器使用 'auto'。
>> 解决办法：
- 同时设置 'overflow-x' 和 'overflow-y' 的值，不要出现其中之一为 'hidden' 时，而另一个是 'visible' 的情况；
- 避免编写依赖指定值为 'visible' 的 'overflow-x' 和 'overflow-y' 特性的计算值的代码。

> - 2、在 IE6(S) IE7(S) 中，若一个 'overflow' 特性不为 'visible' 的非定位元素内包含了可能溢出其的相对定位元素，则溢出部分不会被剪裁。
在 IE6(Q) IE7(Q) IE8(Q) 中，若一个 'overflow' 特性不为 'visible' 的非定位元素内包含可能其溢出的绝对定位元素，则仍然会剪裁溢出的绝对定位元素。
>> 解决办法：根据实际需求可以去掉包含块的 'overflow:hidden' 或采用其他定位方案，避免在 IE 中触发此问题，实现在各浏览器表现一致。

> - 3、在 IE6 IE7 IE8 中，若在同一条规则中同时首先定义了 'overflow-x' 或 'overflow-y' 特性，然后又定义了 'overflow' 特性，则作为简写的 'overflow' 特性的值不会覆盖之前的 'overflow-x' 或 'overflow-y' 特性的值。
>> 解决办法：根据实际需求尽可能同时设定明确的 'overflow-x' 以及 'overflow-y' 特性，或者直接使用简写的 'overflow'，避免在同一条 CSS 规则内在 'overflow-x' 或 'overflow-y' 特性之后再定义 'overflow' 特性。

---
 - 未完待续
===
