<template>
  <div>
    <header-bar title="推荐歌单" @heightGet="headerBarHeightGet"></header-bar>
    <section class="morelist" :style="{height: morelistHeight + 'px'}">
      <ul class="ulMorelist">
        <v-touch
          v-for="(item, index) in morelist.data"
          :key="index"
          tag="li"
          class="liMorelist"
          @tap="linkPlaylist(item.id)">
          <section class="morelistLeft">
            <img :src="item.picUrl" class="icon">
          </section>
          <section class="morelistRight">
            <p class="copywriter">{{item.copywriter}}</p>
            <p class="name">{{item.name}}</p>
          </section>
        </v-touch>
      </ul>
    </section>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'playlist',

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar')
  },

  data () {
    return {
      headerBarHeight: 0  
    }
  },

  computed: {
    morelistHeight () {
      return this.musicContentHeight - this.headerBarHeight
    },

    ...mapState([
      'morelist',
      'musicContentHeight'
    ])
  },

  methods: {
    headerBarHeightGet (h) {
      this.headerBarHeight = h
    },

    linkPlaylist (id) { // 链接歌单详情
      this.$router.push({name: 'playlistdetail', query: {
        id
      }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .morelist {
    overflow: auto;
    .ulMorelist {
      .liMorelist {
        display: flex;
        padding: 0 .05rem;
        margin: .1rem 0;
        .morelistLeft {
          width: 30%;
          .icon {
            width: 100%;
            border-radius: .05rem;
          }
        }
        .morelistRight {
          width: 70%;
          margin-left: .1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .copywriter {
            font-size: .14rem;
            color: #696969;
          }
          .name {
            font-size: .15rem;
            color: #424242;
          }
        }
      }
    }
  }
</style>

