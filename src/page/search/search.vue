<template>
  <div>
    <header-bar title="搜索" @heightGet="headerBarHeightGet"></header-bar>
    <section class="search" ref="search">
      <input v-model="searchKey" type="text" class="searchBox" @input="suggestDataGet">
      <section v-if="suggestBox" class="suggest">
        <ul class="ulSuggest">
          <v-touch
            tag="li"
            class="liSuggest suggestFirst"
            @tap="searchDataGet">{{`搜索${searchKey}`}}</v-touch>
          <v-touch
            v-for="(item, index) in suggestData"
            :key="index"
            tag="li"
            class="liSuggest"
            @tap="searchSuggent(item.name)">
            <span class="suggestType" :style="{backgroundColor: suggestType(item.type).color}">{{suggestType(item.type).text}}</span>
            <span class="suggestName">{{item.name}}</span>
          </v-touch>
        </ul>
      </section>
    </section>
    <section class="main" :style="{height: mainHeight + 'px'}">
      <section
        v-if="searchKey === ''"
        class="searchHot">
        <h3 class="searchHotTitle">热搜</h3>
        <ul class="ulSearchHot">
          <v-touch
            v-for="(item, index) in searchHotData"
            :key="index"
            tag="li"
            class="liSearchHot"
            @tap="searchHotLink(item.first)">{{item.first}}</v-touch>
        </ul>
      </section>
      <ul v-else class="ulSearchList">
        <v-touch
          v-for="(item, index) in searchData && searchData.songs"
          :key="index"
          tag="li"
          class="liSearchList"
          @tap="musicLink(item)">
          <span class="songName">{{item.name}}</span>
          <span class="line">-</span>
          <span class="artists">{{item.artists | joinArtists}}</span>
        </v-touch>
      </ul>
    </section>
  </div>
</template>

<script>
import {search, searchHot, suggest, multimatch} from '../../api/getData'
import {joinArtistsMixin} from '../../components/mixin/mixin'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'search',

  mixins: [joinArtistsMixin],

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar.vue')
  },

  data () {
    return {
      searchKey: '', // 搜索关键词
      searchData: null, // 搜索数据
      searchHotData: null, // 热搜数据
      searchOffset: 0, // 搜索偏移
      suggestOffset: 0, // 搜索建议偏移
      suggestData: [], // 匹配数据
      headerBarHeight: 0, // 返回条高度
      mainHeight: 0, // 列表高度
      inputOnoff: true, // 防止输入事件过快
      suggestBox: false
    }
  },

  computed: {
    ...mapState([
      'musicContentHeight'
    ])
  },

  mounted () {
    this.mainHeightGet()
    this.searchHot()
  },

  methods: {
    async searchDataGet () { // 搜索
      try {
        let res = await search(this.searchKey, 30, this.searchOffset)
        this.searchData = res.result
        console.log(res)
        this.suggestBox = false
      } catch (e) {
        throw new Error(e)
      }
    },

    async searchHot () { // 热搜
      try {
        let res = await searchHot()
        this.searchHotData = res.result.hots
      } catch (e) {
        throw new Error(e)
      }
    },

    async searchHotLink (value) { // 热搜数据获取
      try {
        this.searchKey = value
        await this.searchDataGet()
      } catch (e) {
        throw new Error(e)
      }
    },

    async suggestDataGet () { // 搜索建议
      try {
        if (this.inputOnoff) {
          this.inputOnoff = false
          let res = await suggest(this.searchKey, 30, this.suggestOffset)
          if (res.code === 200 && Object.keys(res.result).length > 0) {
            let data = res.result
            let result = []
            data.order.forEach(item => {
              data[item].forEach(v => {
                v.type = item
              })
              result = result.concat(data[item])
            })
            this.suggestData = result
          } else {
            this.suggestData = []
          }
          if (this.searchKey) {
            this.suggestBox = true
          } else {
            this.suggestBox = false
          }
          setTimeout(() => {
            this.inputOnoff = true
          }, 50)
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async searchSuggent (item) {
      try {
        this.searchKey = item
        this.searchDataGet()
        this.suggestBox = false
      } catch (e) {
        throw new Error(e)
      }
    },

    async multimatchDataGet () {
      //
    },

    headerBarHeightGet (h) { // 内容高度获取
      this.headerBarHeight = h
    },

    mainHeightGet () { // 主体高度获取
      let timer = setInterval(() => {
        if (this.headerBarHeight > 0) {
          this.mainHeight = this.musicContentHeight - this.headerBarHeight - this.$refs.search.offsetHeight
          clearInterval(timer)
        }
      }, 50)
    },
    suggestType (type) { // 搜索建议类型
      switch (type) {
        case 'songs':
          return {
            text: '歌曲',
            color: '#f74949'
          }
          break
        case 'playlists':
          return {
            text: '歌单',
            color: '#5fec5f'
          }
          break
        case 'mvs':
          return {
            text: 'MV',
            color: '#d7ee56'
          }
          break
        case 'albums':
          return {
            text: '专辑',
            color: '#3dc1e2'
          }
          break
        case 'artists':
          return {
            text: '歌手',
            color: '#d16ae6'
          }
          break
        default:
          return {
            text: '其它',
            color: '#b9b9b9'
          }
          break
      }
    },
    musicLink (item) { // 搜索跳转
      this.playerListSave([{
        artists: item.artists,
        id: item.id,
        name: item.name,
        picUrl: item.picUrl || item.album.artist.img1v1Url,
        musicLike: false
      }]),
      this.playIndexSave(0)
    },

    ...mapMutations([
      'playerListSave',
      'playIndexSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .search {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    input {
      width: 95%;
      height: .4rem;
      border-radius: 5px;
      font-size: .14rem;
      margin: .05rem 0;
      box-sizing: border-box;
    }
    .searchBox {
      border: 1px solid #9e9e9e;
      color: #464646;
      padding: 0 .05rem;
    }
    .searchButton {
      background-color: #43d7eb;
      color: #fff;
    }
    .suggest {
      position: absolute;
      width: 94%;
      left: 3%;
      top: .45rem;
      background-color: #fff;
      border: 1px solid #dadada;
      box-sizing: border-box;
      border-radius: 5px;
      .ulSuggest {
        .suggestFirst {
          font-size: .14rem;
          color: #3b3b3b;
        }
        .liSuggest {
          padding: 0 .05rem;
          height: .3rem;
          line-height: .3rem;
          border-bottom: 1px solid #ebebeb;
          .suggestType {
            font-size: .12rem;
            color: #ffffff;
            padding: 2px;
            border-radius: 3px;
          }
          .suggestName {
            font-size: .13rem;
            color: #3b3b3b;
          }
        }
      }
    }
  }
  .main {
    overflow: auto;
    .searchHot {
      .searchHotTitle {
        font-size: .15rem;
        padding-left: .1rem;
        color: #686868;
        line-height: .3rem;
      }
      .ulSearchHot {
        display: flex;
        flex-wrap: wrap;
        .liSearchHot {
          font-size: .15rem;
          white-space: nowrap;
          flex: auto;
          margin: .05rem .1rem;
          height: .3rem;
          line-height: .3rem;
          text-align: center;
          border-radius: .1rem;
          color: #414141;
          border: 1px solid #414141;
        }
      }
    }
    .ulSearchList {
      background-color: #e7e7e7;
      .liSearchList {
        padding: 0 .1rem;
        background-color: #fff;
        margin: 1px 0;
        span {
          font-size: .14rem;
          color: #494949;
          line-height: .3rem;
        }
        .songName {
          //
        }
        .line {
          //
        }
        .artists {
          //
        }
      }
    }
  }
</style>
