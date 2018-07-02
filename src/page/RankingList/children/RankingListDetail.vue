<template>
  <section class="rankingListDetail" :style="{height: musicContentHeight + 'px'}">
    <header-bar :title="$route.query.title" @heightGet="headerBarHeightGet"></header-bar>
    <section
      class="rankingList"
      :style="{height: rankingListHeight + 'px'}"
      ref="rankingListBox"
      @scroll="pullUp">
      <div class="rankingLogo">
        <img :src="detailData.playlist.coverImgUrl" class="rankingImg">
        <p class="rankingDes">{{detailData && detailData.playlist.description}}</p>
      </div>
      <ul class="ulRanking">
        <li
          v-for="(item, index) in detailData.playlist.tracks.slice(0, offset)"
          :key="index"
          class="liRanking">
          <div class="listLeft">
            <img :src="item.al.picUrl" class="listImg">
            <p class="listTitle">{{item.name}} - {{item.ar | joinArtists}}</p>
          </div>
          <div class="listRight">
            <v-touch
              tag="span"
              class="play"
              :class="index === playIndex ? 'pause' : 'start'"
              @tap="playControl(index, item)"></v-touch>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import {listTop} from '../../../api/getData'
import {mapState, mapMutations} from 'vuex'
import {joinArtistsMixin} from '../../../components/mixin/mixin'

export default {
  name: 'RankingListDetail',

  components: {
    HeaderBar: () => import('../../../components/common/HeaderBar')
  },

  mixins: [joinArtistsMixin],

  data () {
    return {
      headerBarHeight: 0,
      playIndex: '',
      offset: 20 // 加载数
    }
  },

  computed: {
    detailData () { // 排行列表数据
      return this.rankingListDetailData[this.$route.query.idx]
    },

    rankingListHeight () { // 列表高度
      return this.musicContentHeight - this.headerBarHeight
    },

    ...mapState([
      'rankingListDetailData',
      'musicContentHeight'
    ])
  },

  mounted () {
    //
  },

  methods: {
    headerBarHeightGet (h) { // headerBar高度
      this.headerBarHeight = h
    },

    playControl (index, musicData) { // 开始和暂停
      if (this.playIndex === index) {
        this.playIndex = ''
        this.playerStatusSave(false)
      } else {
        this.playIndex = index
        this.playerListSave([{
          id: musicData.id,
          name: musicData.name,
          artists: musicData.ar,
          picUrl: musicData.al.picUrl
        }])
        this.playerStatusSave(index)
      }
    },

    pullUp (e) { // 上拉加载
      let 
        boxHeight = this.$refs.rankingListBox.scrollHeight,
        boxTop = this.$refs.rankingListBox.scrollTop
      if (boxHeight - this.rankingListHeight - boxTop < 30) {
        this.addData()
      }
    },

    addData () { // 增加数据
      if (this.offset < this.detailData.playlist.tracks.length) {
        this.offset += 20
      }
    },

    ...mapMutations([
      'playerListSave',
      'playerStatusSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .rankingListDetail {
    position: fixed;
    width: 100%;
    background-color: #fff;
    left: 0;
    top: 0;
    background-color: #e6e6e6;
    .rankingList {
      overflow: auto;
      .rankingLogo {
        width: 100%;
        height: 50vw;
        overflow: hidden;
        display: flex;
        align-items: center;
        position: relative;
        .rankingImg {
          width: 100%;
        }
        .rankingDes {
          position: absolute;
          font-size: .12rem;
          padding: 0 .1rem;
          color: #fff;
          bottom: .05rem;
        }
      }
      .ulRanking {
        .liRanking {
          display: flex;
          justify-content: space-between;
          padding: .05rem .05rem;
          margin: 2px 0;
          background-color: #fff;
          .listLeft {
            display: flex;
            align-items: center;
            .listImg {
              width: 10%;
              height: 100%;
              border-radius: 3px;
            }
            .listTitle {
              font-size: .13rem;
              color: #5f5f5f;
              margin-left: .1rem;
            }
          }
          .listRight {
            display: flex;
            align-items: center;
            .play {
              width: .25rem;
              height: .25rem;
              border-radius: .25rem;
              border: 1px solid #6b6b6b;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .start {
              &::after {
                content: '';
                right: 4px;
                position: absolute;
                border-top: .1rem solid transparent;
                border-left: .12rem solid #8f8f8f;
                border-bottom: .1rem solid transparent;
              }
            }
            .pause {
              &::after {
                content: '';
                width: .05rem;
                height: .15rem;
                border-left: 2px solid #8f8f8f;
                border-right: 2px solid #8f8f8f;
              }
            }
          }
        }
      }
    }
  }
</style>

