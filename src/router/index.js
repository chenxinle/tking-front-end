import Vue from 'vue'
import Router from 'vue-router'
import Spider from '@/components/Spider'
import Home from '@/components/Home'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/spider',
        name: 'Spider',
        component: Spider
      },
      {
        path: '/',
        name: 'Home',
        component: Home
      }
    ]
  })
}
