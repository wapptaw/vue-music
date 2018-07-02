<template>
  <div>
    <header-bar title="歌单详情" @heightGet="headerBarHeightGet"></header-bar>
    <section
      class="albumDetail"
      :style="{height: albumDetailHeigh + 'px'}">
      <banner-show :bannerData="bannerData">
        <span slot="left" class="playCount">{{albumDetailData.playCount | countSwitch}}</span>
      </banner-show>
      <section class="tag">
        <h4 class="title">标签：</h4>
        <ul class="ulTag">
          <li v-for="(item, index) in albumDetailData.tags" :key="index" class="liTag">{{item}}</li>
        </ul>
      </section>
      <section class="description">
        <p
          class="desText"
          :style="{height: desHeight}">简介：{{albumDetailData.description}}</p>
        <v-touch
          tag="span"
          class="arrows"
          @tap="unfold">{{desControl}}</v-touch>
      </section>
      <song-list :songListData="songListData"></song-list>
      <commnet-list :commentData="commentData" commentType="playlist" :contentId="albumDetailData.id"></commnet-list>
    </section>
  </div>
</template>

<script>
import {playlistDetail, playlistComment} from '../../api/getData'
import {countSwitchMixin} from '../../components/mixin/mixin'
import {mapState} from 'vuex'

export default {
  name: 'AlbumDetail',

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar'),
    CommnetList: () => import('../../components/common/CommentList'),
    SongList: () => import('../../components/common/SongList'),
    BannerShow: () => import('../../components/common/BannerShow')
  },

  mixins: [countSwitchMixin],

  data () {
    return {
      albumDetailData: '',
      limit: 20,
      offset: 0,
      playlistComment: '',
      desControlStatus: false,
      desHeight: '.4rem',
      headerBarHeight: 0, // 头部高度
      albumDetailHeigh: 0 // 主题内容高度
    }
  },

  computed: {
    commentData () { // 评论列表
      if (!this.playlistComment) return
      return [
        {
          title: '热门评论',
          data: this.playlistComment.hotComments.slice(0, 5) // 只取5条热门评论
        },
        {
          title: '最新评论',
          data: this.playlistComment.comments
        }
      ]
    },

    desControl () { // 描述内容展开按钮
      return this.desControlStatus ? '收起' : '展开'
    },

    bannerData() { // banner数据
      if (this.albumDetailData) {
        return {
          name: this.albumDetailData.name,
          picUrl: this.albumDetailData.coverImgUrl,
          artists: {
            name: this.albumDetailData.creator.nickname,
            picUrl: this.albumDetailData.creator.avatarUrl
          }
        }
      }
    },

    songListData () { // 歌曲列表数据
      if (this.albumDetailData) {
        return this.albumDetailData.tracks.map(item => {
          return {
            name: item.name,
            album: {
              name: item.album.name,
              blurPicUrl: item.album.blurPicUrl
            },
            artists: item.artists,
            id: item.id
          }
        })
      }
    },

    ...mapState([
      'musicContentHeight'
    ])
  },

  mounted () {
    this.playlistDetailGet()
  },

  methods: {
    async playlistDetailGet () { // 歌单详情获取
      try {
        let res = await playlistDetail(this.$route.query.id)
        this.albumDetailData = res.result
        await this.playlistCommentGet()
        // console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    },

    async playlistCommentGet () { // 歌单评论获取
      try {
        let res = await playlistComment(this.albumDetailData.id, this.limit, this.offset)
        this.playlistComment = res
      } catch (e) {
        throw new Error(e)
      }
    },

    unfold () { // 展开收起
      if (this.desControlStatus) {
        this.desHeight = '.4rem'
        this.desControlStatus = false
      } else {
        this.desHeight = 'auto'
        this.desControlStatus = true
      }
    },

    headerBarHeightGet (h) { // headerBar高度获取
      this.albumDetailHeigh = this.musicContentHeight - h
    }
  }
}
</script>

<style lang="scss" scoped>
  .albumDetail {
    overflow: auto;
    .playCount {
      font-size: .12rem;
      top: .05rem;
      right: .05rem;
      position: absolute;
      color: #fff;
      text-shadow: 2px 2px 4px #000;
    }
    .tag {
      display: flex;
      padding: .1rem .05rem;
      align-items: center;
      .title {
        font-size: .15rem;
        color: #3f3f3f;
      }
      .ulTag {
        display: flex;
        .liTag {
          font-size: .14rem;
          color: #505050;
          margin-left: .2rem;
        }
      }
    }
    .description {
      padding: 0 .05rem;
      display: flex;
      flex-direction: column;
      .desText {
        font-size: .14rem;
        color: #4d4d4d;
        overflow: hidden;
      }
      .arrows {
        font-size: .12rem;
        color: #10a1bb;
        align-self: flex-end;
      }
    }
    .comment {
      //
    }
  }
</style>

