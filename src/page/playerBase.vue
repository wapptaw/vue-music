<template>
  <div>
    <div
      class="musicContent"
      :style="{height: `${musicContentHeight}px`}">
      <router-view></router-view>
    </div>
    <footer
      v-if="playerBaseShow"
      ref="playerFooter"
      class="playerBase">
      <section class="playerBaseLeft">
        <img :src="musicData && musicData.song.album.picUrl">
        <section class="musicInfo" ref="musicInfo">
          <h4 class="musicName textLoop" ref="musicName">
            {{musicData && musicData.name}}
          </h4>
          <div><!-- 为了换行占个位置 --></div>
          <div
            class="musicArtists textLoop"
            ref="musicArtists"
            :style="{transform: `translateX(${posX}px)`}">
            {{musicData && musicData.song.artists | joinArtists}}
          </div>
        </section>
      </section>
      <section class="playerBaseRight">
        <v-touch
          tag="div"
          class="loopMode"
          @tap="switchLoopMode">
          {{loopModeTxt}}
        </v-touch>
        <v-touch
          tag="div"
          class="like"
          :class="{likeSelected: musicLike || musicData && musicData.canDislike}"
          @tap="like">like</v-touch>
        <v-touch
          tag="div"
          class="playButton"
          @tap="playStatus">
          <div :class="playBtn"></div>
        </v-touch>
        <v-touch
          tag="div"
          class="nextMusic"
          @tap="nextSong"></v-touch>
      </section>
    </footer>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {musicUrl, likeMusic} from '../api/getData'

