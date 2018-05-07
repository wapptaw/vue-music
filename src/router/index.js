import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const playerBase = () => import('../page/playerBase')
const home = () => import('../page/home/home')

export default new Router({
  routes: [
    {
      path: '/app',
      name: 'playerBase',
      component: playerBase,
      children: [
        {
          path: '',
          name: 'home',
          component: home
        },
        {
          path: 'home',
          name: 'home',
          component: home
        }
      ]
    }
  ]
})
