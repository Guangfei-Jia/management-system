import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/icons";
import ELEMENT from 'element-ui';
import VueLazyload from 'vue-lazyload';
import { message } from '@/utils/utils';
import ContentWrap from '@/components/layout/ContentWrap'

import 'element-ui/lib/theme-chalk/index.css';    //需要注释掉

import '@/utils/filters'
import '@/utils/directive'

Vue.use(ELEMENT);
Vue.component('ContentWrap', ContentWrap);  //全局注册内容包裹组件
Vue.prototype.$message = message;         //修改this.$message函数

//图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3, //预加载高度比例
  error: 'dist/error.png', //图片路径错误时加载图片
  loading: 'dist/loading.gif', //预加载图片
  attempt: 1, //尝试加载图片数量,默认3
  listenEvents: [], //想要监听的vue事件['scroll'（默认可省略）,'wheel','mousewheel','resize','animationend','transitionend','touchmove']
  adapter: {}, //动态修改元素属性
  filter: {} //动态修改图片地址路径
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
