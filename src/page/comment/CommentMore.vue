<template>
  <div>
    <header-bar title="评论" @heightGet="headerBarHeightGet"></header-bar>
    <ul
      :style="{height: mainHeight + 'px'}"
      class="ulComments"
      ref="ulComments"
      @scroll="pullup">
      <li
        v-for="(item, commentIndex) in commentData"
        :key="commentIndex"
        class="liComments">
        <div class="userLeft">
          <img :src="commentData.length > 0 && item.user.avatarUrl" class="userIcon">
        </div>
        <section class="userRight">
          <div class="userInfo">
            <p class="userName">{{commentData.length > 0 && item.user.nickname}}</p>
            <div class="userInfoRight">
              <span class="likedCount">{{item.likedCount && item.likedCount}}</span>
              <span class="clickBlur">up</span>
            </div>
          </div>
          <span class="time">{{item.time | dateSwitch}}</span>
          <p class="commentContent">{{item.content}}</p>
        </section>
      </li>
    </ul>
    <section class="comment" ref="comment">
      <textarea v-model="comment" class="commentBox"></textarea>
      <v-touch
        tag="input"
        class="commentButton"
        type="button"
        value="评论"
        @tap="submitComment" />
    </section>
    <transition name="fade-alert">
      <p v-if="alert" class="alert">没有了</p>
    </transition>
  </div>
</template>

<script>
import {songComment, albumComment, playlistComment, MVComment, djComment} from '../../api/getData'
import {dateSwitchMixin} from '../../components/mixin/mixin'
import {mapState} from 'vuex'

export default {
  name: 'commnetMore',

  components: {
    HeaderBar: () => import('../../components/common/HeaderBar')
  },

  mixins: [dateSwitchMixin],

  data () {
    return {
      limit: 20,
      limitStatus: true,
      offset: 0,
      commentData: [],
      headerBarH: 0,
      mainHeight: 0,
      alert: false,
      comment: ''
    }
  },

  computed: {
    ...mapState([
      'musicContentHeight'
    ])
  },

  mounted () {
    this.commentDataGet()
    this.mainHeightGet()
  },

  methods: {
    async commentDataGet () { // 评论获取
      try {
        var fun
        switch (this.$route.query.type) {
          case 'song':
            fun =  songComment
            break
          case 'album':
            fun = albumComment
            break
          case 'playlist':
            fun = playlistComment
            break
          case 'MV':
            fun = MVComment
            break
          case 'dj':
            fun = djComment
            break
        }
        var res = await fun(this.$route.query.id, this.limit, this.offset)
        if (res.comments.length < this.limit) {
          this.limitStatus = false
        } else {
          this.commentData = this.commentData.concat(res.comments)
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    headerBarHeightGet (h) {
      this.headerBarH = h
    },

    mainHeightGet () { // 主体高度
      var timer = setInterval(() => { // dom加载过慢来不及计算高度，所以加个延时
        if (this.$refs.comment.offsetHeight > 0) {
          this.mainHeight = this.musicContentHeight - this.headerBarH - this.$refs.comment.offsetHeight
          clearInterval(timer)
        }
      }, 200)
    },

    pullup () { // 上拉加载
      var
        boxHeight = this.$refs.ulComments.scrollHeight,
        boxTop = this.$refs.ulComments.scrollTop
      if (boxHeight - this.mainHeight - boxTop < 10) {
        this.addData()
      }
    },

    addData () { // 增加数据
      if (this.limitStatus) {
        this.offset += 30
        this.commentDataGet()
      } else {
        this.alert = true
        setTimeout(() => {
          this.alert = false
        }, 1000)
      }
    },

    async submitComment () { // 提交评论
      try {
        // 这个要先登录，先不写
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ulComments{
    overflow: auto;
    .liComments {
      display: flex;
      padding: .1rem .05rem;
      border-bottom: 2px solid #e9e9e9;
      .userLeft {
        width: 10%;
        flex: none;
        .userIcon {
          width: 100%;
          border-radius: 50%;
        }
      }
      .userRight {
        width: 90%;
        margin-left: .1rem;
        .userInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .userName {
            font-size: .13rem;
            color: #757575;
          }
          .userInfoRight {
            .likedCount {
              font-size: .12rem;
              color: #aaaaaa;
            }
            .clickBlur {
              font-size: .14rem;
              color: #e75050;
            }
          }
        }
        .time {
          font-size: .12rem;
          color: #b6b6b6;
        }
        .commentContent {
          margin-top: .05rem;
          font-size: .14rem;
          color: #333333;
          line-height: 1.5em;
        }
      }
    }
  }
  .comment {
    display: flex;
    padding: .1rem .05rem;
    justify-content: space-between;
    align-items: center;
    .commentBox {
      width: 80%;
      height: .3rem;
      border-radius: 2px;
      font-size: .15rem;
      color: #727272;
    }
    .commentButton {
      width: 20%;
      background-color: #3dc3d4;
      font-size: .16rem;
      color: #fff;
      margin-left: .05rem;
      height: .35rem;
      border-radius: 2px;
    }
  }
  .alert {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 2rem;
    color: #575757;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: .15rem;
    padding: 2px .1rem;
    border-radius: 2px;
  }
</style>

