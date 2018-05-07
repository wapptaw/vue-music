<template>
  <v-touch
    tag="div"
    class="banner"
    :pan-options="{threshold: 50}"
    @swipeleft="slideLeft"
    @swiperight="slideRight"
    @panstart="dragStart"
    @panmove="dragMove"
    @panend="dragEnd">
    <ul
      class="ulBanner"
      :style="{transform: `translateX(${move})`, transition: `transform ${transitionDruation}s ease`}"
       @transitionend="bannerSwitch">
      <li
        v-for="(item, index) in bannerShowData"
        :key="index"
        class="liBanner">
        <a :href="item.url || 'javascript:;'" class="aBanner">
          <img :src="item.pic" :alt="item.typeTitle" class="imgBanner">
        </a>
        <span
          class="typeTitle"
          :style="{'background-color': item.titleColor}">{{item.typeTitle}}</span>
      </li>
    </ul>
    <ul class="ulBannerMark">
      <li
        v-for="item in bannerData.length"
        :key="item"
        class="bannerMark"
        :class="{bannerSelected: item === index + 1}"></li>
    </ul>
  </v-touch>
</template>

<script>
export default {
  name: 'SlideBanner',

  props: {
    bannerData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      screenWidth: 0, // 视口宽度
      index: 0, // 展示栏序号
      slideDirection: 1, // 滑动方向
      moveIndex: 0, // 偏移序号
      transitionDruation: .3, // 过渡时间
      moveType: 'swiper', // 取值方式判断
      deltaX: 0, // 拖动的距离
      switchAble: true // 是否切换banner
    }
  },

  computed: {
    bannerShowData () { // 展示栏数据
      let len = this.bannerData.length
      if (len > 0) {
        return [this.bannerData[this.index - 1 < 0 ? len - 1 : this.index - 1], this.bannerData[this.index], this.bannerData[this.index + 1 > len - 1 ? 0 : this.index + 1]]
      }
      // 可以加一个默认页面
    },

    move () {
      switch (this.moveType) { // 拖动和轻拂分别获取值
        case 'swiper':
          return (this.moveIndex - 1) * this.screenWidth + 'px'
          break
        case 'pan':
          return this.deltaX + 'px'
          break
      }
    }
  },

  mounted () {
    this.screenWidthGet()
    this.deltaX = -this.screenWidth // 赋予deltaX初始值
    this.slideAuto()
  },

  methods: {
    screenWidthGet () { // 视口宽度获取
      this.screenWidth = document.documentElement.clientWidth
    },

    bannerSwitch () { // 动画结束后更新index
      if (this.switchAble) {
        if (this.slideDirection < 0) {
          if (this.index < this.bannerData.length - 1) {
            this.index++
          } else {
            this.index = 0
          }
        } else {
          if (this.index > 0) {
            this.index--
          } else {
            this.index = this.bannerData.length - 1
          }
        }
      }
      this.transitionDruation = 0
      this.moveIndex = 0
    },

    slideLeft () { // 左滑
      this.switchAble = true
      this.moveType = 'swiper'
      if (this.moveIndex > -1) {
        this.moveIndex--
      }
      this.slideDirection = -1
      this.transitionDruation = .3
    },

    slideRight () { // 右滑
      this.switchAble = true
      this.moveType = 'swiper'
      if (this.moveIndex < 1) {
        this.moveIndex++
      }
      this.slideDirection = 1
      this.transitionDruation = .3
    },

    dragStart (e) { // 开始拖动
      this.moveType = 'pan'
      this.switchAble = true
    },

    dragMove (e) { // 拖动中
      this.transitionDruation = 0
      this.deltaX = -this.screenWidth + e.deltaX + 50 // 拖动阈值是50
    },

    dragEnd (e) { // 拖动结束
      if (Math.abs(this.deltaX) < this.screenWidth * 0.4) {
        this.slideRight()
      } else if (Math.abs(this.deltaX) > this.screenWidth * 1.6) {
        this.slideLeft()
      } else {
        this.switchAble = false
        this.transitionDruation = .3
        this.moveType = 'swiper'
      }
      this.deltaX = -this.screenWidth // 拖动结束后归位
    },

    slideAuto () { // 自动滑动
      setInterval (this.slideLeft, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    overflow: hidden;
    position: relative;
    .ulBanner {
      display: flex;
      .liBanner {
        width: 100%;
        flex-shrink: 0;
        position: relative;
        .aBanner {
          display: block;
          text-align: center;
          .imgBanner {
            width: 100%;
            vertical-align: middle;
          }
        }
        .typeTitle {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: .12rem;
          color: #fff;
          opacity: .8;
          padding: 0 .05rem;
          line-height: 1.6em;
          border-radius: 3px 0 0 0;
        }
      }
    }
    .ulBannerMark {
      display: flex;
      justify-content: center;
      position: absolute;
      left: 50%;
      bottom: 5%;
      transform: translateX(-50%);
      .bannerMark {
        width: .05rem;
        height: .05rem;
        margin: 0 .05rem;
        border-radius: 3px;
        background-color: transparent;
        border: 1px solid #f34f4f;
      }
      .bannerSelected {
        box-shadow: 0 0 .1rem #f15f5f;
        background-color: rgba(238, 75, 75, 0.7);
      }
    }
  }
</style>

