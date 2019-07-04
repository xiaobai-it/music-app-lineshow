// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// Vue.config.productionTip = false
import './common/stylus/index.styl' // css的基本样式重置
import 'babel-polyfill' // 对ie老版本浏览器的兼容处理包
import fastClick from 'fastclick' // 解决移动端点击300毫秒延时的bug的包
import VueLazyload from 'vue-lazyload' // 图片懒加载
import store from './store/store' // vuex状态管理
fastClick.attach(document.body)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./common/image/default.png'),
  loading: require('./common/image/default.png'),
  attempt: 2
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
