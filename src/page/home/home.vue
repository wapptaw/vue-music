<template>
  <div>
    <header class="nav" ref="nav">
      <ul class="ulNav">
        <v-touch
          tag="li"
          v-for="(item, index) in navData"
          :key="index"
          class="liNav"
          :class="{selected: item.key === pageKey}"
          @tap="pageSelect(index)">{{item.title}}</v-touch>
      </ul>
    </header>
    <!-- <section
      v-if="pageKey === 'musicLibrary'"
      class="musicLibrary"
      :style="{height: musicLibraryHeight + 'px'}">
      <slide-banner :bannerData="bannerData"></slide-banner>
      <nav class="musicNav">
        <router-link
          v-for="(item, index) in musicNav"
          :key="index"
          :to="item.route"
          event="touch"
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
          <h3 class="moduleTitle">{{musicModule.title}}</h3>
          <span
            v-if="musicModule.data.length >= 6"
            class="arrows">&gt;</span>
        </header>
        <ul class="ulMusicModuleDetail">
          <li
            v-for="(item, itemIndex) in musicModule.data"
            :key="itemIndex"
            class="liMusicModuleDetail">
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
          </li>
        </ul>
      </section>
    </section> -->
    <router-view></router-view>
  </div>
</template>

<script>
import {banner, personalizedAlbum, privateContent, personalizedSong, personalizedDj, personalizedMV} from '../../api/getData'
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'home',

  components: {
    SlideBanner: () => import('../../components/common/SlideBanner')
  },

  filters: {
    countSwitch (count) { // 播放次数转换
      if (count / 100000000 >= 1) {
        return Math.round(count / 100000000) + '亿'
      } else if (count / 10000 >= 1) {
        return Math.round(count / 10000) + '万'
      } else {
        return count
      }
    },

    sourceType (type) { // 资源类型
      if (type.videoId) {
        return '视频'
      }
    },

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
      navData: [
        {
          title: '乐库',
          key: 'musicLibrary'
        },
        {
          title: '我的',
          key: 'user'
        }
      ],
      pageKey: 'musicLibrary',
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
          route: ''
        }
      ],
      musicModuleData: [],  // 各个音乐模块内容
      musicLibraryHeight: 0 // 内容区高度
    }
  },

  computed: {
    ...mapState([
      'musicContentHeight'
    ])
  },

  watch: {
    musicContentHeight () { // 计算内容区高度
      this.musicLibraryHeightGet()
    }
  },

  mounted () {
    this.bannerGet() // 轮播图
    this.personalizedAlbumGet() // 歌单
    this.privateContentGet() // 独家
    this.personalizedSong() // 歌曲
    this.personalizedDjGet() // 电台
    this.personalizedMVGet()
  },

  methods: {
    musicLibraryHeightGet () { // 高度计算
      this.musicLibraryHeight = this.musicContentHeight - this.$refs.nav.offsetHeight
    },

    pageSelect (index) { // 选择page
      this.pageKey = this.navData[index].key
    },

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
          data: res.result.slice(0, 6),
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
        this.playerListSave(res.result)
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
        // console.log(res)
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
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    },

    ...mapMutations([
      'playerListSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .nav {
    height: .45rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #d6d6d6;
    .ulNav {
      display: flex;
      justify-content: space-around;
      width: 50%;
      height: 100%;
      .liNav {
        font-size: .18rem;
        color: #424242;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .selected {
        color: #e93e3e;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 3px;
          left: 0;
          bottom: -1px;
          background-color: #e93e3e;
        }
      }
    }
  }
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

