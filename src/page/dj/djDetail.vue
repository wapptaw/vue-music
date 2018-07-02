<template>
  <div>
    <header-bar title="电台" @heightGet="headerBarHeightGet"></header-bar>
    <section
      class="djContent"
      :style="{height: mainHeight + 'px'}">
      <banner-show :bannerData="bannerData">
        <span slot="left" class="subCount">{{djContent.program.radio.subCount | countSwitch}}</span>
      </banner-show>
      <section class="djMain">
        <header class="djNav">
          <v-touch
            v-for="(item, index) in djNavData"
            :key="index"
            tag="h3"
            :class="{selected: djSelectStatus === index}"
            @tap="djContentSelect(index)">{{item.title}}</v-touch>
        </header>
        <v-touch
          tag="section"
          class="djDetail"
          :style="{transform: `translateX(${dragValue})`}"
          :swipe-options="{direction: 'horizontal'}"
          @swipeleft="slideLeft"
          @swiperight="slideRight">
          <section
            class="djDetailLeft">
            <section class="djMessage">
              <h4 class="djMessageTitle djTitle">主播</h4>
              <section class="djMessageContent">
                <img :src="bannerData.artists.picUrl" class="djMessageIcon">
                <div class="djMessageName">
                  <p class="name">{{bannerData.artists.name}}</p>
                  <p class="desc">{{bannerData.artists.description}}</p>
                </div>
              </section>
            </section>
            <section class="djDescription">
              <h4 class="djDescriptionTitle djTitle">电台简介</h4>
              <section class="djDescriptionContent">
                <div class="djDescriptionCategory">
                  <span class="title">分类：</span>
                  <span class="category">{{djContent.program.radio.category}}</span>
                </div>
                <p class="djDescriptionDetail">{{djContent.program.radio.desc}}</p>
              </section>
            </section>
            <comment-list :commentData="commentData" commentType="dj" :contentId="djContent.id"></comment-list>
          </section>
          <song-list class="programList" :songListData="songListData"></song-list>
        </v-touch>
      </section>
    </section>
  </div>
</template>

<script>
import {dj, djComment} from '../../api/getData'
import {mapState} from 'vuex'
import {countSwitchMixin} from '../../components/mixin/mixin'

export default {
  name: 'djDetail',

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar'),
    BannerShow: () => import('../../components/common/BannerShow'),
    CommentList: () => import('../../components/common/CommentList'),
    SongList: () => import('../../components/common/SongList')
  },

  mixins: [countSwitchMixin],

  data () {
    return {
      djNavData: [ // 导航栏
        {
          title: '详情',
          name: 'detail'
        },
        {
          title: '节目',
          name: 'program'
        }
      ],
      djSelectStatus: 0, // 导航判断值
      djCommentData: null, // 节目评论数据
      djProgramData: null, // 电台节目列表
      dragValue: 0, // 偏移量
      headerBarHeight: 0, // headerBar高度
      mainHeight: 0 // 主体高度
    }
  },

  computed: {
    bannerData() { // 顶部展示图数据
      return {
        name: this.djContent.program.radio.name,
        picUrl: this.djContent.program.radio.picUrl,
        artists: {
          name: this.djContent.program.dj.nickname,
          picUrl: this.djContent.program.dj.avatarUrl,
          description: this.djContent.program.dj.description
        }
      }
    },

    commentData () { // 评论数据
      if (this.djCommentData) {
        return [
          {
            title: '热门评论',
            data: this.djCommentData.hotComments.slice(0, 5) // 只取5条热门评论
          },
          {
            title: '最新评论',
            data: this.djCommentData.comments
          }
        ]
      }
    },

    songListData () { // 节目数据整理
      if (this.djProgramData) {
        return this.djProgramData.programs.map((item) => {
          return {
            name: item.mainSong.name,
            album: {
              name: item.mainSong.album.name,
              blurPicUrl: item.mainSong.album.blurPicUrl
            },
            artists: item.mainSong.artists,
            id: item.mainSong.id
          }
        })
      }
    },

    ...mapState([
      'djContent',
      'musicContentHeight'
    ])
  },

  mounted () {
    this.djGet()
    this.djCommentGet()
  },

  methods: {
    async djGet () { // dj节目列表获取
      try {
        let res = await dj(this.$route.query.id)
        this.djProgramData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    djContentSelect (index) { // 展示内容切换
      this.djSelectStatus = index
      switch (index) {
        case 0:
          this.dragValue = 0
          break
        case 1:
          this.dragValue = '-100%'
          break
        // 有其他值时再说
      }
    },

    slideLeft () { // 左滑
      this.djSelectStatus = 1
      this.dragValue = '-100%'
      this.rightShow = true
    },

    slideRight () { // 右滑
      this.djSelectStatus = 0
      this.dragValue = 0
    },

    async djCommentGet () { // dj评论获取
      try {
        let res = await djComment(this.djContent.id, 20, 0)
        this.djCommentData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    headerBarHeightGet (h) { // headerBar高度获取
      this.mainHeight = this.musicContentHeight - h
    }
  }
}
</script>

<style lang="scss" scoped>
  .djContent {
    overflow-y: auto;
    overflow-x: hidden;
    .subCount {
      position: absolute;
      right: .05rem;
      top: .05rem;
      font-size: .12rem;
      color: #fff;
      text-shadow: 2px 2px 4px #000;
    }
    .djMain {
      .djNav {
        display: flex;
        background-color: #f3f3f3;
        h3 {
          font-size: .15rem;
          font-weight: bold;
          color: #4d4d4d;
          width: 50%;
          text-align: center;
          height: .4rem;
          line-height: .4rem;
        }
        .selected {
          border-bottom: 3px solid #ff6868;
        }
      }
      .djDetail {
        display: flex;
        transition: transform .5s ease;
        .djDetailLeft {
          flex: none;
          width: 100vw;
          .djTitle {
            font-size: .13rem;
            color: #3d3d3d;
            margin: .05rem;
            padding-left: .05rem;
            border-left: 3px solid #fd4f4f;
          }
          .djMessage {
            .djMessageContent {
              display: flex;
              width: 100%;
              padding: .1rem .05rem;
              box-sizing: border-box;
              border-top: 1px solid #d6d6d6;
              border-bottom: 1px solid #d6d6d6;
              .djMessageIcon {
                width: 10%;
                height: 100%;
                border-radius: 3px;
              }
              .djMessageName {
                margin-left: .1rem;
                .name {
                  font-size: .12rem;
                  color: #363636;
                }
                .desc {
                  font-size: .12rem;
                  color: #474747;
                }
              }
            }
          }
          .djDescription {
            margin-bottom: .1rem;
            .djDescriptionContent {
              padding: 0 .05rem;
              .djDescriptionCategory {
                display: flex;
                align-items: center;
                margin-top: .1rem;
                .title {
                  font-size: .13rem;
                  color: #424242;
                }
                .category {
                  border: 1px solid #ff4242;
                  font-size: .12rem;
                  border-radius: 3px;
                  color: #fd3d3d
                }
              }
              .djDescriptionDetail {
                margin-top: .1rem;
                font-size: .13rem;
                color: #424242;
                line-height: 1.5em;
              }
            }
          }
        }
        .programList {
          flex: none;
          width: 100vw;
        }
      }
    }
  }
</style>