export default {
  name: 'playerBase',

  filters: {
    joinArtists (v) { // 歌手名字连接
      if (v) {
        let artists = v.map(function (val) {
          return val.name
        })
        return artists.join('&')
      }
    }
  },

  data () {
    return {
      musicContentHeight: 0,
      playerBaseShow: true,
      index: 0, // 播放序号
      loopMode: 'loop',
      playBtn: 'pause', // 暂停按钮的class选择
      paused: true, // 是否暂停
      musicLike: false,
      timerName: null, // 定时器
      timerArtists: null,
      posX: 0
    }
  },

  computed: {
    musicData () { // 歌曲数据
      let data = this.playerList[this.index]
      return data
    },

    loopModeTxt () { // 循环模式
      switch (this.loopMode) {
        case 'loop':
          return '循环'
          break
        case 'random':
          return '随机'
          break
        case 'single':
          return '单曲'
          break
        default:
          return '未知'
      }
    },

    ...mapState([
      'ObjectAudio',
      'playerList'
    ])
  },

  watch: {
    playerList () { // 播放列表变化时运行
      this.playStart()
      this.$nextTick(() => {
        this.textLoop(this.$refs.musicInfo, this.$refs.musicName, 'timerName')
        this.textLoop(this.$refs.musicInfo, this.$refs.musicArtists, 'timerArtists')
      })
    }
  },

  mounted () {
    this.playerEvent()
    this.musicContentHeightGet()
  },

  methods: {
    musicContentHeightGet () { // 获取musicContent高度
      this.musicContentHeight = document.documentElement.clientHeight - this.$refs.playerFooter.offsetHeight
      this.musicContentHeightSave(this.musicContentHeight)
    },

    async musicDataHandle () { // 对数据处理
      try {
        let res = await musicUrl(this.playerList[this.index].id)
        this.ObjectAudio.src = res.data[0].url
      } catch (e) {
        throw new Error(e)
      }
    },

    async playStart () { // 开始播放,在火狐上会连点两次，原因未知
      try {
        if (this.playerList.length > 0) {
          await this.musicDataHandle()
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async playerEvent () { // ObjectAudio上绑定的事件
      try {
        this.ObjectAudio.addEventListener('ended', async () => { // 这里用箭头函数保证this指向vue实例
          await this.nextSongAuto()
          this.ObjectAudio.autoplay = true
        })
        this.ObjectAudio.addEventListener('error', async () => { // 出错后自动切歌
          if (this.loopMode === 'single') {
            if (this.index < this.playerList.length - 1) {
              this.index++
            } else {
              this.index = 0
            }
          }
          await this.nextSongAuto()
          this.ObjectAudio.autoplay = true
        })
        this.ObjectAudio.addEventListener('loadstart', async () => { // 开始查找音频
          this.playBtn = 'pause'
        })
        this.ObjectAudio.addEventListener('canplay', async () => { // 音频可以播放时
          if (!this.paused) {
            this.playBtn = 'play'
          }
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    async like () { // 喜欢
      try {
        if (this.musicData.canDislike) {
          let res = await likeMusic(this.musicData.id, false)
          if (res.code === 200) {
            this.musicLike = false
          }
        } else {
          let res = await likeMusic(this.musicData.id)
          if (res.code === 200) {
            this.musicLike = true
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    playStatus () { // 暂停和开始
      if (this.playBtn === 'pause') {
        this.playBtn = 'play'
        this.ObjectAudio.play()
        this.ObjectAudio.autoplay = true
        this.paused = false
      } else {
        this.playBtn = 'pause'
        this.ObjectAudio.pause()
        this.ObjectAudio.autoplay = false
        this.paused = true
      }
    },

    async nextSong () { // 下一曲
      try {
        if (this.loopMode === 'single') {
          if (this.index < this.playerList.length - 1) {
            this.index++
          } else {
            this.index = 0
          }
        }
        await this.nextSongAuto()
        if (this.paused) {
          this.ObjectAudio.autoplay = false
        } else {
          this.ObjectAudio.autoplay = true
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async nextSongAuto () { // 自动切换歌曲
      try {
        switch (this.loopMode) {
          case 'loop':
            if (this.index < this.playerList.length - 1) {
              this.index++
            } else {
              this.index = 0
            }
            break
          case 'random': 
            let randomVal = parseInt(Math.random() * (this.playerList.length - 1))
            while(randomVal === this.index) {
              randomVal = parseInt(Math.random() * (this.playerList.length - 1))
            }
            this.index = randomVal
            break
          case 'single':
            break
        }
        await this.musicDataHandle()
        this.textLoop(this.$refs.musicInfo, this.$refs.musicName, 'timerName')
        this.textLoop(this.$refs.musicInfo, this.$refs.musicArtists, 'timerArtists')
      } catch (e) {
        throw new Error(e)
      }
    },

    switchLoopMode () { // 切换循环模式
      switch (this.loopMode) {
        case 'loop':
          this.loopMode = 'random'
          this.ObjectAudio.loop = false
          break
        case 'random':
          this.loopMode = 'single'
          this.ObjectAudio.loop = false
          break
        case 'single':
          this.loopMode = 'loop'
          this.ObjectAudio.loop = true
          break
      }
    },

    textLoop (box, child, timer) { // 歌名过长会滚动
      let 
        boxWidth = box.offsetWidth,
        childWidth = child.offsetWidth
      clearInterval(this[timer])
      this.posX = 0
      if (boxWidth < childWidth) {
        let distance = boxWidth - childWidth
        let speed = -1
        this[timer] = setInterval(() => {
          this.posX += speed
          if (this.posX <= distance - 10 || this.posX >= 10) {
            speed = -speed
          }
        }, 50)
      }
    },

    ...mapMutations([
      'musicContentHeightSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .musicContent {
    overflow-y: auto;
  }
  .playerBase {
    height: .6rem;
    width: 100%;
    padding: 0 .05rem;
    box-sizing: border-box;
    background-color: #ececec;
    display: flex;
    .playerBaseLeft {
      display: flex;
      align-items: center;
      width: 45%;
      margin-right: .1rem;
      overflow: hidden;
      img {
        height: .45rem;
        border-radius: 3px;
      }
      .musicInfo {
        margin-left: .05rem;
        overflow: hidden;
        .musicName {
          font-size: .16rem;
          color: #181818;
        }
        .musicArtists {
          font-size: .13rem;
          color: #5e5e5e;
        }
        .textLoop {
          white-space: nowrap;
          display: inline-block;
        }
      }
    }
    .playerBaseRight {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 50%;
      .loopMode {
        color: #646464;
      }
      .like {
        color: #646464;
      }
      .likeSelected { // 控制like
        color: #e96161;
      }
      .playButton {
        width: .15rem;
        height: .2rem;
        .pause {
          border-top: .1rem solid transparent;
          border-left: .15rem solid #646464;
          border-bottom: .1rem solid transparent;
        }
        .play {
          width: .1rem;
          height: .2rem;
          border-left: .025rem solid #646464;
          border-right: .025rem solid #646464;
        }
      }
      .nextMusic {
        width: .3rem;
        height: .2rem;
        display: flex;
        &::before {
          content: '';
          border-top: .1rem solid transparent;
          border-left: .15rem solid #646464;
          border-bottom: .1rem solid transparent;
        }
        &::after {
          content: '';
          border-top: .1rem solid transparent;
          border-left: .15rem solid #646464;
          border-bottom: .1rem solid transparent;
        }
      }
    }
  }
</style>
