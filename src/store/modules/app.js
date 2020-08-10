export default {
  state: {
    appState: '我是app模块状态'
  },
  mutations: {
    SET_APP_STATE(state, data) {
      state.appState = data.name;
    }
  },
  actions: {
    SET_APP_STATE({ commit }, data) {
      commit('SET_APP_STATE', data);
    }
  }
};
