import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const home = () => import('../page/home/home')

export default new Router({
  routes: [
    {
      path: '/app',
      name: home,
      component: home
    }
  ] 
})
