<template>
  <div
    class="player">
    <header class="playerHeader">
      <v-touch tag="span" class="backArrows" @tap="back">&lt;</v-touch>
      <p class="songName" ref="songName">
        <span
          class="songNameText"
          ref="songNameText"
          :style="{transform: `translateX(${loopData.posX}px)`}">{{musicData && musicData.name}}</span>
      </p>
    </header>
    <v-touch
      tag="section"
      class="playerMain"
      @swipeleft="lyric"
      @swiperight="icon">
      <transition name="fade" mode="out-in">
        <lyric-page v-if="lyricShow" key="lyricPage" :songId="playerList[playIndex].id" :songBg="musicData && musicData.picUrl"></lyric-page>
        <section v-else class="iconPage">
          <div
            key="songIcon"
            class="songIcon"
            :style="{transform: `rotateZ(${rotateAngle}deg)`}">
            <img :src="musicData && musicData.picUrl" class="songImg">
          </div>
          <section class="message">
            <v-touch
              tag="div"
              class="like"
              :class="{'likeSelected': musicLike || musicData && musicData.canDislike}"
              @tap="like">like</v-touch>
            <v-touch
              tag="div"
              class="comment"
              @tap="linkComment">评论</v-touch>
            <v-touch
              tag="div"
              class="songMessage"
              @tap="openSongDetail">song</v-touch>
          </section>
        </section>
      </transition>
    </v-touch>
    <footer class="playerFooter">
      <section class="progressBar">
        <span class="playTime">{{currentTime | secondSwitch}}</span>
        <section class="progress">
          <div class="totalBar" ref="totalBar"></div>
          <div
            class="currentBar"
            :style="{width: currentWidth + 'px'}"></div>
          <v-touch
            tag="div"
            class="dragBar"
            :style="{left: currentWidth + 'px'}"
            @panstart="dragStart"
            @panmove="drag"
            @panend="dragEnd"></v-touch>
        </section>
        <span class="totalTime">{{totalTime | secondSwitch}}</span>
      </section>
      <section class="playerControl">
        <v-touch
          tag="div"
          class="playMode"
          @tap="switchLoopMode">{{loopMode[loopModeIndex].name}}</v-touch>
        <section class="startPause">
          <v-touch
            tag="div"
            class="pre"
            @tap="preSong"></v-touch>
          <v-touch
            tag="div"
            class="playButton"
            @tap="playStatus">
            <div :class="paused || pausedStatus ? 'pause' : 'play'"></div>
          </v-touch>
          <v-touch
            tag="div"
            class="next"
            @tap="nextSong"></v-touch>
        </section>
        <v-touch
          tag="div"
          class="playList"
          @tap="openSongsList">
          <div v-for="count in 3" :key="count"><!-- 为了制作图标 --></div>
        </v-touch>
      </section>
    </footer>
    <screen-shade :shade="shade" @tapEvent="closeShade"></screen-shade>
    <transition name="slide-bottom">
      <songs-list v-if="popupSongsList" @closeList="closeSongsList"></songs-list>
      <song-detail v-if="popupSongDetail" :songId="playerList[playIndex].id"></song-detail>
    </transition>
  </div>
</template>

<script>
import {playerMessageMixin} from '../../components/mixin/mixin'
import {mapState, mapMutations} from 'vuex'
import {secondSwitch, textLoop} from '../../config/library'
import {musicUrl, likeMusic} from '../../api/getData'

