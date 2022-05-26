import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import getters from './getters/index.js'
import actions from './actions/index.js'
import mutations from './mutations/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
