<template>
  <header class="banner">
    <div
      class="bannerBg"
      :style="{backgroundImage: `url(${bannerData && bannerData.picUrl})`}"></div>
    <section class="bannerMain">
      <div class="bannerMainLeft">
        <img :src="bannerData && bannerData.picUrl" class="bannerMainLeftPic">
        <slot name="left"></slot>
      </div>
      <div class="bannerMainRight">
        <p class="name">{{bannerData && bannerData.name}}</p>
        <p class="artists">
          <img :src="bannerData && bannerData.artists.picUrl" class="artistsPic">
          <span class="name">{{bannerData && bannerData.artists.name}}</span>
        </p>
        <slot name="right"></slot>
      </div>
    </section>
  </header>
</template>

<script>
export default {
  name: 'BannerShow',

  props: {
    bannerData: {
      type: Object,
      default () {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner {
    width: 100vw;
    height: 50vw;
    position: relative;
    overflow: hidden;
    .bannerBg {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      filter: blur(20px);
      transform: scale(1.5);
      height: 100%;
      &::after {
        content: '';
        position: absolute;
        background-color: rgba(0, 0, 0, .25);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
    .bannerMain {
      display: flex;
      padding: 0 .05rem;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      height: 35vw;
      .bannerMainLeft {
        position: relative;
        .bannerMainLeftPic {
          width: 35vw;
          border-radius: 2px;
        }
      }
      .bannerMainRight {
        margin-left: .1rem;
        display: flex;
        flex-direction: column;
        .name {
          font-size: .15rem;
          color: #fff;
        }
        .artists {
          display: flex;
          align-items: center;
          margin-top: .2rem;
          .artistsPic {
            width: .3rem;
            border-radius: 50%;
          }
          .name {
            margin-left: .1rem;
            font-size: .13rem;
            color: #e9e9e9;
          }
        }
      }
    }
  }
</style>