export default {
  name: 'player',

  filters: {
    secondSwitch
  },

  mixins: [playerMessageMixin],

  components: {
    ScreenShade: () => import('../../components/common/ScreenShade'),
    SongsList: () => import('./component/SongsList'),
    SongDetail: () => import('./component/SongDetail'),
    LyricPage: () => import('./component/LyricPage')
  },

  data () {
    return {
      currentTime: 0, // 当前时长
      totalBarWidth: 0, // 进度条总长度
      currentWidth: 0, // 进度条当前长度
      currentDeltaX: 0, // 进度条拖动的距离
      dragDeltaX: 0, // 进度条拖动结束后的距离
      totalTime: 0, // 音频总时长
      rotateAngle: 0, // 旋转角
      rotateTimer: null, // 旋转定时器
      speed: 0, // 旋转速度
      shade: false, // 遮罩
      popupSongsList: false, // 歌曲列表弹窗
      popupSongDetail: false, // 歌曲详情弹窗
      loopData: {
        posX: 0,
        timer: null
      },
      lyricShow: false // 歌词显示
    }
  },

  computed: {
    ...mapState([
      'ObjectAudio',
      'playerList',
      'playerStatus',
      'playIndex',
      'loopModeIndex',
      'paused',
      'pausedStatus'
    ])
  },

  watch: {
    paused (status) { // 旋转
      status ? this.speedDownRotateAnimation() : this.speedUpRotateAnimation()
    }
  },

  mounted () {
    this.playerEvent()
    this.timeInit()
    this.timeupdate()
    this.durationChangeEvent()
    this.titleLoop()
    this.paused ? this.speedDownRotateAnimation() : this.speedUpRotateAnimation()
  },

  methods: {
    musicUrl,

    likeMusic,

    async preSong () { // 上一曲,不考虑播放模式
      try {
        if (this.playIndex > 0) {
          this.playIndexSave(this.playIndex - 1)
        } else {
          this.playIndexSave(this.playerList.length - 1)
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    totalBarWidthGet () { // 计算进度条长度
      this.totalBarWidth =  this.$refs.totalBar.offsetWidth
    },

    currentWidthGet () { // 计算当前进度条长度 // 有问题
      var percent = this.currentTime / this.totalTime
      this.currentWidth = (this.totalBarWidth - 5) * percent // 总长度减去拖动球的半径
    },

    timeupdateEvent () { // 时长更新事件绑定的函数
      this.currentTime = this.ObjectAudio.currentTime
      this.dragDeltaX = this.currentWidth
      this.currentWidthGet()
    },
    
    durationChangeEvent () { // 当音频时长改变事件
      this.ObjectAudio.addEventListener('durationchange', this.totalTimeGet)
    },

    totalTimeGet () { // 获取音频总时长
      this.totalTime = this.ObjectAudio.duration
    },

    timeupdate () { // 进度条事件
      this.ObjectAudio.addEventListener('timeupdate', this.timeupdateEvent) // 时长改变时
    },

    timeInit () { // 初始化计算
      this.totalTime = this.ObjectAudio.duration
      this.currentTime = this.ObjectAudio.currentTime
      this.totalBarWidthGet()
      this.currentWidthGet()
    },

    dragStart () { // 拖动进度条滑块开始
      this.ObjectAudio.removeEventListener('timeupdate', this.timeupdateEvent)
    },

    drag (e) { // 拖动进度条滑块中
      // 求当前长度与总长度的百分比，然后求currentTime
      this.currentDeltaX = this.dragDeltaX + e.deltaX
      if (this.currentDeltaX > this.totalBarWidth) {
        this.currentDeltaX = this.totalBarWidth - 5 // 减去拖动球的半径
      }
      if (this.currentDeltaX < 0) {
        this.currentDeltaX = 0
      }
      var percent = this.currentDeltaX / this.totalBarWidth
      this.currentTime = this.totalTime * percent
      this.currentWidthGet()
    },

    dragEnd (e) { // 拖动进度条滑块结束
      this.ObjectAudio.currentTime = this.currentTime
      this.ObjectAudio.addEventListener('timeupdate', this.timeupdateEvent)
      this.dragDeltaX = this.currentDeltaX
    },

    iconRotate () { // 旋转函数
      this.rotateAngle += this.speed
      if (this.rotateAngle >= 360) {
        this.rotateAngle = 0
      }
    },

    speedUpRotate () { // 加速旋转函数
      if (this.speed < 2) {
        this.speed += 0.1
      } else {
        this.speed = 2
      }
      this.iconRotate()
    },

    speedDownRotateAnimation () { // 减速停止旋转动画
      clearInterval(this.rotateTimer)
      var timer = setInterval(() => {
        if (this.speed > 0) {
          this.speed -= 0.1
        } else {
          this.speed = 0
          clearInterval(timer)
        }
        this.iconRotate()
      }, 30)
    },

    speedUpRotateAnimation () { // 加速旋转动画
      this.rotateTimer = setInterval(this.speedUpRotate, 30)
    },

    back () { // 返回
      this.$router.go(-1)
    },

    openSongsList () { // 打开歌曲列表
      this.shade = true
      this.popupSongsList = true
    },
    closeSongsList () { // 关闭歌曲列表
      this.shade = false
      this.popupSongsList = false
    },

    closeShade () { // 关闭遮罩
      this.shade = false
      this.popupSongsList = false
      this.popupSongDetail = false
    },

    textLoop, // 文字滚动

    titleLoop () { // 歌曲名滚动
      this.textLoop(this.$refs.songName, this.$refs.songNameText, this.loopData)
    },

    linkComment () { // 跳转评论列表
      this.$router.push({name: 'commentMore', query: {type: 'song', id: this.playerList[this.playIndex].id}})
    },

    openSongDetail () { // 打开歌曲详情
      this.shade = true
      this.popupSongDetail = true
    },

    lyric () { // 显示歌词
      if (!this.lyricShow) {
        this.lyricShow = true
      }
    },

    icon () { // 显示头像
      if (this.lyricShow) {
        this.lyricShow = false
      }
    },

    ...mapMutations([
      'playIndexSave',
      'loopModeIndexSave',
      'pausedSave',
      'pausedStatusSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .player {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #fff;
    .playerHeader {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background-color: rgba(0, 0, 0, 0.6);
      height: 8%;
      border-bottom: 1px solid #bdbdbd;
      box-sizing: border-box;
      .backArrows {
        font-size: .2rem;
        color: #fff;
        transform: scaleY(2);
        position: absolute;
        left: .1rem;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .songName {
        width: 80%;
        overflow: hidden;
        text-align: center;
        .songNameText {
          display: inline-block;
          font-size: .15rem;
          color: #fff;
          white-space: nowrap;
        }
      }
    }
    .playerMain {
      background-color: rgba(0, 0, 0, 0.6);
      height: 77%;
      .iconPage {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .songIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80%;
          .songImg {
            width: 55%;
            border-radius: 50%;
            border: .4rem solid #3a3a3a;
          }
        }
        .message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20%;
          div {
            margin: 0 .2rem;
          }
          .like {
            font-size: .16rem;
            color: #fff;
          }
          .comment {
            font-size: .16rem;
            color: #fff;
          }
          .songMessage {
            font-size: .16rem;
            color: #fff;
          }
        }
      }
    }
    .playerFooter {
      background-color: rgba(0, 0, 0, 0.6);
      height: 15%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: .1rem 0;
      box-sizing: border-box;
      .progressBar {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 .05rem;
        .playTime, .totalTime {
          font-size: .12rem;
          color: #fff;
        }
        .progress {
          margin: 0 .1rem;
          position: relative;
          width: 80%;
          div {
            position: absolute;
            left: 0;
            top: 0;
          }
          .totalBar {
            width: 100%;
            height: 2px;
            background-color: #e0e0e0;
          }
          .currentBar {
            height: 2px;
            background-color: #53e5ff;
          }
          .dragBar {
            width: .1rem;
            height: .1rem;
            border-radius: 50%;
            background-color: #f0f0f0;
            top: -4px;
          }
        }
      }
      .playerControl {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: .45rem;
        margin: 0 .1rem;
        .playMode {
          font-size: .15rem;
          color: #fff;
        }
        .startPause {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 50%;
          .pre {
            width: .3rem;
            height: .2rem;
            display: flex;
            &::before {
              content: '';
              border-top: .1rem solid transparent;
              border-right: .15rem solid #fff;
              border-bottom: .1rem solid transparent;
            }
            &::after {
              content: '';
              border-top: .1rem solid transparent;
              border-right: .15rem solid #fff;
              border-bottom: .1rem solid transparent;
            }
          }
          .playButton {
            width: .15rem;
            height: .2rem;
            .pause {
              border-top: .1rem solid transparent;
              border-left: .15rem solid #fff;
              border-bottom: .1rem solid transparent;
            }
            .play {
              width: .1rem;
              height: .2rem;
              border-left: .025rem solid #fff;
              border-right: .025rem solid #fff;
            }
          }
          .next {
            width: .3rem;
            height: .2rem;
            display: flex;
            &::before {
              content: '';
              border-top: .1rem solid transparent;
              border-left: .15rem solid #fff;
              border-bottom: .1rem solid transparent;
            }
            &::after {
              content: '';
              border-top: .1rem solid transparent;
              border-left: .15rem solid #fff;
              border-bottom: .1rem solid transparent;
            }
          }
        }
        .playList {
          height: .16rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          div {
            width: .2rem;
            height: 2px;
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
