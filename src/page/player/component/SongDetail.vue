<template>
  <div class="songDetail">
    <h3 class="title" ref="title">歌曲详情</h3>
    <section class="content">没想好这里放什么，以后再写</section>
  </div>
</template>

<script>
import {musicDetail} from '../../../api/getData'

export default {
  name: 'SongDetail',

  props: {
    songId: {
      type: [String, Number],
      default: 1000
    }
  },

  data () {
    return {
      musicDetailData: null
    }
  },

  mounted () {
    this.musicDetailDataGet()
  },

  methods: {
    async musicDetailDataGet () { // 歌曲详情获取
      try {
        let res = await musicDetail(this.songId)
        this.musicDetailData = res
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .songDetail {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-radius: .05rem .05rem 0 0;
    .title {
      font-size: .16rem;
      color: #3f3f3f;
      padding-left: .05rem;
      padding: .1rem;
      background-color: #e7e7e7;
      border-radius: .05rem .05rem 0 0;
    }
  }
</style>

