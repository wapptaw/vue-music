<template>
  <header class="headerBar">
    {{title}}
    <v-touch
      tag="span"
      class="backBar"
      @tap="back">&lt;</v-touch>
  </header>
</template>

<script>
export default {
  name: 'headerBar',

  props: {
    title: {
      type: String,
      default: '标题'
    }
  },

  mounted () {
    this.heightGet()
  },

  methods: {
    back () { // 返回
      this.$router.go(-1)
    },

    heightGet () { // 高度获取
      this.$emit('heightGet', 45)
    }
  }
}
</script>

<style lang="scss" scoped>
  .headerBar {
    font-size: .14rem;
    color: #fff;
    text-align: center;
    background-color: #f72525;
    position: relative;
    height: .45rem;
    line-height: .45rem;
    overflow: hidden;
    .backBar {
      display: flex;;
      transform: scale(1, 2);
      color: #fff;
      background-color: #ff5e5e;
      position: absolute;
      left: 0;
      top: 0;
      justify-content: center;
      align-items: center;
      width: .5rem;
    }
  }
</style>

