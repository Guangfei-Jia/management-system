export default {
  SET_LOADING: (state, status) => {
    // error 的时候重置
    if (status === 0) {
      state.requestLoading = 0;
      return;
    }
    state.requestLoading = status
      ? ++state.requestLoading
      : --state.requestLoading;
  },

  SET_LOGIN: (state, loginInfo) => {
    state.loginState = true; //设置登录状态
    state.userInfo = loginInfo.userInfo;
  },

  SET_LOGOUT(state) {
    state.loginState = false;
    state.userInfo = null;
    state.menu = null;
  },

  SET_MENU(state, menu) {
    state.menu = menu;
  },

  SET_BREAD(state, bread) {
    state.breadcrumb = bread;
  }
};
