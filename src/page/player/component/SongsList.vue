<template>
  <div class="playList">
    <h3 class="title" ref="title">
      <span class="text">播放列表</span>
      <v-touch
        tag="span"
        class="fork"
        @tap="closePage">×</v-touch>
    </h3>
    <ul class="ulPlayList" :style="{maxHeight: playListHeight + 'px'}">
      <v-touch
        v-for="(item, index) in playListData"
        :key="index"
        :ref="item.refParent"
        tag="li"
        class="liPlayList"
        :class="{selected: index === playIndex}"
        @tap="playSong(index)">
        <div
          class="name"
          :ref="item.refChild"
          :style="{transform: `translateX(${item.posX}px)`}">
          <span class="songName">{{item.name}}</span>
          <span class="join">-</span>
          <span class="artistsName">{{item.artists | joinArtists}}</span>
        </div>
      </v-touch>
    </ul>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {joinArtistsMixin} from '../../../components/mixin/mixin'
import {textLoop} from '../../../config/library'

export default {
  name: 'playList',

  mixins: [joinArtistsMixin],

  components: {
    ScreenShade: () => import('../../../components/common/ScreenShade')
  },

  data () {
    return {
      playListData: null,
      playListHeight: 0
    }
  },

  computed: {
    ...mapState([
      'playerList',
      'playIndex'
    ])
  },

  created () {
    this.loopDataGet()
  },

  mounted () {
    this.loopStart()
    this.playListHeightGet()
  },

  methods: {
    textLoop,

    loopDataGet () { // 文字滚动信息
      this.playListData = this.playerList.map(v => {
        let loopData = {
          timer: null,
          posX: 0,
          refParent: 'parent' + v.id,
          refChild: 'child' + v.id
        }
        return Object.assign(loopData, v)
      })
    },

    loopStart () { // 滚动开始
      this.playListData.forEach((v) => {
        this.textLoop(this.$refs[v.refParent][0].$el, this.$refs[v.refChild][0], v)
      })
    },

    closePage () { // 关闭页面
      this.$emit('closeList')
    },

    playSong (index) { // 选择歌曲
      this.playIndexSave(index)
      this.$nextTick(() => {
        this.$emit('closeList')
      })
    },

    playListHeightGet () { // 列表高度获取
      this.playListHeight = document.documentElement.clientHeight - this.$refs.title.offsetHeight
    },

    ...mapMutations([
      'playIndexSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .playList {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-radius: .05rem .05rem 0 0;
    .title {
      padding-left: .1rem;
      height: .45rem;
      background-color: #e7e7e7;
      border-radius: .05rem .05rem 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        font-size: .16rem;
        color: #3f3f3f;
      }
      .fork {
        font-size: .3rem;
        color: #6d6d6d;
        background-color: #c9c9c9;
        width: .45rem;
        height: 100%;
        border-top-right-radius: .05rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .ulPlayList {
      overflow: auto;
      padding-top: .05rem;
      box-sizing: border-box;
      .liPlayList {
        padding: .08rem 0;
        margin: 0 auto;
        overflow: hidden;
        width: 95%;
        .name {
          display: inline-block;
          white-space: nowrap;
          span {
            white-space: nowrap;
            vertical-align: middle;
          }
          .join {
            margin: 0 .05rem;
            font-size: .16rem;
            color: #505050;
          }
          .songName {
            font-size: .14rem;
            color: #222;
          }
          .artistsName {
            font-size: .13rem;
            color: #505050;
          }
        }
      }
      .selected {
        background-color: #6cf7eb;
        border-radius: 5px;
        padding-left: .05rem;
        padding-right: .05rem;
      }
    }
  }
</style>

