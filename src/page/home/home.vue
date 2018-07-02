<template>
  <div>
    <header class="nav" ref="nav">
      <ul class="ulNav">
        <router-link
          v-for="(item, index) in navData"
          :to="{name: item.key}"
          tag="li"
          event="touchend"
          :key="index"
          class="liNav"
          :class="{selected: item.key === $route.name}">{{item.title}}</router-link>
      </ul>
      <v-touch
        tag="div" class="search"
        @tap="search">搜索</v-touch>
    </header>
    <transition name="fade" mode="out-in">
      <router-view :style="{height: musicLibraryHeight + 'px'}"></router-view>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'home',

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
      musicLibraryHeight: 0 // 内容区高度
    }
  },

  computed: {
    ...mapState([
      'musicContentHeight'
    ])
  },

  mounted () {
    this.musicLibraryHeightGet()
  },

  methods: {
    musicLibraryHeightGet () { // 高度计算
      var timer = setInterval(() => {
        var navHeight = this.$refs.nav.offsetHeight
        if (navHeight > 0) {
          this.musicLibraryHeight = this.musicContentHeight - navHeight
          clearInterval(timer)
        }
      }, 200)
      
    },

    search () { // 搜索
      this.$router.push({name: 'search'})
    }
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
    .search {
      font-size: .14rem;
      color: #38c6f1;
      margin-right: .1rem;
    }
  }
</style>
