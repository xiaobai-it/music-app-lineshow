<template>
  <div id="app">
    <!--最顶的头部-->
    <Mheader/>
    <!--4个导航按钮-->
    <Tab/>
    <!--4个导航页面-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--播放器play组件-->
    <Player/>
  </div>
</template>

<script>
import Mheader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from './pages/player/player'

export default {
  name: 'App',
  components: {
    Mheader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
