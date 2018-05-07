<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  name: 'app',

  mounted () {
    // 创建一个Audio对象并保存
    let audio = new Audio()
    this.$store.commit('ObjectAudioSave', audio)
  }
}
</script>

<style lang="scss">
  @import './static/style/init.scss';
</style>

