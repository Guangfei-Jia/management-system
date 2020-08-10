import Vue from "vue";
import Vuex from "vuex";
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import app from '@/store/modules/app';
import user from '@/store/modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    app,
    user
  }
});
