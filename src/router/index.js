import Vue from 'vue'
import Router from 'vue-router'

import rank from '../pages/rank/rank' // 排行页面
import rankDetail from '../pages/rank-detail/rank-detail' // 排行页面
import recommend from '../pages/recommend/recommend' // 推荐页面
import search from '../pages/search/search' // 搜索页面
import singer from '../pages/singer/singer' // 歌手页面
import singerDetail from '../pages/singer-detail/singer-detail' // 歌手详情页面
import recommendDetail from '../pages/recommend-detail/recommend-detail' // 推荐页面的详情页面
import userCenter from '../pages/user-center/user-center' // 排行页面
import loading from '../pages/loading/loading' // 进入的时候的加载页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: '/rank/:id',
          component: rankDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: '/recommend/:id',
          component: recommendDetail
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: '/search/detail/:id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: '/singer/detail/:id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/user',
      component: userCenter
    },
    // {
    //   path: '/',
    //   redirect: '/recommend'
    // },
    {
      path: '/loading',
      component: loading
    },
    {
      path: '/',
      redirect: '/loading'
    },
    {
      path: '*',
      redirect: '/recommend'
    }
  ]
})
