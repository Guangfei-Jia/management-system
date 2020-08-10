export default {
  state: {
    userState: '我是user模块状态'
  },
  mutations: {
    SET_USER_STATE(state, data) {
      state.userState = data.name;
    }
  },
  actions: {
    SET_USER_STATE({ commit, rootState }, data) {
      console.log(rootState);
      setTimeout(() => {
        commit('SET_USER_STATE', data);
      }, 1000);
    }
  }
};
