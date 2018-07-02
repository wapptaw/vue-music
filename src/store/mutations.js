export default {
  ObjectAudioSave (state, audio) { // 保存audio对象
    state.ObjectAudio = audio
  },

  playerListSave (state, playerList) { // 保存播放列表
    state.playerList = playerList
  },

  musicContentHeightSave (state, height) { // 除去底部播放条的高度
    state.musicContentHeight = height
  },

  rankingListDetailSave (state, data) { // 排行榜详细数据
    state.rankingListDetailData[data.idx] = data.data
  },

  moreListSave (state, data) { // 模块更多数据
    state.morelist = data
  },

  djContentSave (state, data) { // 保存dj数据
    state.djContent = data
  },

  playIndexSave (state, index) { // 播放序号保存
    state.playIndex = index
  },

  loopModeIndexSave (state, index) { // 循环序号保存
    state.loopModeIndex = index
  },

  pausedSave (state, status) { // 暂停状态保存
    state.paused = status
  },

  pausedStatusSave (state, status) { // 暂停按钮状态保存
    state.pausedStatus = status
  },
}
