## vue-cli3项目搭建配置以及性能优化

在之前的开发中主要用的是vue-cli2，最近空闲时间比较多，接下来有新项目，本着偷懒的本能，自己打算搭建一个基础包以备后期开发应用，并对其进行性能优化和配置。

该项目的GitHub：https://github.com/bayi-lzp/vue-cli3-init  

master分支为基础包，vi_mint_ui分支为优化后项目，可根据自己需要进行切换。

搭建整个过程如下：
    
* 初始化项目
* 修改目录结构
* 多环境运行
* axios封装
* 模块化vuex
* 全局引用样式
* 移动端适配配置
* 常用util
* 引入第三方UI框架
* 配置vue.config.js文件
* vue项目框架性能优化（重点） (v1_mint_ui分支)

### 1.项目初始化

* 创建项目

可用命令行或者ui面板进行创建，具体的创建方式及详细说明，可以参考我的另一篇文章 [vue-cli3初始化项目搭建](https://juejin.im/post/5c9742ab6fb9a070c6188ee5)

* 运行项目
``` 
npm run serve
```

![](https://user-gold-cdn.xitu.io/2019/3/24/169aee77eb748a7c?w=798&h=630&f=png&s=139055)

### 2.修改目录结构

用编辑器打开后可以看到目录结构。相对于vue-cli2精简了很多，减少了对webpack的配置。

![](https://user-gold-cdn.xitu.io/2019/3/24/169aeebc8ad4e659?w=336&h=367&f=png&s=17683)
* node_modules  文件夹  项目依赖(对webpack进行了封装)
* public 文件夹

    1.favicon.ico  是 网站图标
    
    2.index.html  页面入口文件
* src 文件夹

    main.js  入口js
    
    assets  存放静态文件
    
   components 存放公用组件
    
    App.vue 入口vue文件

* .eslintrc.js 配置

* .gitignore 指定文件无需提交到git上

*  balel.config.js 使用一些预设

* package.json 项目描述及依赖

* package-lock.json 版本管理使用的文件

由于现在的目录结构不利于后期的开发，现在我们增加部分文件，待后续可以进行功能扩展。在src文件下：新建api文件夹，config文件夹,router文件夹，utils文件夹，views文件夹，store文件夹。并在其文件下建子目录，详细请参考目录截图：


![](https://user-gold-cdn.xitu.io/2019/3/24/169aefaaa2f4470c?w=299&h=576&f=png&s=19311)

### 2.多环境运行

由于我们的项目需要在不同环境下进行运行(开发，生产，测试等)，这避免我们需要多次的去切换请求的地址以及相关的配置，vue-cli2是可以直接在config文件中进行配置的，但是vue-cli3已经简化了，官方文档也有进行配置的说明，实现具体有以下2种方法，我比较偏向第二种。

* 第一种实现方法

1.在根目录新建2个文件，分别为```.env.development```，```.env.production```，``` .env.test```。注意文件是只有后缀的。

```.env.development``` 模式用于serve，开发环境，就是开始环境的时候会引用这个文件里面的配置

```.env.production ```模式用于build，线上环境。

```.env.test ``` 测试环境

2.分别在文件内写上：

开发环境：
```
//.env.development 
VUE_APP_BASE_API = '需要请求API'
```
线上环境：
```
//.env.production
VUE_APP_BASE_API = '需要请求API'
```
测试环境：

```
//.env.test
VUE_APP_BASE_API = '需要请求API'
```

当需要用到该变量是可以用```process.env.VUE_APP_BASE_API```进行取值。

3.更改package.json文件
```
 "scripts": {
    "dev": "vue-cli-service serve",
    "test": "vue-cli-service serve --mode test",
    "build": "vue-cli-service build",
    "build:test": "vue-cli-service build --mode test",
    "lint": "vue-cli-service lint"
  },
```
* 第二种实现方式

1.在config文件新建index.js文件，根据全局的环境变量来进行判断，并进行输出。代码如下：

```
// 一些全局的config配置
const modeUrlObj = {
  // 生产环境
  'production': {
    baseURL: 'http://172.17.71.40:9091/pro/',
    authBaseURL: ''
  },
  // 开发环境
  'development': {
    baseURL: 'http://172.17.71.40:9091/dev/',
    authBaseURL: ''
  },
  // 测试环境
  'test': {
    baseURL: 'http://172.17.71.40:9091/test/',
    authBaseURL: ''
  }
}
export default modeUrlObj[process.env.NODE_ENV]

```
2. 更改package.json文件
```
 "scripts": {
    "dev": "vue-cli-service serve",
    "test": "vue-cli-service serve --mode test",
    "build": "vue-cli-service build",
    "build:test": "vue-cli-service build --mode test",
    "lint": "vue-cli-service lint"
  },
```
3. 引用的方法可以参照如下：

```
import config from '../config/index' // 路径配置

config.baseURL  // 对应环境api

```
4.运行命令行

```npm run dev``` // 开发环境

```npm run test``` // 测试环境

```npm run build``` // 正式环境打包

```npm run build:test```  // 测试环境打包

### 2. axios封装

在vue项目中，和后台交互获取数据这块，我们通常使用的是axios库，它是基于promise的http库，可运行在浏览器端和node.js中。他有很多优秀的特性，例如拦截请求和响应、取消请求、转换json、客户端防御XSRF等。所以我们的尤大大也是果断放弃了对其官方库vue-resource的维护，直接推荐我们使用axios库。如果还对axios不了解的，可以移步[axios文档](https://www.kancloud.cn/yunye/axios/234845)。
 * 安装依赖

 ``` 
 npm install axios --save; // 安装axios
 ```
* 配置axios

在uitls文件下新增request.js文件，在这里我们对axios进行初始化后，暴露给需要引用的文件，方便开发。
```
import axios from 'axios'
import config from '../config/index' // 路径配置
```
创建axios实例，并进行配置
```
// 创建axios 实例
const service = axios.create({
    baseURL: config.baseURL, // api的base_url
    timeout: 10000 // 请求超时时间
})

```
利用axios的请求拦截和响应拦截可以对登录和权限方面进行控制，具体需求可以自己进行配置。完整代码如下：

```
import axios from 'axios'
import config from '../config/index' // 路径配置

// 创建axios 实例
const service = axios.create({
    baseURL: config.baseURL, // api的base_url
    timeout: 10000 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(
    config => {
        // 这里可以自定义一些config 配置

        return config
    },
    error => {
        //  这里处理一些请求出错的情况

        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        // 这里处理一些response 正常放回时的逻辑

        return res
    },
    error => {
        // 这里处理一些response 出错时的逻辑

        return Promise.reject(error)
    }
)

export default service

```
* api请求配置

在api文件下新建分类的api请求文件。根据具体需要分类。主要是方便团队开发，容易归类。可以参考下面配置。

```
import request from '@/utils/request'

export default {
  // 登录
  login (data) {
    return request({
      url: '/login',
      method: 'post',
      data
    })
  },
  // 获取用户信息
  getUserInfo () {
    return request({
      url: '/userinfo',
      method: 'get'
    })
  }
}
```
业务中需要进行请求可以用import后，进行传参即可。

### 4.模块化vuex

> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

如果对vuex还不大了解的可以自行[阅读vuex官方文档](https://vuex.vuejs.org/zh/guide/)。

* 安装vuex

``` 
npm install vuex -S
```
* 新建目录

modules文件主要用法存放分类的文件，可以进行区分，getters文件是对state进行处理，index.js主要进行一些引入，初始化操作。

![](https://user-gold-cdn.xitu.io/2019/3/24/169af256092eb744?w=173&h=116&f=png&s=3841)

* 书写vuex配置

 index.js文件
```
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user' // 引入各个模块的代码
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user
    },
    getters
})

export default store
```
getter.js文件

getter中的配置可根据需求进行增加或者删除，下面是示例。

```
const getters = {
  requestLoading: state => state.app.requestLoading,
  size: state => state.app.size,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles
}
export default getters
```

moduels/user.js文件

该文件为与业务相关，可以跟据具体参见进行增加和删除命名。每个文件的基本配置和用法如下：
```
import { getToken, setToken } from '@/utils/auth'
import api from '@/api/user'

const user = {
  state: {
    token: getToken(),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        api.login(userInfo).then(res => {
          if (res.code === 200) {
            setToken(res.data)
            commit('SET_TOKEN', res.data)
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
```
### 5.全局样式引用

在项目开发过程中，我们经常需要全局样式引用，例如主题色等，如果每次去写的化会变得很麻烦。因为我们应该了sass预语言编译，所以可以大胆的应用其特性。例如变量，函数，混入等。但是我们需要在项目中进行全局的配置才能有效果。不用在每一个页面都进行引入样式，就能直接引用。

* 新建目录

在assets下新建如下文件，具体的代码自行进行配置

    * common.scss 主要存放公共的样式

    * mixin.scss 存放混入样式

    * reset.scss 存放重置样式。

    * variable.scss 存放变量

![](https://user-gold-cdn.xitu.io/2019/3/24/169af317a3885504?w=210&h=209&f=png&s=6292)


* 全局引入

新建vue.config.js文件，并写上以下代码
```
module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `
               @import "@/assets/css/variable.scss"; 
               @import "@/assets/css/common.scss";
               @import "@/assets/css/mixin.scss";
              `
      }
    }
  },
}
```
在app.vue中引入reset.scss文件，完成后，样式即可进行全局调用了。
```
<style lang="scss">
  @import "assets/css/reset";
</style>
```
### 6.移动端适配配置

在本项目中主要用rem来进行页面的适配操作的，因为rem就可以随根字体大小改变而改变，从而实现了自适应的功能。但是html的字体是固定的，所以需要监听页面大小的变化，我主要用了淘宝的```amfe-flexible```来进行监听改变的。将项目中css的px转成rem单位，免去计算烦恼,我们可以用scss来进行计算或者利用```px2rem```插件来进行自动转化。因为是开发移动端，需把mate换为
```<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale= 1.0, minimum-scale=1.0">```
实现方法如下：

* 安装amfe-flexible

``` npm i amfe-flexible --save ```

* px转rem

方法一：

在common.scss文件中，全局引入scss函数：
```
/**
  转化px为rem。$base-font-size = 设计稿尺寸/10
*/
@function px2rem($px, $base-font-size: 37.5) {
  @return ($px/$base-font-size)*1rem
}
```
调用方式直接： ```  width: px2rem(175);```

方法二：

 安装依赖
 ```
 npm i px2rem --save-dev
 ``` 
 package.json内，在postcss内添加：
 ```
 "postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-pxtorem": {
        "rootValue": 75, // 设计稿宽度的1/10,（JSON文件中不加注释，此行注释及下行注释均删除）
        "propList":["*"] // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
     }
    }
  },
  ```
### 7.常用util

该文件主要是对一些常用的js进行封装，例如时间格式化，LocalStorage操作等，相对比较常用的方法，这个文件可以进行保存，要用到时直接复制过来用即可。下面是我封装LocalStorage的文件，可参考以下，其他自行设置
```
import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
/*
* 设置setLocalStorage
* */
export function setLocalStorage (key, value) {
    window.localStorage.setItem(key, window.JSON.stringify(value))
}
/*
* 获取getLocalStorage
* */
export function getLocalStorage (key) {
    return window.JSON.parse(window.localStorage.getItem(key) || '[]')
}
/*
* 设置setSessionStorage
* */
export function setSessionStorage (key, value) {
    window.sessionStorage.setItem(key, window.JSON.stringify(value))
}
/*
* 获取getSessionStorage
* */
export function getSessionStorage (key) {
    return window.JSON.parse(window.sessionStorage.getItem(key) || '[]')
}
/*
* 获取getToken
* */
export function getToken () {
    return Cookies.get(TokenKey)
}
/*
* 设置setToken
* */
export function setToken (token) {
    return Cookies.set(TokenKey, token)
}
/*
* 移除removeToken
* */
export function removeToken () {
    return Cookies.remove(TokenKey)
}

```
### 8.引入第三方UI框架

在前端开发过程中，避免一些造轮子情况出现，经常需要一些ui框架，可以根据自己需要引入第三方UI框架，自己进行配置，我选择了mintui来进行引入。采用了按需引入的方式。

* 安装依赖

``` npm i mint-ui -S```

* 配置按需引入

借助 babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的。如果全部引入，文件太大了。

首先，安装 ```babel-plugin-component ```：

 ``` npm install babel-plugin-component -D``` 
然后，将 .babel.config.js 修改为：

```
module.exports = {
  presets: [
    '@vue/app'
  ],
   plugins: [
        [
            "component",
            {
                "libraryName": "mint-ui",
                "style": true
            }
        ]
    ]
}
}
```
如果你只希望引入部分组件，比如 Button 和 Cell，那么需要在 main.js 中写入以下内容：
```
import Vue from 'vue'
import { Button, Cell } from 'mint-ui'
import App from './App.vue'

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
/* 或写为
 * Vue.use(Button)
 * Vue.use(Cell)
 */
```
### 9.配置vue.config.js文件

* 基本配置

    1.文件目录配置别名
    我们可以把src配置为@，如果需要就不用到根目录开始写了，直接用@/xxx/进行引用。根据自己需要进行配置，在vue.config.js文件中加入代码
    ```
     // 配置
  chainWebpack: (config)=>{
    // 配置别名
    config.resolve.alias
        .set('@', resolve('src'))
        .set('assets',resolve('src/assets'))
        .set('components',resolve('src/components'))
        .set('router',resolve('src/router'))
        .set('utils',resolve('src/utils'))
        .set('static',resolve('src/static'))
        .set('store',resolve('src/store'))
        .set('views',resolve('src/views'))
        }
    ```
    2.跨域配置
    在前端请求过程中，如果后台没有设置跨域请求的，可以在webpack进行配置。
    ```
    devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
     }
    }
    ```
    3.其他配置
    具体可以参照官网的配置说明，在项目中我用到了
    ```
    assetsDir: 'assets',   // 静态文件目录
    publicPath: './',    // 编译后的地址，可以根据环境进行设置
    lintOnSave: true, // 是否开启编译时是否不符合eslint提示
    ```
    以上的所有代码必须写在```module.exports```输出才能生效.
    
### 10.项目框架性能优化 (v1_mint_ui分支)
    
通过以上的基本配置，项目已经符合我们工作需要了，但是在工作过程中会发现随着项目的集成度越来越高，业务越来越多。出现了加载慢和打包文件过大的问题。导致我们页面白屏时间过长，用户体验不友好。那么如果你感兴趣的话，可以进行以下的配置，可以大大大大大的减小体积和加载速度。在master分支是没有进行优化的，如果需要看优化代码可以到另外一个分支。所以在页面引入的代码都是当前页面需要的执行代码，可以往下面几个方法进行处理。

* js,css代码的最小化压缩和分割

* js,css代码公用代码提取, 按需引入(cdn加载)

* 图片文件的压缩

* gzip的压缩

* 去除console.log

**1.js,css代码的最小化压缩和分割**

首先，我们先对js文件进行配置以达到压缩效果，先看一下没有配置代码情况，整个app.js 的文件是2.8M（因为是初始项目），但是如果页面一多，就不只这个数了。



![](https://user-gold-cdn.xitu.io/2019/3/24/169afa2b0beb28e3?w=980&h=264&f=png&s=28913)

我们会通过chainWebpak来处理. 在优化前, 看下相关文件的响应代码: 看下app.js文件的返回代码:代码如下：


![](https://user-gold-cdn.xitu.io/2019/3/24/169af76c214a51c0?w=849&h=462&f=png&s=74368)

在vue.config.js文件中加入,run以下后查看app.js情况，文件会变小（由于初始项目体积小，看不出多大区别）。
```
module.exports = {
  chainWebpack: config => {
    config.optimization.minimize(true);
  }
}
```

![](https://user-gold-cdn.xitu.io/2019/3/24/169af760be879dae?w=997&h=475&f=png&s=103800)

分割代码,相应的文件中存入分割后的代码。

```
module.exports = {
    
    chainWebpack: config => {
        config.optimization.minimize(true);
        config.optimization.splitChunks({
          chunks: 'all'
        })
    }
}


```


![](https://user-gold-cdn.xitu.io/2019/3/24/169afa43789359fb?w=869&h=285&f=png&s=30113)

加入以上代码后，分成了2个文件，最大的只有2.7M了，这样可以分成多个进行加载，可以达到最快化，但是一定要平衡文件大小的和分割出来的文件数量的平衡, 数量多了, 请求也会变慢的, 影响性能.可以根据项目的进行设置，具体可参考官方文档的详细说明。

**2.js,css代码公用代码提取, 按需引入(```CDN加载```)**

把公用代码提取出来,然后采用使用免费的cdn资源进行加载。在项目中我们主要是引入引入不同的模块库才会导致文件较大，那么是否可以把这些文件进一步处理，答案是可以的，比如vue, vuex, vue-router, element-ui等公共资源库。利用webpack我们可以使用externals参数来配置:

在vue.config.js文件:
```
module.exports = {
    chainWebpack: config => {
          // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    })
    // 用cdn方式引入
    config.externals({
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'mint-ui': 'MINT',  // 需用MINT
      'axios': 'axios'
    })
    }
}
````
index.html加入CDN地址,注意引入的时候要写在body里面，否则会报错。

```
    <script src="https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
    <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.bootcss.com/mint-ui/2.2.13/index.js"></script>

```
mint-ui样式通过CDN引入。然后商储mian.js文件的 import 'mint-ui/lib/style.css' （全局引入模式才有）

```
<link href="https://cdn.bootcss.com/mint-ui/2.2.13/style.min.css" rel="stylesheet">
```

如果需要引入其他依赖的CDN可以通过[BootCDN查找](https://www.bootcdn.cn/)进行引入。

重新运行项目, 看看效果，已经大大的减小了很多，到了k级别了：


![](https://user-gold-cdn.xitu.io/2019/3/24/169afb1c03c2d38c?w=910&h=346&f=png&s=44554)

提取css代码：

因为js会动态的加载出css，所以js文件包会比较大，那么需要提取css代码到文件. 这里我们只需要将css配置一下:

```

module.exports = {
  css: {
      extract: true
  }
}
```

![](https://user-gold-cdn.xitu.io/2019/3/24/169afc5c285b811d?w=888&h=363&f=png&s=45607)

**3.图片文件的压缩**

图片文件大于在webpack设定的值时，我们可以对其进行压缩在进行引入，安利给大家一个压缩图片的网站[https://tinypng.com/](https://tinypng.com/)，它可以批量的压缩图片又不会失真，压缩比相对较大。可以对图片进行有效压缩。


**4.gzip的压缩**

 如果后台有对前端的代码进行gzip压缩的话，那么就不需要进行压缩了，后台自己配置就可以。如果后台不具备这种情况那么我们可以利用compression-webpack-plugin插件可以帮助我们进行gzip压缩：
 
 安装依赖：
 
 ```
 npm install --save-dev compression-webpack-plugin
 ```
 然后引入相关代码:
 ```
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const compress = new CompressionWebpackPlugin(
  {
    filename: info => {
      return `${info.path}.gz${info.query}`
    },
    algorithm: 'gzip', 
    threshold: 10240,
    test: new RegExp(
      '\\.(' +
      ['js'].join('|') +
      ')$'
    ),
    minRatio: 0.8,
    deleteOriginalAssets: false
  }
)
module.exports = {
 devServer: {

    before(app, server) { 
      app.get(/.*.(js)$/, (req, res, next) => { 
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        next();
      })
    }
  }
  configureWebpack: {
      plugins: [compress]
  }
```
重新run一遍，出现了意向不到的结果了。又原来的2.8M转化为250+kb了，缩小了11倍以上。重大突破

![](https://user-gold-cdn.xitu.io/2019/3/24/169afc7507369012?w=956&h=365&f=png&s=44410)

**6.去除console.log**

正常情况下我们会在开发环境进行console调试，但是如果不删除，过多会出现内存泄漏的情况，那么我们可以在正式环境的时候就把它给干掉，实现方法如下：

方法一：
```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    configureWebpack: config => {
        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
            config.plugins = [
                ...config.plugins,
                ...plugins
            ];
        }
    }
}
````
方法二：使用```babel-plugin-transform-remove-console```插件
```npm i --save-dev babel-plugin-transform-remove-console```
在babel.config.js中配置
```
const plugins = [];
if(['production', 'prod'].includes(process.env.NODE_ENV)) {  
  plugins.push("transform-remove-console")
}

module.exports = {
  presets: [["@vue/app",{"useBuiltIns": "entry"}]],
  plugins: plugins
};
```

经过以上的所有骚操作，整个项目已经差不多完成了，接下来就靠兄弟们去开发业务和优化了。由于本人技术有限，有错误地方还望指出来，如果觉得对你有帮助麻烦点一下赞，或者个星，这是对我最大的帮助。后续打算再写一个项目的开发过程，自己成长也希望大家希望。有什么问题可以留言帮忙解决。

最后附上该项目的GitHub：https://github.com/bayi-lzp/vue-cli3-init  

master分支为基础包，vi_mint_ui分支为优化后项目，可根据自己需要进行切换。

注：转载请带上文章出处，避免带来不必要麻烦。

