import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const playerBase = () => import('../page/playerBase')
const home = () => import('../page/home/home')
const musicLibrary = () => import('../page/home/children/musicLibrary')
const user = () => import('../page/home/children/user')
const login = () => import('../page/home/children/children/login')
const userInfo = () => import('../page/home/children/children/userInfo')
const personalFM = () => import('../page/MusicPage/personalFM')
const daily = () => import('../page/MusicPage/daily')
const RankingList = () => import('../page/RankingList/RankingList')
const RankingListDetail = () => import('../page/RankingList/children/RankingListDetail')
const playlist = () => import('../page/playlist/playlist')
const PlaylistDetail = () => import('../page/playlist/PlaylistDetail')
const CommentMore = () => import('../page/comment/CommentMore')
const djDetail = () => import('../page/dj/djDetail')
const player = () => import('../page/player/player')
const search = () => import('../page/search/search')

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/app',
      name: 'playerBase',
      component: playerBase,
      children: [
        {
          path: '',
          component: home,
          children: [
            {
              path: '',
              component: musicLibrary
            }
          ]
        },
        {
          path: 'home',
          name: 'home',
          component: home,
          children: [
            {
              path: 'musicLibrary',
              name: 'musicLibrary',
              component: musicLibrary
            },
            {
              path: 'user',
              name: 'user',
              component: user,
              children: [
                {
                  path: 'login',
                  name: 'login',
                  component: login
                },
                {
                  path: 'userInfo',
                  name: 'userInfo',
                  component: userInfo
                }
              ]
            }
          ]
        },
        {
          path: 'personalfm',
          name: 'personalfm',
          component: personalFM
        },
        {
          path: 'daily',
          name: 'daily',
          component: daily
        },
        {
          path: 'rankinglist',
          name: 'rankinglist',
          component: RankingList,
          children: [
            {
              path: 'rankinglistdetail',
              name: 'rankinglistdetail',
              component: RankingListDetail
            }
          ]
        },
        {
          path: 'playlist',
          name: 'playlist',
          component: playlist
        },
        {
          path: 'playlistdetail',
          name: 'playlistdetail',
          component: PlaylistDetail
        },
        {
          path: 'commentMore',
          name: 'commentMore',
          component: CommentMore
        },
        {
          path: 'djDetail',
          name: 'djDetail',
          component: djDetail
        },
        {
          path: 'search',
          name: 'search',
          component: search
        }
      ]
    },
    {
      path: '/player',
      name: 'player',
      component: player
    }
  ]
})
