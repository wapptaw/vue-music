import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  ObjectAudio: {}, // Audio对象
  playerList: [], // 播放列表
  musicContentHeight: 0, // 内容高度
  rankingListDetailData: {}, // 排行数据
  morelist: {}, // 模块更多数据
  djContent: null, // 电台数据
  playIndex: 0, // 播放序号
  loopModeIndex: 0, // 循环模式序号
  paused: true, // 是否暂停
  pausedStatus: true // 播放按钮状态控制
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})