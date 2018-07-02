<template>
  <section class="commentList">
    <dl
      v-for="(type, index) in commentData"
      :key="index"
      class="dlComments">
      <dt v-if="type.data.length > 0" class="dtComments">{{type.title}}</dt>
      <dd
        v-for="(item, commentIndex) in type.data"
        :key="commentIndex"
        class="ddComments">
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
      </dd>
    </dl>
    <v-touch
      v-if="commentData[1].data.length > 0"
      tag="p"
      class="moreComment"
      @tap="goCommentsPage">更多评论 &gt;</v-touch>
  </section>
</template>

<script>
import {dateSwitchMixin} from '../mixin/mixin'

export default {
  name: 'CommentList',

  mixins: [dateSwitchMixin],

  props: {
    commentData: { // 评论列表数据
      type: Array,
      default () {
        return [
          {
            title: '热门评论',
            data: []
          },
          {
            title: '最新评论',
            data: []
          }
        ]
      }
    },

    commentType: { // 评论类型
      type: String,
      default: 'song'
    },
    
    contentId: { // 项目id,用来获取评论列表
      type: Number,
      default: 0
    }
  },

  methods: {
    goCommentsPage () {
      this.$router.push({name: 'commentMore', query: {type: this.commentType, id: this.contentId}})
    }
  }
}
</script>

<style lang="scss" scoped>
  .commentList {
    .dlComments {
      .dtComments {
        font-size: .12rem;
        color: #5a5a5a;
        background-color: #d8d8d8;
        line-height: .3rem;
        padding: 0 .05rem;
      }
      .ddComments {
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
    .moreComment {
      font-size: .15rem;
      color: #52b9e2;
      text-align: center;
      margin: .1rem auto;
    }
  }
</style>

