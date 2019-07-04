<template>
  <!--通用的音乐详情页面-->
  <div class="music-list">
    <div class="back" >
      <i class="icon-back" @click="$router.back()"></i>
    </div>
    <h1 class="title" v-html="singerName"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImgs">
      <div class="play-wrapper"  v-if="musicData.length" ref="playWrapper">
        <div class="play" @click="randomPlaySongs">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter" ></div>
    </div>
    <!--下面的div是为了随着歌曲列表的滚动而滚动而设计的-->
    <div class="bg-layer" ref="bgLayer"></div>
    <Scroll class="list" :data="musicData" :probeType="probeType" :listenScroll="listenScroll" @zizujianscroll="zizujianscroll" ref="list">
      <div class="song-list-wrapper">
        <!-- songList组件-->
        <SongList :rank="rank" :musicData="musicData" @clickOneSong="clickOneSong"/>
      </div>
      <div class="loading-container" v-if="!musicData.length">
        <Loading :title="title"/>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'

import SongList from '../../components/song-list/song-list'
import Scroll from '../../components/scroll/scroll'
import Loading from '../../components/loading/loading'

export default {
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    musicData: {
      type: Array,
      default: null
    },
    bgImg: {
      type: String,
      default: ''
    },
    singerName: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '玩命加载中...',
      probeType: 3,
      listenScroll: true,
      scrollY: 0,
      bgImgHeight: 0
    }
  },
  mounted() {
    // 让歌曲列表显示在歌手图片的下方
    this.bgImgHeight = this.$refs.bgImgs.clientHeight
    this.$refs.list.$el.style.top = `${this.bgImgHeight}px`
  },
  computed: {
    bgStyle() {
      return `background-image :url("${this.bgImg}")`
    },
    ...mapState(['fullScreen'])
  },
  methods: {
    ...mapActions(['clickOneSongShowPlay', 'clickRandomPlaySongs']),
    // 实时监听scroll组件滚动的Y轴距离
    zizujianscroll(position) {
      this.scrollY = position.y
    },
    // 点击某一首歌，显示播放器界面,播放器界面组件放在了App.vue组件中
    clickOneSong(item, index) {
      let musicData = this.musicData
      this.clickOneSongShowPlay({musicData, index})
    },
    // 点击随机播放全部按钮，随机播放歌曲
    randomPlaySongs () {
      let musicData = this.musicData
      this.clickRandomPlaySongs({musicData})
    },
    // singer-detail组件\rank-detail组件调用该方法，实现scroll滚动，解决mini播放器的自适应问题
    singerDetailDiaoYong () {
      this.$refs.list.refresh()
    }
  },
  watch: {
    // 实时监听scroll组件滚动的Y轴距离
    scrollY(scrollY) {
      const height = 40 - this.bgImgHeight // 确定背景向上滚动的最大距离
      const maxScrollY = Math.max(scrollY, height) // 确定背景实时滚动的距离
      this.$refs.bgLayer.style.transform = `translateY(${maxScrollY}px)`
      // 实现歌曲滚动到距离顶部还有40px的时候，歌曲滚动被盖住
      if (scrollY <= height) {
        this.$refs.bgImgs.style.paddingTop = 0
        this.$refs.bgImgs.style.zIndex = 10
        this.$refs.bgImgs.style.height = `${40}px`
        this.$refs.playWrapper.style.display = `none`
      } else {
        this.$refs.bgImgs.style.paddingTop = '70%'
        this.$refs.bgImgs.style.zIndex = 0
        this.$refs.bgImgs.style.height = 0
        this.$refs.playWrapper.style.display = `block`
      }
      // 歌曲下拉滚动的时候，背景图也跟着变大
      if (scrollY >= 0) {
        let moveScrollY = Math.abs(scrollY / this.bgImgHeight)
        let scale = 1 + moveScrollY
        this.$refs.bgImgs.style.transform = `scale(${scale})`
        this.$refs.bgImgs.style.zIndex = 20
      }
    },
    // 监视playList歌曲数组的变化，如果数组长度大于0，让其最外面的div的bottom为60，解决迷你播放器和页面的自适应
    // playList () {
    //   // scroll滚动没有反应，妈的什么情况
    //   const bottom = this.playList.length > 0 ? '60px' : ''
    //   this.$refs.list.$el.style.bottom = bottom
    //   this.$refs.list.refresh()
    // }
    fullScreen () {
      const bottom = !this.fullScreen ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
