import Vue from 'vue'
import Router from 'vue-router'
// 引入home.vue进来
import Home from '../views/home'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
