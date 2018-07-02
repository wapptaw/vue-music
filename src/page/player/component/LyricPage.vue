<template>
  <div class="lyricPage" :style="{background: `url(${songBg}) no-repeat center`}" ref="lyricPage">
    <ul
      class="ulLyric"
      ref="ulLyric"
      :style="{transform: `translateY(${posY}px)`}">
      <li
        v-for="(item, index) in lyricList"
        :key="index"
        :ref="'line' + index"
        class="lyric"
        :class="{current: index === lyricIndex}">{{item.lyric}}</li>
    </ul>
  </div>
</template>

<script>
import {lyric} from '../../../api/getData'
import {mapState} from 'vuex'

export default {
  name: 'LyricPage',

  props: {
    songId: {
      type: [String, Number],
      default: 1000
    },

    songBg: { // 背景图片
      tyle: String,
      default: ''
    }
  },

  data () {
    return {
      lyricData: null, // 歌词数据
      lyricList: [], // 序列化后的歌词列表
      lyricIndex: NaN, // 歌词序号
      changeStatus: true, // 防止歌词序号更改过快的开关
    }
  },

  computed: {
    posY () { // 歌词需要移动的距离
      if (!Number.isNaN(this.lyricIndex)) {
        var totalHeight = 0
        for (let i = 0; i <= this.lyricIndex; i++) {
          totalHeight += this.$refs['line' + i][0].offsetHeight
        }
        if (totalHeight >= 160) {
          if (this.$refs.lyricPage.offsetHeight + totalHeight >= this.$refs.ulLyric.offsetHeight) {
            return -(this.$refs.ulLyric.offsetHeight - this.$refs.lyricPage.offsetHeight - 160)
          } else {
            return -(totalHeight - 160)
          }
        }
      } else {
        return 0
      }
    },

    ...mapState([
      'ObjectAudio',
      'playIndex'
    ])
  },

  watch: {
    playIndex: {
      handler: 'lyricGet',
      immediate: true
    }
  },

  beforeRouteLeave (to, from, next) {
    this.ObjectAudio.removeEventListener('timeupdate', this.lyricIndexGet)
    next()
  },

  methods: {
    async lyricGet () { // 歌词获取
      try {
        this.ObjectAudio.removeEventListener('timeupdate', this.lyricIndexGet) // 先清除事件
        this.lyricIndex = NaN
        let res = await lyric(this.songId)
        if (res.lrc) {
          this.lyricData = res.lrc.lyric
          this.lyricListGet()
          this.timeupdateEvent()
        } else {
          this.lyricList = [
            {
              lyric: '没有歌词'
            }
          ]
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    lyricListGet () { // 歌词序列化
      const reg = /((\[\d{2}:\d{2}\.\d{2,3}\]){1,2})(.*)/g
      let lyricList = []
      while (true) {
        let match = reg.exec(this.lyricData)
        if (!match) break
        let timeParse = this.timeSwitch(match[2])
        if (match[1] === match[2]) {
          lyricList.push({
            lyric: match[3],
            time: timeParse
          })
        } else {
          let timeString = match[1].match(/(\[\d{2}:\d{2}\.\d{2,3}\]){1}/)
          let timeParseToo = this.timeSwitch(timeString[0])
          lyricList.push({
            lyric: match[3],
            time: timeParse
          }, {
            lyric: match[3],
            time: timeParseToo
          })
        }
      }
      lyricList.sort((item1, item2) => { // 排序
        return item1.time - item2.time
      })
      this.lyricList = lyricList
    },

    timeSwitch (timeSting) { // 时间转换
      var reg = /\d{2}:\d{2}\.\d{2,3}/
      var timeNumber = timeSting.match(reg)[0]
      var arrTimeNumber = timeNumber.split(/:|\./)
      return parseInt(arrTimeNumber[0]) * 60 + parseInt(arrTimeNumber[1]) + parseInt(arrTimeNumber[2]) / 1000
    },

    timeupdateEvent () { // 当音频播放时间改变事件
      this.ObjectAudio.addEventListener('timeupdate', this.lyricIndexGet)
    },

    lyricIndexGet (e) { // 歌词序号获取
      if (this.changeStatus) {
        this.changeStatus = false
        for (let i = 0, len = this.lyricList.length; i < len; i++) {
          if (this.ObjectAudio.currentTime > this.lyricList[i].time) {
            continue
          } else {
            if (i > 0) {
              this.lyricIndex = i - 1
            }
            break
          }
        }
        setTimeout(() => { // 设置触发延时（好像没什么卵用，timeupdate事件的触发延时好像超过100毫秒）
          this.changeStatus = true
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .lyricPage {
    overflow: hidden;
    height: 100%;
    background-size: cover;
    .ulLyric {
      padding: .1rem;
      min-height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      transition: transform .5s;
      .lyric {
        font-size: .15rem;
        color: #f1f1f1;
        text-align: center;
        min-height: .4rem;
        line-height: .4rem;
      }
      .current {
        color: #44ece4;
      }
    }
  }
</style>

