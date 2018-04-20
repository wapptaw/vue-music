<template>
  <div>
    <header class="nav">
      <ul class="ulNav">
        <li
          v-for="(item, index) in navData"
          :key="index"
          class="liNav">{{item.title}}</li>
      </ul>
    </header>
    <section></section>
  </div>
</template>

<script>
import {search} from '../../api/api'

export default {
  name: 'home',

  data () {
    return {
      navData: [
        {
          title: '歌单'
        },
        {
          title: '我的'
        }
      ]
    }
  },

  mounted () {
    this.test()
  },

  methods: {
    async test () {
      let res = await search()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav {
    .ulNav {
      .liNav {
        font-size: .2rem;
      }
    }
  }
</style>

