# management-system管理系统对应服务端
    开发框架：vue.js
    整体架构：vue + vuex + vue-router + element-ui
## 目录文件介绍
    dist            打包后的全部文件
    public          首页及部分静态文件
    src             源码
        api             全部接口集合
        assets          css，js、img、svg存放
        components      组件集
            layout          布局相关组件
            ...             其他组件
        config          接口环境配置
        mixins          混入模块
        router          路由模块
        store           vuex模块
        utils           全局js文件
            common.js       通用js
            directive.js    自定义指令
            filters.js      vue filter过滤器
            request.js      ajax请求封装
            storage.js      缓存相关
            utils.js        工具js
        views           页面
            error           请求错误页面
            logins          登陆、注册、修改密码、欢迎页
            system          系统管理模块
    tests/unit      单元测试模块
## 已实现功能点
    1、token登陆权限控制
    2、发送邮件修改密码
    3、上传头像，修改个人信息
    4、登陆、注册
    5、菜单管理、用户管理、权限管理
    6、websocket 聊天模块

## 已做的优化
    1、图片懒加载
    2、gzip打包压缩
    3、图片压缩
    4、引入CDN，减少包体积
    5、路由懒加载

## 运行步骤
    1、

## 注意事项

