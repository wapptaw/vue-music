<template>
  <section class="user">
    <router-link
      :to="{name: route}"
      event="touchend"
      tag="header"
      class="userInfo">
      <div class="userInfoLeft">
        <img src="" class="userIcon">
        <p v-if="logged" class="username"></p>
        <p v-else class="loginPlease">请先登录</p>
      </div>
      <span class="message"></span>
    </router-link>
    <section class="userList">
      <ul class="ulUserList">
        <li
          v-for="(item, index) in userList"
          :key="index"
          class="liUserList">
          <p class="userListTitle">{{item.title}}</p>
          <span class="arrows">&gt;</span>
        </li>
      </ul>
    </section>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'user',

  data () {
    return {
      logged: false,
      userList: [
        {
          title: '我的歌单'
        },
        {
          title: '我的电台'
        },
        {
          title: '我的关注'
        },
        {
          title: '我的粉丝'
        },
        {
          title: '我的动态'
        },
        {
          title: '播放记录'
        },
        {
          title: '每日推荐'
        }
      ]
    }
  },

  computed: {
    route () { // 登录和未登录情况下的路由位置
      return this.logged ? 'userInfo' : 'login'
    }
  },

  methods: {
    //
  }
}
</script>

<style lang="scss" scoped>
  .user {
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: .6rem;
      padding: 0 .1rem;
      border-bottom: .1rem solid #eeeeee;
      .userInfoLeft {
        display: flex;
        .userIcon {
          //
        }
        .username {
          font-size: .14rem;
          color: #696969;
        }
        .loginPlease {
          font-size: .14rem;
          color: #696969;
        }
      }
      .message {
        //
      }
    }
    .userList {
      .ulUserList {
        .liUserList {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 .1rem;
          height: .4rem;
          border-bottom: 1px solid #eee;
          .userListTitle {
            font-size: .14rem;
            color: #696969;
          }
          .arrows {
            font-size: .14rem;
            color: #696969;
            transform: scale(1, 2);
          }
        }
      }
    }
  }
</style>

