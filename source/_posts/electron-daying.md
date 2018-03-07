---
title: 使用 Electron 快速开发桌面应用(附实例，源码)。
date: 2017-03-08 15:46:22
tags: Electron
categories: Electron
keywords: Electron, react, boilerplate, 前端, 桌面应用, Mac, Windows
---

此项目是一个信息聚合类的桌面应用, mac windows linux多平台兼容, 演示效果如下。
![](http://7xkj1z.com1.z0.glb.clouddn.com/daying_display1.gif)

<!--more-->

# Electron DaYing (大鹰)

> 此项目是一个信息聚合类的桌面应用, mac windows linux多平台兼容。

> 主要基于 [electron](https://github.com/electron/electron)、[dva-boilerplate-electron](https://github.com/sorrycc/dva-boilerplate-electron)、react 等技术开发。

> 安装包下载地址 [mac](https://github.com/emododododo/daying/releases/download/0.0.1/daying-mac.zip) [windows](https://github.com/emododododo/daying/releases/download/0.0.1/daying-windows.zip)

> Github 地址 [Daying](https://github.com/emododododo/daying)


# 声明

> 此应用开发源码及数据仅供学习，所有数据并未获得官方授权。内容涉及掘金、知乎等。虽然最终都会跳转到原文地址，但获取与共享的行为或有侵犯知识权益的嫌疑。若被告知停止使用与共享，本人将及时删除相关内容。所有 API 以及源码 **仅供学习交流使用，请勿用作商业用途**。请您知悉相关情况，遵守相关协议。

# 演示

> 应用界面以及操作大概如下图。

> [主界面.gif](http://7xkj1z.com1.z0.glb.clouddn.com/daying_display1.gif)

> 在设置里可以添加更改订阅源。

>[配置界面.gif](http://7xkj1z.com1.z0.glb.clouddn.com/daying_config.gif)

---

关于 Electron 这里就不详细介绍了，随便 Google、百度 一下都有很多教程文章，官方文档也有多国语言。

简单的说，Electron 就是利用前端技术开发桌面应用（包括 Mac、 Windows、Linux 等）；

## 关于初衷

这个项目的初衷是为了自己更方便的看自己喜欢的文章，我喜欢看腾讯的NBA新闻，偶尔也爱看看知乎的大误、瞎扯专栏, 还经常去什么值得买剁剁手。。所以就想着自己做一个信息聚合的应用。

## 关于脚手架

说做就做，刚好这个时候看到[云谦](https://github.com/sorrycc)大神写了一个 Electron 的脚手架 [dva-boilerplate-electron](https://github.com/sorrycc/dva-boilerplate-electron)。

说到这这里，简单的说一说 dva。目前支付宝前端应用的架构就是 dva。react、redux、saga 这一套开发是目前比较常见的，但是开发流程过于繁琐。dva 主要是将 react、redux、saga 等封装了起来。详细内容看[官方文档](https://github.com/dvajs/dva)吧，介绍的很详细，使用也很简单。

其实关于 dva-boilerplate-electron 云谦大神介绍的也很详细了，每个人对于知识的理解程度都不一样，所以我就不说我自己的理解了。。直接放原文地址 https://github.com/sorrycc/blog/issues/13

## Electron Daying(大鹰)

### 大体功能与设计
设计就比较简单了，整体分为两大块，左边栏是文章标题列表和标签选择。右边就是跳转到原文地址展示文章内容，同时添加了手机二维码分享以及浏览器打开。大体功能就这些，简单明了。

![](http://7xkj1z.com1.z0.glb.clouddn.com/daying_home.jpeg)

配置页面可以更改订阅源，选择你喜欢的订阅源进行订阅。右下角的更新订阅源是当后台添加新的订阅源后，这里可以直接获取到相应的更新。

![](http://7xkj1z.com1.z0.glb.clouddn.com/daying_config.jpeg)

### 目录结构

建议先将 [dva-boilerplate-electron](https://github.com/sorrycc/dva-boilerplate-electron) 的文档内容看完，否则你并不知道为什么要这样架构整个目录结构。

![](http://7xkj1z.com1.z0.glb.clouddn.com/daying_catalog.jpeg)

### 路由

路由比较简单，因为就只有两个页面，一个主页面，一个配置页面


```javascript
  // src/renderer/router.js
  import React from 'react';
  import { Router, Route } from 'dva/router';
  import ListPage from './routes/itemList';
  import EditPage from './routes/EditPage';
  import './utils/reset.css';

  function RouterConfig({ history }) {
    return (
      <Router history={history}>
        <Route path="/" component={ListPage} />
        <Route path="/EditPage" component={EditPage} />
      </Router>
    );
  }

  export default RouterConfig;
```


路由所对应的页面都在 ```src/renderer/routes/``` 文件夹下。组成这两个界面的 component 都在 ```src/renderer/components/``` 文件夹中，包括 Loading 组件，主界面右边的 Webview 组件等等。其中会用到一些 Electron的 API，看下文档就知道是干什么的了。这一部分其实没什么好说的，都是 React 的那些东西，直接看源码吧。
### 数据&事件。

dva 这一套架构的核心事件触发以及数据绑定是在 ```src/renderer/models``` 中，经过 dva 的封装之后，reducer，redux，saga清晰明了，其中的 effects 其实就是saga，不了解 redux、saga 的自行去看文档。。。

本项目的 ```src/renderer/models/itemList.js``` 文件，主要是请求获取后台数据进行处理，以及将数据储存在 Storage 中，包括用户定制的订阅源列表，配置页面所有订阅源列表等等。简单说一下 ipcRenderer，因为在配置界面更新订阅源之后，需要刷新主界面，两个窗口之间的数据通信就需要 Electron 的 main 端进行数据通信，就是 ipcMain 和 ipcRenderer。


```javascript
  // src/main/index.js
  ipcMain.on('sync-EditPage', (event) => {
    const result = event;
    mainWin.reload();
    result.returnValue = '配置更新成功';
  });

  // src/renderer/models/itemList.js
  updateNavList(state, action) {
    // 同步刷新主窗口事件。
    setStorage('selectedNavList', action.payload.navList);
    ipcRenderer.sendSync('sync-EditPage');
    return { ...state, ...action.payload };
  },
```

effects 中的内容主要是处理两个请求，其实就是利用saga来处理异步请求。一个是获取资源内容的 query，一个是获取订阅源列表的 updateAllNavList，内容也很简单不多说。

利用 dispatch 触发 reducer 中的事件。比如：


```javascript
  // 正常的 dispatch
  dispatch({
    type: 'query',
    payload: {
      isLoadingList: true,
      queryName: navList[0].id,
      list: [],
    },
  });

  // saga 中的 dispatch
  yield put({
    type: 'querySuccess',
    payload: {
      isLoadingList: false,
      queryName: 'dailyZhihu',
      list,
      url,
    },
  });
```

### 遇到的一些坑

在 Windows 上运行```npm run build```的时候会报NODE_ENV的错，最后用 cross-env 来解决的。

```
  // 坑
  "build": "NODE_ENV=production webpack"
  // 解决  npm install cross-env 然后更改为下面代码所示
  "build": "cross-env NODE_ENV=production webpack"
```


### 总结

其实这一套开发成本真的很小，这个应用前端后台一共加起来也没有用多长时间，只要熟悉 dva 的开发流程，再熟悉Electron的API，很快就可以上手写出一个多平台兼容的桌面应用。
