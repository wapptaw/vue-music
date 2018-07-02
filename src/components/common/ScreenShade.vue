<template>
  <transition name="fade">
    <v-touch
      v-if="shade"
      tag="div"
      class="shade"
      @tap="tapEvent"></v-touch>
  </transition>
</template>

<script>
export default {
  name: 'ScreenShade',

  props: {
    shade: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    tapEvent () { // 点击事件
      this.$emit('tapEvent')
    }
  }
}
</script>

<style lang="scss" scoped>
  .shade {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .5);
  }
</style>

