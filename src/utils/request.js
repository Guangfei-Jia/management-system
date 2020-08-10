/* eslint-disable */
import axios from 'axios';
import config from '@/config/index' // 路径配置
import configs from '@/config/config' // 路径配置
import store from '@/store';
import { getStore } from '@/utils/storage';
import $router from '@/router';
import { message } from './utils'

// const HOME_PAGE = configs.HOME_PAGE;
const service = axios.create ({
    baseURL: config.baseURL,
    timeout: 10000  //请求超时时间
})

//配置发送请求前的拦截器 可以设置token信息 
service.interceptors.request.use(
    config => {
      //loading+1
        store.dispatch('SET_LOADING', true);  //开启loading
      //正在请求更新token时，其他接口等待
        let tokens = getStore('tokens', true);
        if(tokens){
          //设置请求头token
          let accessToken = tokens.accessToken,
              tokenType = tokens.tokenType;
          config.headers.Authorization = `${tokenType} ${accessToken}`;
        }
        // config.headers = {"Accept": "application/json", "Content-Type": "application/json;charset=utf-8"}
        return config;
    },
    error => {
      //出错时loading清0
        setTimeout(function(){
          store.dispatch('SET_LOADING', 0)
        })
        return Promise.reject(error);
    }
)

// 配置响应拦截器 
service.interceptors.response.use(
    response => {
      const res = response.data
      // loading - 1
      store.dispatch('SET_LOADING', false)  //关闭loading
      // 这里处理一些response 正常放回时的逻辑
      switch (res.code) {
        //自由约定不同状态码下前端的处理逻辑
        // case 200:
        //     response.msg !== '' && notice(response.msg, 'message', 'success');
        //     return Promise.resolve(response);
        // case 401:
        //     $router.replace('/logins/login');
        //     // $router.replace('/login?redirect=' + $router.currentRoute.fullPath);
        //     store.dispatch('SET_LOGOUT');
        //     return Promise.resolve(response);
        case 4010:
            // $router.replace('/login?redirect=' + $router.currentRoute.fullPath);   //登录后跳转到上次退出的页面
            message
            $router.replace('/logins/login');
            store.dispatch('SET_LOGOUT');
            return Promise.resolve(response);
      }
      return Promise.resolve(res) // 这里直接返回data, 即接口返回的所有数据
    },
    error => {
      console.log(error)
        const status = Number(error.response.status);
        //loading-1
        store.dispatch('SET_LOADING', false)  //关闭loading
        switch (status) {
          case 500:
            console.log("服务器连接失败，请稍后再试")
            return Promise.reject(error);
          default:
              console.log("封装弹窗")
              return Promise.reject(error);
        }
        
    //   // 判断是否登录失效，按照实际项目的接口返回状态来判断
    //   if (error.toString().includes('776')) {
    //       window.location.href = window.location.origin + '/#/login'
    //   }
    }
  )

export default service
