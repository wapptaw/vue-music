<template>
  <div>
    <router-view></router-view>
    <footer>
      <section>
        <img :src="musicIcon" alt="">
        <section>
          <h4></h4>
          <div>
            <span></span>
            <span></span>
          </div>
        </section>
      </section>
      <section>
        <div></div>
        <div></div>
        <div></div>
      </section>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'playerBase',

  data () {
    return {
      musicIcon: '../images/default.png'
    }
  },

  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>

