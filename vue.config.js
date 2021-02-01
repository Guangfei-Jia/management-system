//vue inspect 查看webpack完整配置vue inspect plugins
//vue ui 进入可视化页面查看
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin');                 // 开启gzip压缩， 按需引用
const productionGzipExtensions = ['js', 'css', 'json', 'txt', 'html', 'ico', 'svg']     // 需要gzip压缩的文件后缀，对于png，jpg，jpeg没有压缩效果，对于svg，ico文件以及bmp文件压缩效果达到50%
const PROD_GZIP = true                                                                  // 是否使用gzip,
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);                  // 是否生产环境
const IS_DEV = ['development', 'dev'].includes(process.env.NODE_ENV);                   // 是否生产环境
const resolve = (dir) => path.join(__dirname, './', dir);                               // 真实路径（绝对路径）
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;   // 打包分析

const config = {
    // HOST: '192.168.1.101',                              //监听地址，与src/config/index内的配置相同
    // REAL_PATH: 'http://192.168.1.101:8090',             //代理api接口地址

    HOST: '192.168.1.174',                              //监听地址，与src/config/index内的配置相同
    REAL_PATH: 'http://192.168.1.174:8090',             //代理api接口地址
    PORT: 8080,                                     //监听端口，与src/config/index内的配置相同
    PUBLIC_PATH: './',           //自定义publicpath /site/vue-demo/
}
//cdn预加载使用
const EXTERNALS = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios',
    'element-ui': 'ELEMENT',
    'js-cookie': 'Cookies',
    'nprogress': 'NProgress'
}
const CDN = {
    //开发环境
    dev:{
        css: [
        //   'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
        //   'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
        ],
        js: []
    },
    // 生产环境
    build: {
        css: [
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
            'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
        ],
        js: [
            'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
            'https://cdn.jsdelivr.net/npm/vue-router@3.1.6/dist/vue-router.min.js',
            'https://cdn.jsdelivr.net/npm/vuex@3.1.3/dist/vuex.min.js',
            'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
            'https://unpkg.com/element-ui/lib/index.js',
            'https://cdn.bootcss.com/js-cookie/2.2.1/js.cookie.min.js',
            'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
        ]
    }
}

