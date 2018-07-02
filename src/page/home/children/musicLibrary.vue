<template>
  <section
    class="musicLibrary">
    <slide-banner :bannerData="bannerData"></slide-banner>
    <nav class="musicNav">
      <router-link
        v-for="(item, index) in musicNav"
        :key="index"
        :to="{name: item.route}"
        event="touchend"
        tag="div"
        class="musicNavItem">
        <div class="musicNavItemLogo">{{item.logo}}</div>
        <h3 class="musicNavItemTitle">{{item.title}}</h3>
      </router-link>
    </nav>
    <section
      v-for="(musicModule, moduleIndex) in musicModuleData"
      :key="moduleIndex"
      :class="musicModule.className"
      class="musicModule">
      <header class="moduleHeader">
        <v-touch
          tag="h3"
          class="moduleTitle"
          @tap="morelist(musicModule)">{{musicModule.title}}</v-touch>
        <span
          v-if="musicModule.data.length > 6"
          class="arrows">&gt;</span>
      </header>
      <ul class="ulMusicModuleDetail">
        <v-touch
          v-for="(item, itemIndex) in musicModule.data.slice(0, 6)"
          :key="itemIndex"
          class="liMusicModuleDetail"
          tag="li"
          @tap="link(musicModule.className, item)">
          <img v-if="item.picUrl || item.song.album.picUrl" :src="item.picUrl || item.song.album.picUrl" class="moduleItemImg">
          <section class="moduleItemText">
            <span
              v-if="item.videoId"
              class="sourceType">{{item | sourceType}}</span>
            <span class="moduleItemName">{{item.name}}</span>
            <p v-if="item.song" class="singer">{{item.song.artists | joinArtists}}-{{item.song.album.name}}</p>
            <div v-if="item.song" class="play"></div>
          </section>
          <span
            v-if="item.playCount"
            class="playCount">{{item.playCount | countSwitch}}</span>
        </v-touch>
      </ul>
    </section>
  </section>
</template>

<script>
import {banner, personalizedAlbum, privateContent, personalizedSong, personalizedDj, personalizedMV} from '../../../api/getData'
import {mapMutations, mapState} from 'vuex'
import {countSwitchMixin, joinArtistsMixin} from '../../../components/mixin/mixin'

