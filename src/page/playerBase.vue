<template>
  <div>
    <div
      class="musicContent"
      :style="{height: `${musicContentHeight}px`}">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <footer
      ref="playerFooter"
      class="playerBase">
      <v-touch
        tag="section"
        class="playerBaseLeft"
        @tap="playerPage">
        <img :src="musicData && musicData.picUrl">
        <section class="musicInfo" ref="musicInfo">
          <h4
            class="musicName textLoop"
            ref="musicName"
            :style="{transform: `translateX(${songNameLoop.posX}px)`}">
            {{musicData && musicData.name}}
          </h4>
          <div><!-- 为了换行占个位置 --></div>
          <div
            class="musicArtists textLoop"
            ref="musicArtists"
            :style="{transform: `translateX(${songArtistsLoop.posX}px)`}">
            {{musicData && musicData.artists | joinArtists}}
          </div>
        </section>
      </v-touch>
      <section class="playerBaseRight">
        <v-touch
          tag="div"
          class="loopMode"
          @tap="switchLoopMode">
          {{loopMode[loopModeIndex].name}}
        </v-touch>
        <v-touch
          tag="div"
          class="like"
          :class="{'likeSelected': musicLike || musicData && musicData.canDislike}"
          @tap="like">like</v-touch>
        <v-touch
          tag="div"
          class="playButton"
          @tap="playStatus">
          <div :class="paused || pausedStatus ? 'pause' : 'play'"></div>
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
import {joinArtistsMixin, playerMessageMixin} from '../components/mixin/mixin'
import {textLoop} from '../config/library'

export default {
  name: 'playerBase',

  mixins: [joinArtistsMixin, playerMessageMixin],

  data () {
    return {
      musicContentHeight: 0,
      musicLike: false,
      songNameLoop: { // 歌曲过长滚动信息
        timer: null,
        posX: 0,
        key: 'songNameLoop'
      },
      songArtistsLoop: { // 歌手过长滚动信息
        timer: null,
        posX: 0
      }
    }
  },

  computed: {
    ...mapState([
      'ObjectAudio',
      'playerList',
      'playIndex',
      'loopModeIndex',
      'paused',
      'pausedStatus'
    ])
  },

  watch: {
    playerList () { // 播放列表变化时运行
      this.musicDataHandle()
      if (this.$route.name != 'musicLibrary') {
        this.ObjectAudio.autoplay = true
        this.pausedSave(false)
      }
      this.$nextTick(() => {
        this.textLoopStart()
      })
    }
  },

  mounted () {
    this.playerEvent()
    this.musicContentHeightGet()
    this.textLoopStart()
  },

  methods: {
    musicUrl,

    likeMusic,
    
    musicContentHeightGet () { // 获取musicContent高度
      this.musicContentHeight = document.documentElement.clientHeight - this.$refs.playerFooter.offsetHeight
      this.musicContentHeightSave(this.musicContentHeight)
    },

    textLoopStart () { // 文字滚动
      this.textLoop(this.$refs.musicInfo, this.$refs.musicName, this.songNameLoop)
      this.textLoop(this.$refs.musicInfo, this.$refs.musicArtists, this.songArtistsLoop)
    },

    textLoop, // 文字滚动函数

    playerPage () { // 跳转到player页
      this.$router.push({name: 'player'})
    },

    ...mapMutations([
      'musicContentHeightSave',
      'playIndexSave',
      'loopModeIndexSave',
      'pausedSave',
      'pausedStatusSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .musicContent {
    overflow-y: auto;
    position: relative;
  }
  .likeSelected { // 控制like
    color: #e96161;
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
