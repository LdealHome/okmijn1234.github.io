# 社群 [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 目录结构

* shequn
  * dist 项目构建生成的目录（不随git版本控制）
  * docs 项目相关的文档信息
  * public 项目引用的静态资源目录（不受webpack打包处理，只会复制里面的内容到dist目录下）
  * scripts 自定义脚本
  * src 源文件目录
     * assets 静态资源目录
     * common 公用文件目录
     * components 组件目录
     * config 配置信息
     * mixin 混入模块
     * router 路由配置
     * services API配置
     * store 存储配置
     * utils 自定义工具函数
     * views 视图页面
  * ssh 测试服务器连接配置
  * .browserslistrc 编译支持的浏览器版本控制
  * .build.log 线上版本发布日志
  * .editorconfig 编辑器配置信息
  * .env 公用环境变量配置
  * .env.dev 本地开发环境变量配置
  * .env.production 正式环境变量配置
  * .env.qa 在线测试环境变量配置
  * .eslintignore Javascript代码检查忽略文件
  * .eslintrc.js Javascript代码检查配置
  * .gitignore 版本控制忽略文件
  * babel.config.js Javascript编译配置
  * package.json 项目依赖包文件
  * package-lock.json 项目依赖包版本控制
  * postcss.config.js CSS后处理器配置
  * README.md 项目简介
  * stylelint.config.js CSS代码检查配置
  * vue.config.js 项目打包配置文件

### 环境变量说明
  * `NODE_ENV` 打包环境
  * `VUE_APP_BASE_URL` api域名地址
  * `VUE_APP_TIME_OUT` axios请求超时时间（ms）
  * `VUE_APP_PUBLIC_PATH` 项目部署的路径
  * `VUE_APP_ASSETS_DIR` 静态资源部署路径
  * `VUE_APP_INDEX_PATH` 生成的入口文件位置
  * `VUE_APP_OUTPUT_DIR` 打包输出目录
  * `VUE_APP_DEBUGGER` 开启debugger模式(只配置在.env.*.local中)
  * `VUE_APP_MEMBER_TOKEN` 调试模式用户token(只配置在.env.*.local中)
  * `VUE_APP_GET_TOKEN` 获取app token 信息

### 脚本命令
  * `npm run serve` 本地开发环境
  * `npm run dev` 本地开发
  * `npm run build` 打包发布版本
  * `npm run qa` 打包测试版本
  * `npm run lint` 检查并修复代码格式
  * `npm run lint:style` 修复.vue和.html中的样式格式
  * `npm run lint:css` 修复.css和.less文件中的样式格式
  * `npm run d2u` 将src目录下的文件换行符由windows转换为linux风格
  * `npm run commit` 生成符合验证格式的commit信息
  * `npm run sftp` 上传打包文件到测试服务器
  * `npm run publish` 线上版本发布命令（需要带参数，例如：npm run publish wallet）
  * `npm run online` 将本地分支发布到线上（需要带参数，需要发布的分支名，例如 npm run online feature）
  
### 变量配置说明
  ```` javascript
  // 挂载到window和Vue原型上
  $_ = {
    store, // vuex实例
    mapState, // vuex辅助函数
    mapGetters,
    mapMutations,
    mapActions,
    Loading, // 控制请求加载提示动画
    isLastPage, // 判断分页请求时数据是否为最后一页 
    entryOtherPage, // 通过改变location.href进入到其他页面
    Toast, // mint-ui 组件
    Indicator // mint-ui 组件
  ````

### axios配置说明
  * 默认每个请求开始时会自动加上加载提示动画框，请求结束时会取消提示框。如果某个请求不需要提示框，可按如下操作，给config传入`$_hideLoading: true`
  
     ```` javascript
     // example
     export function getInvitationList (params) {
       return Vue.axios.get('/apimember/speech/course/invite', { params, $_hideLoading: true })
     }
     ````
     
  * 如果请求返回的data.code为0会默认提示data.msg,取消默认行为可按如下操作，给config传入`$_cancelNotice: true`
  
     ````
     // example
     export function getInvitationList (params) {
       return Vue.axios.get('/apimember/speech/course/invite', { params, $_cancelNotice: true })
     }
     ````
     
### 自定义脚本文件
  * `scripts/app-hash.js` 将app.[hash].js改为app.js?[hash]用于单文件控制缓存
  * `scripts/dos2unix.js` 转换系统换行符为linux风格
  * `scripts/online-shell.js` 线上分模块打包构建
  * `scripts/publish-online.js` 将本地分支发布到线上分支
  * `scripts/sftp.js` sftp配置和上传控制
  * `scripts/verify-commit-msg.js` pre-commit钩子验证提交信息格式

### debugger模式
  如果需要开启debugger模式，将用户的token写入VUE_APP_MEMEBER_TOKEN中，并将VUE_APP_DEBUGGER的值设置为debugger，就可实现用本地代码调试需要验证权限的接口。

### 测试服务器上线流程
  * 直接运行`npm run sftp`命令，该命令会做以下几件事情：
    1. 将本地代码进行打包（qa环境）
    2. 修改输出文件index.html中对app相关文件的引用地址
    3. 重命名app相关文件对应index.html中的引用值
    4. 将生成的文件上传到测试服务器
  * 说明
    1. 之所以有步骤2和3是为了配合后端更好的做文件缓存控制，正式环境出html文件外的资源文件是托管到第三方平台，该步骤决绝了每次打包时将app.[hash].js转换为app
    .js，由原来的多个文件转为单个文件，减少文件数量，降低第三方存储空间。
    2. 该方案会存在一个问题，就是线上不能同时运行多个版本，因为每次打包都会覆盖之前的版本，生成唯一的app.js。
    
### 正式服务器上线流程
  1. 确保测试服务器代码测试通过
  2. `npm run online` 将本地分支发布到线上（需要带参数，需要发布的分支名，例如 npm run online feature）