export default {
  name: 'musicLibrary',

  components: {
    SlideBanner: () => import('../../../components/common/SlideBanner')
  },

  mixins: [countSwitchMixin, joinArtistsMixin],

  filters: {
    sourceType (type) { // 资源类型
      if (type.videoId) {
        return '视频'
      }
    }
  },

  data () {
    return {
      bannerData: [],
      musicNav: [ // 导航内容
        {
          title: '私人FM',
          logo: 'FM',
          route: ''
        },
        {
          title: '每日推荐',
          logo: '推',
          route: ''
        },
        {
          title: '歌单',
          logo: '单',
          route: ''
        },
        {
          title: '排行榜',
          logo: '榜',
          route: 'rankinglist'
        }
      ],
      musicModuleData: [],  // 各个音乐模块内容
    }
  },

  computed: {
    ...mapState([
      'playerList'
    ])
  },

  mounted () {
    this.bannerGet() // 轮播图
    this.personalizedAlbumGet() // 歌单
    this.privateContentGet() // 独家
    this.personalizedSong() // 歌曲
    this.personalizedDjGet() // 电台
    this.personalizedMVGet() // MV
  },

  methods: {
    async bannerGet () { // 获取顶部海报数据
      try {
        let res = await banner()
        this.bannerData = res.banners
      } catch (e) {
        throw new Error(e)
      }
    },
    
    async personalizedAlbumGet () { // 推荐歌单
      try {
        let res = await personalizedAlbum()
        this.musicModuleData.push({
          title: '推荐歌单',
          data: res.result,
          className: 'personalizedAlbum'
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    async privateContentGet () { // 独家放送
      try {
        let res = await privateContent()
        let data = res.result
        data.push(data[0])
        data.shift()
        this.musicModuleData.push({
          title: '独家放送',
          data,
          className: 'privateContent'
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    async personalizedSong () { // 推荐新音乐
      try {
        let res = await personalizedSong()
        this.musicModuleData.push({
          title: '最新音乐',
          data: res.result,
          className: 'personalizedSong'
        })
        let playerList = res.result.map((v) => {
          return {
            id: v.id,
            name: v.name,
            artists: v.song.artists,
            picUrl: v.song.album.blurPicUrl,
            musicLike: v.song.canDislike
          }
        })
        this.playerList.length === 0 && this.playerListSave(playerList)
      } catch (e) {
        throw new Error(e)
      }
    },

    async personalizedDjGet () { // 推荐电台
      try {
        let res = await personalizedDj()
        this.musicModuleData.push({
          title: '主播电台',
          data: res.result,
          className: 'personalizedDj'
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    async personalizedMVGet () { // 推荐mv
      try {
        let res = await personalizedMV()
        this.musicModuleData.push({
          title: '推荐MV',
          data: res.result,
          className: 'personalizedMV'
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    morelist (musicModule) { // 更多
      if (musicModule.data.length > 6) {
        this.moreListSave(musicModule)
        switch (musicModule.className) {
          case 'personalizedAlbum':
            this.$router.push({name: 'playlist'})
            break
          // 更多模块
        }
      }
    },

    link (className, item) { // 跳转
      if (className === 'personalizedAlbum') { // 推荐歌单
        this.$router.push({name: 'playlistdetail', query: {
          id: item.id
        }})
      } else if (className === 'privateContent') { // 独家放送
        //
      } else if (className === 'personalizedSong') { // 推荐新音乐
        //
      } else if (className === 'personalizedDj') { // 主播电台
        this.djContentSave(item)
        this.$router.push({name: 'djDetail', query: {
          id: item.program.userId
        }})
      } else if (className === 'personalizedMV') { // 推荐MV
        //
      }
    },

    ...mapMutations([
      'playerListSave',
      'moreListSave',
      'djContentSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .musicLibrary {
    overflow: auto;
    .musicNav {
      display: flex;
      justify-content: space-around;
      padding: .15rem 0 .06rem 0;
      border-bottom: 1px solid #e0e0e0;
      background-color: #f0f0f0;
      .musicNavItem {
        width: 25%;
        .musicNavItemLogo {
          width: 50%;
          height: 0;
          padding: 25% 0;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          border: 1px solid #eb3838;
          font-size: .16rem;
          color: #eb3838;
          font-weight: bold;
          background-color: #fff;
        }
        .musicNavItemTitle {
          text-align: center;
          font-size: .12rem;
          color: #4e4e4e;
          margin-top: .05rem;
        }
      }
    }
    .musicModule {
      padding: .05rem;
      background-color: #f0f0f0;
      .moduleHeader {
        display: flex;
        align-items: center;
        line-height: .3rem;
        .moduleTitle {
          font-size: .14rem;
          color: #3f3f3f;
          font-weight: bold;
        }
        .arrows {
          transform: scale(1, 2);
          font-size: .12rem;
          margin-left: .05rem;
          color: #9c9c9c;
          font-weight: lighter;
        }
      }
      .ulMusicModuleDetail {
        display: flex;
        flex-wrap: wrap;
        .liMusicModuleDetail {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          .moduleItemImg {
            border-radius: 3px;
          }
          .moduleItemText {
            margin: .05rem 0 .1rem 0;
            .sourceType {
              font-size: .12rem;
              border: 1px solid #fc5050;
              color: #fd5d5d;
              border-radius: 2px;
            }
            .moduleItemName {
              font-size: .12rem;
            }
          }
        }
      }
    }
    .personalizedAlbum, .personalizedDj {
      .ulMusicModuleDetail {
        .liMusicModuleDetail {
          flex: auto;
          .moduleItemImg {
            width: 31.5vw;
          }
          .moduleItemText {
            width: 31.5vw;
          }
          .playCount {
            position: absolute;
            top: 2px;
            right: .05rem;
            font-size: .12rem;
            color: #ebebeb;
            font-weight: lighter;
          }
        }
      }
    }
    .privateContent {
      .ulMusicModuleDetail {
        .liMusicModuleDetail {
          overflow: hidden;
          flex: 45vw 1 1;
          margin: 0 2px;
          border-radius: 3px;
          .moduleItemImg {
            width: 80vw;
          }
          .moduleItemText {
            width: 100%;
          }
        }
        li:nth-last-of-type(1) {
          flex: 100vw 1 1;
          .moduleItemImg {
            width: 100vw;
          }
          .moduleItemName {
            width: 95vw;
          }
        }
      }
    }
    .personalizedSong {
      .ulMusicModuleDetail {
        flex-direction: column;
        align-items: flex-start;
        .liMusicModuleDetail {
          flex-direction: row;
          margin: .05rem 0;
          width: 100%;
          position: relative;
          .moduleItemImg {
            height: .4rem;
            border-radius: 2px;
          }
          .moduleItemText {
            margin: 0;
            margin-left: .05rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: .4rem;
            .moduleItemName {
              font-size: .14rem;
              color: #3d3d3d;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 70vw;
            }
            .singer {
              font-size: .12rem;
              color: #a1a1a1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 70vw;
            }
            .play {
              height: .2rem;
              width: .2rem;
              border-radius: .2rem;
              border: 2px solid #adadad;
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              margin: auto;
              &::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                right: .05rem;
                top: 0;
                bottom: 0;
                margin: auto;
                border-top: .06rem solid transparent;
                border-bottom: .06rem solid transparent;
                border-left: .08rem solid #949494;
              }
            }
          }
        }
      }
    }
    .personalizedMV {
      .ulMusicModuleDetail {
        .liMusicModuleDetail {
          flex: 45vw 1 1;
          margin: 0 2px;
          .moduleItemImg {
            width: 100%;
          }
          .moduleItemText {
            width: 100%;
            .moduleItemName {
              font-size: .13rem;
            }
          }
          .playCount {
            font-size: .12rem;
            color: #f0f0f0;
            position: absolute;
            top: .05rem;
            right: .05rem;
          }
        }
      }
    }
  }
</style>

