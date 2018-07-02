<template>
  <section>
    <ul>
      <li>
        
      </li>
    </ul>
  </section>
</template>

<script>
import {recommendAlbum, recommendSongs} from '../../api/getData'

export default {
  name: 'daily',

  methods: {
    async recommendAlbumGet () { // 推荐歌单
      try {
        let res = await recommendAlbum()
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    },

    async recommendSongsGet () { // 推荐歌曲
      try {
        let res = await recommendSongs()
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

