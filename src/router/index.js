import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import { getStore, setStore } from '@/utils/storage';
import { isTokenExpired, isTokenWillExpired, createRoute, message } from '@/utils/utils';
import store from '@/store';
import { refreshAccessToken } from '@/api/public';
import NProgress from 'nprogress';
// import 'nprogress/nprogress.css' // 进度条样式
import config from '@/config/config';

Vue.use(VueRouter);


//设置登陆后欢迎页
let childrenRoutes = [{
    path: "",
    name: "Welcome",
    component: () => import('@/views/logins/Welcome'),
}]
const routes = [
  {
    path: "/",
    component: Home,
    children: childrenRoutes
  },
  {
    path: "/logins",
    name: "Logins",
    component: () => import(/* webpackChunkName: "logins" */'@/components/layout/UserWrap'),
    children:[
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "logins" */ '@/views/logins/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "logins" */ "@/views/logins/Register")
      },
      {
        path: 'reset',
        name: 'Reset',
        component: () => import(/* webpackChunkName: "logins" */ "@/views/logins/Reset")
      }
    ]
  },
  {
    name: '404',
    path: '/404',
    component: () => import(/* webpackChunkName: "public" */ "@/views/error/404"),
    meta: { model: 'error' }
  },
  {
    name: '403',
    path: '/403',
    component: () => import(/* webpackChunkName: "public" */ "@/views/error/403"),
    meta: { model: 'error' }
  },
  {
    name: '500',
    path: '/500',
    component: () => import(/* webpackChunkName: "public" */ "@/views/error/500"),
    meta: { model: 'error' }
  }
];

//动态设置路由
let menu = getStore('menu', true);
if (menu) {
    menu.forEach(function (v) {
      childrenRoutes.push(createRoute(v));
        if (v.children) {
            v.children.forEach(function (v2) {
              childrenRoutes.push(createRoute(v2));
                if (v2.children) {
                    v2.children.forEach(function (v3) {
                      childrenRoutes.push(createRoute(v3));
                    });
                }
            });
        }
    });
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
//自定义添加路由的逻辑，动态添加路由的时候清空原始路由，避免浏览器提示重复添加路由问题
router.selfaddRoutes = function (params){
  router.matcher = new VueRouter().matcher;
  router.addRoutes(params)
}
//全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  let tokens = getStore('tokens', true);
  if (to.path !== '/logins/login') {
    if (tokens) {
      // if (to.path === '/login') {
      //   next({
      //     path: '/'
      //   })
      //   NProgress.done()
      // } else { // 实时拉取用户的信息
      //   store.dispatch('GetUserInfo').then(res => {
      //     next()
      //   }).catch(err => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error('拉取用户信息失败，请重新登录！' + err)
      //       next({
      //         path: '/'
      //       })
      //     })
      //   })
      // }

      let refreshToken = `${tokens.tokenType} ${tokens.refreshToken}`,
        accessTokenExp = tokens.accessTokenExp;
      if (isTokenExpired(accessTokenExp)) {
        //2小时不操作过期了，删除store，重新登陆
        store.dispatch('SET_LOGOUT');
        message('error','登陆过期，请重新登陆！')
        next({
          path: '/logins/login'
        })
        NProgress.done();
      } else {
        //判断accessToken即将到期后刷新token
        if (accessTokenExp && isTokenWillExpired(accessTokenExp)) {
          refreshAccessToken(refreshToken).then(res => {
            tokens.accessToken = res.data.accessToken;
            tokens.accessTokenExp = res.data.accessTokenExp;
            if (res.data.refreshToken) {
              tokens.refreshToken = res.data.refreshToken;
            }
            setStore('tokens', tokens);
          });
        }
      }
    }else{
      next({
        path: '/logins/login'
      })
      NProgress.done()
    }
  }

  //页面中转
  // const HOME_PAGE = config.HOME_PAGE;
  // if (to.name === 'index' || to.path === '/index' || to.path === '/') {
  //   next({path: HOME_PAGE});
  //   NProgress.done()
  //   return false;
  // }
  next();
});
router.beforeResolve((to, from, next) => {
  // console.log('全局解析守卫'); //导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
  next();
});
//全局后置钩子
router.afterEach(() => {
  // console.log('全局后置钩子');
  NProgress.done();
});

export default router;
