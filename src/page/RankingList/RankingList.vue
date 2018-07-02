<template>
  <div>
    <header-bar title="排行榜" @heightGet="headerBarHeightGet"></header-bar>
    <div :style="{height: rankingListHeight + 'px', overflow: 'auto'}">
      <section
        v-for="(item, index) in rankingListData"
        :key="index"
        class="rankingList"
        :class="item.className">
        <h3 class="rankingTitle">{{item.rankingListName}}</h3>
        <ul class="rankingListItem">
          <router-link
            v-for="(list, listIndex) in item.rankingList"
            :to="{name: 'rankinglistdetail', query: {title: list.detailData && list.detailData.playlist.name, idx: list.idx}}"
            tag="li"
            :key="listIndex"
            class="liRankingListItem">
            <img :src="list.detailData && list.detailData.playlist.coverImgUrl" class="liRankingListItemImg">
            <ul v-if="item.className === 'authority'" class="ulAuthority">
              <li
                v-for="(song, songIndex) in list.detailData && list.detailData.playlist.tracks.slice(0, 3)"
                :key="songIndex"
                class="liAuthority">
                <span>{{songIndex}}.</span>
                <span>{{song.name}}</span>
                <span>- {{song.ar | joinArtists}}</span>
              </li>
            </ul>
            <p v-if="item.className === 'global'" class="glonalTitle">{{list.detailData && list.detailData.playlist.name}}</p>
            <p v-if="item.className === 'others'" class="othersTitle">{{list.detailData && list.detailData.playlist.name}}</p>
          </router-link>
        </ul>
      </section>
    </div>
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {listTop} from '../../api/getData'
import {mapState, mapMutations} from 'vuex'
import {joinArtistsMixin} from '../../components/mixin/mixin'

export default {
  name: 'RankingList',

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar')
  },

  mixins: [joinArtistsMixin],

  data () {
    return {
      rankingListData: [
        {
          rankingListName: '官方榜',
          className: 'authority',
          rankingList: [
            {
              idx: 0,
              detailData: ''
            },
            {
              idx: 1,
              detailData: ''
            },
            {
              idx: 2,
              detailData: ''
            },
            {
              idx: 3,
              detailData: ''
            },
            {
              idx: 4,
              detailData: ''
            },
            {
              idx: 22,
              detailData: ''
            },
            {
              idx: 23,
              detailData: ''
            }
          ]
        },
        {
          rankingListName: '全球榜',
          className: 'global',
          rankingList: [
            {
              idx: 5,
              detailData: ''
            },
            {
              idx: 6,
              detailData: ''
            },
            {
              idx: 10,
              detailData: ''
            },
            {
              idx: 11,
              detailData: ''
            },
            {
              idx: 12,
              detailData: ''
            },
            {
              idx: 13,
              detailData: ''
            },
            {
              idx: 14,
              detailData: ''
            },
            {
            idx: 15,
            detailData: ''
            },
            {
              idx: 16,
              detailData: ''
            },
            {
              idx: 17,
              detailData: ''
            },
            {
              idx: 18,
              detailData: ''
            },
            {
              idx: 19,
              detailData: ''
            },
            {
              idx: 20,
              detailData: ''
            },
            {
              idx: 21,
              detailData: ''
            },
          ]
        },
        {
          rankingListName: '其他榜',
          className: 'others',
          rankingList: [
            {
              idx: 7,
              detailData: ''
            },
            {
              idx: 8,
              detailData: ''
            },
            {
              idx: 9,
              detailData: ''
            },
          ]
        }
      ],
      headerBarHeight: 0
    }
  },

  computed: {
    rankingListHeight () { // 列表高度
      return this.musicContentHeight - this.headerBarHeight
    },

    ...mapState([
      'musicContentHeight'
    ])
  },

  mounted () {
    this.rankingListDetailGet()
    this.headerBarHeightGet()
  },

  methods: {
    async rankingListDetailGet () { // 排行榜详情数据获取
      try {
        for (let v of this.rankingListData) {
          for (let list of v.rankingList) {
            let res = await listTop(list.idx)
            list.detailData = res
            this.rankingListDetailSave({
              idx: list.idx,
              data: res
            })
          }
        }
        
      } catch (e) {
        throw new Error(e)
      }
    },

    headerBarHeightGet (h) { // 获取高度
      this.headerBarHeight = h
    },

    ...mapMutations([
      'rankingListDetailSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .rankingList {
    padding: 0 .05rem;
    .rankingTitle {
      font-size: .16rem;
      font-weight: bold;
      margin: .1rem 0 .05rem 0;
    }
    .rankingListItem {
      .liRankingListItem {
        .liRankingListItemImg {
          border-radius: 3px;
        }
      }
    }
  }
  .authority {
    .rankingListItem {
      .liRankingListItem {
        display: flex;
        margin: .1rem 0;
        .liRankingListItemImg {
          width: 40%;
          height: 100%;
        }
        .ulAuthority {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: .1rem;
          .liAuthority {
            span {
              font-size: .14rem;
              color: #5f5f5f;
            }
          }
        }
      }
    }
  }
  .global {
    .rankingListItem {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .liRankingListItem {
        width: 32%;
        flex: auto 0 1;
        margin: .05rem 2px;
        .liRankingListItemImg {
          width: 100%;
        }
        .glonalTitle {
          font-size: .14rem;
          color: #5f5f5f;
        }
      }
    }
  }
  .others {
    .rankingListItem {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .liRankingListItem {
        width: 48%;
        flex: auto 0 1;
        margin: .05rem 2px;
        .liRankingListItemImg {
          width: 100%;
        }
        .othersTitle {
          font-size: .14rem;
          color: #5f5f5f;
        }
      }
    }
  }
</style>

