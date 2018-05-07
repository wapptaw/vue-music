export default {
  ObjectAudioSave (state, audio) { // 保存audio对象
    state.ObjectAudio = audio
  },

  playerListSave (state, playerList) { // 保存播放列表
    state.playerList = playerList
  },

  musicContentHeightSave (state, height) {
    state.musicContentHeight = height
  }
}
