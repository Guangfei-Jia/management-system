import { setStore, removeStore } from '@/utils/storage';
import { checkResponse } from '@/utils/utils';
import { getUserMenu } from '@/api/public'

export default {
  SET_LOADING({ commit }, data) {
    commit('SET_LOADING', data);
  },

  SET_LOGIN({ commit }, data) {
    //缓存token和用户信息
    setStore('tokens', data.tokens);
    setStore('userInfo', data.userInfo);
    commit('SET_LOGIN', data);
  },

  SET_LOGOUT({ commit }, data) {
    //缓存token和用户信息
    removeStore('tokens');
    removeStore('userInfo');
    removeStore('menu');
    commit('SET_LOGOUT');
  },

  SET_MENU({ commit }) {
    return new Promise((resolve, reject) => {
      getUserMenu().then(res => {
        if (!checkResponse(res)) {
          reject();
        }
        setStore('menu', res.data)
        commit('SET_MENU', res.data);
        resolve();
      })
    })
  },

  SET_BREAD({ commit }, data) {
    commit('SET_BREAD', data);
  }
};
