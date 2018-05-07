import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  ObjectAudio: {}, // Audio对象
  playerList: [], // 播放列表
  musicContentHeight: 0 // 内容高度
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})