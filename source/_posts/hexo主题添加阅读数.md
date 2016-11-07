---
title: 为hexo-theme-smackdown主题添加阅读数
date: 2016-10-31 14:23:47
tags: hexo
categories: hexo
keywords: hexo,theme,smackdown,hexo主题,统计,阅读数
---
为你的hexo博客每篇文章添加阅读数。
<!--more-->

<div align="center">
  ![阅读数展示图](http://7xkj1z.com1.z0.glb.clouddn.com/%E9%98%85%E8%AF%BB%E6%95%B0%E5%B1%95%E7%A4%BA%E5%9B%BE.jpeg)
</div>

---
**如果你使用的是[hexo-theme-smackdown](https://github.com/winnerweb/hexo-theme-smackdown)主题，那你继续往下看本文章。
如果你使用的是其它主题并想为你自己的主题添加文章阅读数，请参考[这篇文章](http://www.aluenkinglee.com/2016/06/30/hexo-add-post-hits/)。**


hexo是一个静态的博客，所以想要添加评论或者统计，就需要依赖像多说这样的第三方服务。或者你自己有能力的话，可以自己搭一个服务器自己写。文章阅读数统计，也同样是需要第三方服务。有几个比较常见的第三方服务提供商：
- leancloud
- firebase
- busuanzi

参考了几篇文章之后，决定还是使用[leancloud](https://leancloud.cn)，免费账号提供的资源足够我们做计数用了。而且它的cdn在国内，对于国内用户方位速度较快。

1. 首先注册一个[leancloud](https://leancloud.cn)账户，然后选择新建应用。
<div align="center">
  ![leancloud](http://7xkj1z.com1.z0.glb.clouddn.com/hexo%E9%98%85%E8%AF%BB%E6%95%B0-2.jpeg)
</div>

2. 选择储存，点击设置新建class
<div align="center">
  ![leancloud](http://7xkj1z.com1.z0.glb.clouddn.com/hexo%E9%98%85%E8%AF%BB%E6%95%B0-3.jpeg)
</div>

3. 权限无限制，名称叫做Counter
<div align="center">
  ![leancloud](http://7xkj1z.com1.z0.glb.clouddn.com/hexo%E9%98%85%E8%AF%BB%E6%95%B0-4.jpeg)
</div>

4. 打开设置，选择应用key，复制下AppID和AppKey
<div align="center">
  ![leancloud](http://7xkj1z.com1.z0.glb.clouddn.com/hexo%E9%98%85%E8%AF%BB%E6%95%B0-5.jpeg)
</div>

5. 在hexo-theme-smackdown主题的_config.yml文件中找到如下代码
![leancloud](http://7xkj1z.com1.z0.glb.clouddn.com/hexo%E9%98%85%E8%AF%BB%E6%95%B0-7.jpeg)

6. 将enable设置成true,将刚才复制的app_id和app_key分别粘贴到相应位置。
  ```md
  #是否开启文章阅读量
  leancloud_visitors:
    enable: true
    app_id: eB0QOCzcXCP5aEk50wa5UDqz-gzGzofdsfs
    app_key: Nx5RVdg3LvNyJtISPzdeWfjdklj
  ```

7. 大功告成。
