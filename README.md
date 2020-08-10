# vue4
## sass or less
_开头的文件为导入文件，不单独编译
sass 变量（默认值）、嵌套（选择器、变量），占位选择符（只能使用extend调用，不用就不会被编译）、导入（正常导入、嵌套导入）、静默注释//、混合器（大段样式复用@mixin声明，@include引入，可传参）、继承、运算（数值、颜色、字符串）、函数、条件语句、循环语句、自定义函数@function、插值语句#{}
less 变量、混合（调用.class()）、嵌套、运算、变量转译使用括号、命名空间（#bundle() {},整个混入、#bundle[]调用部分混入）、注释、导入
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

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 服务端配置gzip
gzip on;		# 开启gzip
gzip_static on;
gzip_min_length 1024;
gzip_buffers 4 16k;
gzip_comp_level 2;
# 进行压缩的文件类型
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
gzip_vary off;	    # 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_disable "MSIE [1-6]\.";


### vue4默认包含的的plugin
// vue-loader是 webpack 的加载器，允许你以单文件组件的格式编写 Vue 组件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// webpack 内置插件，用于创建在编译时可以配置的全局常量
const { DefinePlugin } = require('webpack');
// 用于强制所有模块的完整路径必需与磁盘上实际路径的确切大小写相匹配
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
// 识别某些类型的 webpack 错误并整理，以提供开发人员更好的体验。
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 用于在 webpack 构建期间优化、最小化 CSS文件
const OptimizeCssnanoPlugin = require('optimize-css-assets-webpack-plugin');
// webpack 内置插件，用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
const { HashedModuleIdsPlugin } = require('webpack');
// 用于根据模板或使用加载器生成 HTML 文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于在使用 html-webpack-plugin 生成的 html 中添加 <link rel ='preload'> 或 <link rel ='prefetch'>，有助于异步加载
const PreloadPlugin = require('preload-webpack-plugin');
// 用于将单个文件或整个目录复制到构建目录
const CopyWebpackPlugin = require('copy-webpack-plugin');