module.exports = {
    // mode: 'production', //默认生产环境，默认开启tree sharking 和 UglifyJsPlugin代码压缩，development
    publicPath: IS_PROD ? config.PUBLIC_PATH : '/',         // 公共路径,若使用./嵌套路由将失效
    outputDir: process.env.outputDir || 'dist',             // 'dist', 生产环境构建文件的目录
    // assetDir: 'static',                                     // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave:false,                                       // 关闭eslint检测 是否在开发环境下通过 eslint-loader 在每次保存时 lint 检测
    runtimeCompiler: true,                                  // 是否使用包含运行时编译器的 Vue 构建版本
    parallel: require("os").cpus().length > 1,              // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    indexPath: 'index.html' ,                               // 相对于打包路径index.html的路径
    productionSourceMap: !IS_PROD,                          // 生产环境是否开启 source map 开启会变慢，此处关闭                       

    //可链式操作的webpack
    chainWebpack: config => {
        config.resolve.symlinks(true);                      // 修复热更新失效
        // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: "static"
                }
            ]);
        }
        // 压缩图片 需要 npm i -D image-webpack-loader  压缩后dist文件没有img文件夹了，img文件合并到了app内
        // image-webpack-loader有时会导致本地图片引入出问题
        config.module
            .rule("images")
            .use("image-webpack-loader")
            .loader("image-webpack-loader")
            .options({
                mozjpeg: { progressive: true, quality: 65 },
                optipng: { enabled: false },
                pngquant: { quality: [0.65, 0.9], speed: 4 },
                gifsicle: { interlaced: false },
                webp: { quality: 75 }
            });
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        // config.plugin("html").tap(args => {
        //     // 修复 Lazy loading routes Error
        //     args[0].chunksSortMode = "none";
        //     return args;
        // });


        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item.use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 要公用的scss的路径
                    resources: ['./src/assets/css/common.scss']
                })
                .end()
        })
        /**
        * 添加CDN参数到htmlWebpackPlugin配置中，详见public/index.html 修改
        */
        config.plugin('html').tap(args => {
            if(IS_PROD){
                args[0].cdn = CDN.build
            }
            if (IS_DEV) {
                args[0].cdn = CDN.dev
            }
            return args
        })
  
        // svg loader
        const svgRule = config.module.rule('svg')           // 找到svg-loader
        svgRule.uses.clear()                                // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/)                 // 正则匹配排除node_modules目录
        svgRule                                             // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/assets/icons'))
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    },

    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],   //自动解析扩展名，引入时不需要携带扩展名
            //目录重命名
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
                // '@api': resolve('src/api'),
                // '@assets': resolve('src/assets'),
                // '@components': resolve('src/components'),
                // '@config': resolve('src/config'),
                // '@mixins': resolve('src/mixins'),
                // '@store': resolve('src/store'),
                // '@utils': resolve('src/utils'),
                // '@views': resolve('src/views'),
            }
        }

        //生成环境
        if (IS_PROD) {
            //1、生产环境npm包转CDN，不打包externals下的资源
            config.externals = EXTERNALS
            //2、构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip，详情见README.md;需要 cnpm i -D compression-webpack-plugin
            PROD_GZIP && config.plugins.push(
                new CompressionWebpackPlugin({
                  filename: '[path].gz[query]',
                  algorithm: 'gzip',    //压缩算法
                  test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //匹配文件
                  threshold: 10240, //只处理比此值大的文件，默认0
                  minRatio: 0.8, //压缩比例小于当前值才会被处理，默认0.8
                  deleteOriginalAssets: false   //是否删除源文件，默认不删除
                })
            )
        }

        //开发环境
        if (IS_DEV) {
            /**
             * 关闭host check，方便使用ngrok之类的内网转发工具
             */
            config.devServer = {
                disableHostCheck: true
            }
            config.devtool = 'source-map'
        }
    },

    // css: {
    //     modules: false,
    //     extract: IS_PROD,
    //     // 为css后缀添加hash
    //     // extract: {
    //     // filename: 'css/[name].[hash:8].css',
    //     // chunkFilename: 'css/[name].[hash:8].css'
    //     //}，
    //     sourceMap: false,
    //     loaderOptions: {
    //       sass: {
    //         // 向全局sass样式传入共享的全局变量
    //         // data: `@import "~assets/scss/variables.scss";$src: "${process.env.VUE_APP_SRC}";`
    //         data: `$src: "${process.env.VUE_APP_SRC}";`
    //       },
    //       // px转换为rem
    //       // postcss: {
    //       //  plugins: [
    //       //   require('postcss-pxtorem')({
    //       //    rootValue : 1, // 换算的基数
    //       //    selectorBlackList : ['weui', 'el'], // 忽略转换正则匹配项
    //       //    propList  : ['*']
    //       //   })
    //       //  ]
    //       // }
    //     }
    // },

    devServer: {
        overlay: {                                          // 在浏览器上全屏显示编译的errors或warnings。
            warnings: true,
            errors: true
        },
        host: config.HOST,                                  // ip
        port: config.PORT,                                  // 端口号
        https: false,                                       // https:{type:Boolean}
        open: true,                                        // 配置自动启动浏览器
        hotOnly: true,                                      // 热更新
        proxy: {                                            // 可配置多个跨域
          '/dev': {                                         // 请求的代称，写在Axios里的BaseUrl
            target: config.REAL_PATH,                        // 真实请求URl
            changeOrigin: true,                             // 允许跨域
            // ws: true,                                    // websocket支持
            secure: false,                                  // 如果想要使用证书，关闭安全检测；默认情况下如果请求的服务是https的，并且证书是未认证的，则该未认证证书默认无法使用。
            pathRewrite: {  // 替换，通配/api的替换成/
              '^/dev': '/'
            }
          }
        }
      }
}