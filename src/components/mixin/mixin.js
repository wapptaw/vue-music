export const joinArtistsMixin = { // 歌手名字连接
  filters: {
    joinArtists (v) {
      if (v) {
        let artists = v.map(function (val) {
          return val.name
        })
        return artists.join('&')
      }
    }
  }
}

export const countSwitchMixin = { // 播放次数转换
  filters: {
    countSwitch (count) {
      if (count / 100000000 >= 1) {
        return Math.round(count / 100000000) + '亿'
      } else if (count / 10000 >= 1) {
        return Math.round(count / 10000) + '万'
      } else {
        return count
      }
    }
  }
}

export const dateSwitchMixin = { // 日期转化
  filters: {
    dateSwitch (time) {
      let nowMS = Date.now(),
        timeStr = new Date(time),
        timeDistance = nowMS - time
      if (timeDistance < 60000) {
        return `${Math.ceil(timeDistance / 1000)}秒以前`
      } else if (timeDistance < 3600000) {
        return `${Math.floor(timeDistance / 60000)}分钟${Math.ceil(timeDistance % 60000 / 1000)}秒以前`
      } else if (timeDistance < 86400000) {
        return timeStr.toLocaleTimeString()
      } else {
        return timeStr.toLocaleDateString()
      }
    }
  }
}

/* 播放器部分属性和方法 */
export const playerMessageMixin = {
  data () {
    return {
      loopMode: [
        {
          type: 'loop',
          name: '循环'
        },
        {
          type: 'random',
          name: '随机'
        },
        {
          type: 'single',
          name: '单曲'
        }
      ],
      musicLike: false // 喜欢
    }
  },

  computed: {
    musicData () { // 通过序号获取歌曲数据
      let data = this.playerList[this.playIndex]
      return data
    }
  },

  watch: {
    playIndex () { // 播放序号改变时
      if (this.paused) {
        this.ObjectAudio.autoplay = false
      } else {
        this.ObjectAudio.autoplay = true
      }
      this.musicDataHandle()
      if (this.textLoopStart) {
        this.$nextTick(() => {
          this.textLoopStart()
        })
      }
    }
  },

  beforeRouteLeave (to, from, next) { // 路由离开事件
    // 清理掉一系列事件
    this.ObjectAudio.removeEventListener('ended', this.nextSongAuto)
    this.ObjectAudio.removeEventListener('error', this.nextSong)
    this.ObjectAudio.removeEventListener('loadstart', this.loadstartEvent)
    this.ObjectAudio.removeEventListener('canplay', this.canplayEvent)
    next()
  },

  methods: {
    async musicDataHandle () { // 对数据处理
      try {
        let res = await this.musicUrl(this.musicData.id)
        this.ObjectAudio.src = res.data[0].url
      } catch (e) {
        throw new Error(e)
      }
    },

    playerEvent () { // ObjectAudio上绑定的事件
      this.ObjectAudio.addEventListener('ended', this.nextSongAuto) // 结束后切歌
      this.ObjectAudio.addEventListener('error', this.nextSong) // 出错后自动切歌
      this.ObjectAudio.addEventListener('loadstart', this.loadstartEvent)// 开始查找音频
      this.ObjectAudio.addEventListener('canplay', this.canplayEvent)// 音频可以播放时
    },

    loadstartEvent () { // 保存音频暂停状态
      this.pausedStatusSave(true)
    },

    canplayEvent () { // 保存音频暂停状态
      this.pausedStatusSave(false)
    },

    start () { // 开始
      this.ObjectAudio.play()
      this.pausedSave(false)
    },

    pause () { // 暂停
      this.ObjectAudio.pause()
      this.pausedSave(true)
    },

    playStatus () { // 暂停和开始
      if (this.paused) {
        this.start()
      } else {
        this.pause()
      }
    },

    nextSong () { // 下一曲
      if (this.loopMode[this.loopModeIndex].type === 'single') {
        if (this.playIndex < this.playerList.length - 1) {
          this.playIndexSave(this.playIndex + 1)
        } else {
          this.playIndexSave(0)
        }
      }
      this.nextSongAuto()
    },

    nextSongAuto () { // 自动切换歌曲
      switch (this.loopMode[this.loopModeIndex].type) {
        case 'loop':
          if (this.playIndex < this.playerList.length - 1) {
            this.playIndexSave(this.playIndex + 1)
          } else {
            this.playIndexSave(0)
          }
          break
        case 'random': 
          let randomVal = parseInt(Math.random() * (this.playerList.length - 1))
          while(randomVal === this.playIndex) {
            randomVal = parseInt(Math.random() * (this.playerList.length - 1))
          }
          this.playIndexSave(randomVal)
          break
        case 'single':
          this.currentTime = 0
          break
      }
    },

    switchLoopMode () { // 切换循环模式
      var loopModeLength = this.loopMode.length - 1
      if (this.loopModeIndex >= loopModeLength) {
        this.loopModeIndexSave(0)
      } else {
        this.loopModeIndexSave(this.loopModeIndex + 1)
      }
    },

    async like () { // 喜欢
      try {
        if (this.musicData.canDislike) {
          let res = await this.likeMusic(this.musicData.id, false)
          if (res.code === 200) {
            this.musicLike = false
          }
        } else {
          let res = await this.likeMusic(this.musicData.id)
          if (res.code === 200) {
            this.musicLike = true
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
