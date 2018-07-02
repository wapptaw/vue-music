<template>
  <section class="songList">
    <h4 class="songListTitle">歌曲列表</h4>
    <ul class="ulSongList">
      <v-touch
        v-for="(item, index) in songListData"
        :key="index"
        class="liSongList"
        :class="{selected: index === playIndex && songListInit}"
        @tap="playStart(index)">
        <section class="songListLeft">
          <div class="songImgBox">
            <img :src="item.album.blurPicUrl" class="songImg">
          </div>
          <div class="songDetail">
            <p class="songName">{{item.name}}</p>
            <div class="songMessage">
              <p class="album">{{item.album.name}}</p>
              <span>-</span>
              <p class="artists">{{item.artists| joinArtists}}</p>
            </div>
          </div>
        </section>
        <div></div>
      </v-touch>
    </ul>
  </section>
</template>

<script>
import {joinArtistsMixin} from '../mixin/mixin'
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'SongList',

  mixins: [joinArtistsMixin],

  props: {
    songListData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      songListInit: false // 歌曲列表初始化
    }
  },

  computed: {
    ...mapState([
      'playIndex'
    ])
  },

  methods: {
    playStart (index) { // 更改歌曲列表
      if (!this.songListInit) {
        this.playerListSave(this.songListData.map(item => {
          return {
            id: item.id,
            name: item.name,
            artists: item.artists,
            picUrl: item.album.blurPicUrl
          }
        }))
        this.songListInit = true
      }
      this.$nextTick(() => {
        this.playIndexSave(index)
      })
    },

    ...mapMutations([
      'playerListSave',
      'playIndexSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .songList {
    .songListTitle {
      font-size: .15rem;
      padding: .1rem .05rem;
      background-color: #dddddd;
    }
    .ulSongList {
      .liSongList {
        display: flex;
        justify-content: space-between;
        padding: .05rem;
        .songListLeft {
          display: flex;
          align-items: center;
          .songImgBox {
            width: 10%;
            flex: none;
            .songImg {
              width: 100%;
              border-radius: 2px;
            }
          }
          .songDetail {
            margin-left: .1rem;
            .songName {
              font-size: .14rem;
              color: #333333;
            }
            .songMessage {               
              display: flex;
              align-items: center;
              .album {
                font-size: .12rem;
                color: #616161;
              }
              .artists {
                font-size: .12rem;
                color: #616161;
              }
              span {
                margin: 0 .05rem;
                color: #616161;
              }
            }
          }
        }
      }
      .selected {
        background-color: #63ebe4;
      }
    }
  }
</style>

