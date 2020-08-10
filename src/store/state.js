import { getStore } from '@/utils/storage';
let userInfo = getStore('userInfo', true);
let menu = getStore('menu', true);
export default {
  requestLoading: 0, //全局loading
  loginState: !!userInfo, //登录状态
  userInfo: userInfo, //用户信息
  menu: menu, //用户菜单
  breadcrumb: []  //面包屑菜单
};
