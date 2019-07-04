<template>
  <transition name="slide">
    <div class="user-center" ref="usercenter">
      <div class="back" @click="$router.back()">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <!--2个大按钮组件-->
        <Switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"/>
      </div>
      <div class="play-btn" @click="clickRandomPlay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper">
        <Scroll class="list-scroll"
                :data="saveCollectionOrQuXiaoCollectionSong"
                ref="ilikedivflag">
          <div class="list-inner">
            <!--我收藏的组件-->
            <!--收藏歌曲的组件-->
            <SongList
              v-if=" saveCollectionOrQuXiaoCollectionSong && saveCollectionOrQuXiaoCollectionSong.length > 0 && saveCollectionOrQuXiaoCollectionSong !== undefined"
              :musicData="saveCollectionOrQuXiaoCollectionSong"
              @clickOneSong="clickOneSong"/>
            <NoResult v-else class="topjuli" title="您还没有收藏过任何歌曲"/>
          </div>
        </Scroll>
        <Scroll class="list-scroll"
                :data="savePlaySongsRecently"
                ref="ilistionrecentlyflag">
          <div class="list-inner">
            <!--我最近听的组件-->
            <!--最近播放的歌曲的组件,歌曲列表组件-->
            <SongList
              v-if="savePlaySongsRecently.length > 0 && savePlaySongsRecently !== undefined"
              :musicData="savePlaySongsRecently"
              @clickOneSong="clickOneSong"/>
            <NoResult v-else class="topjuli" title="您还没有播放过任何歌曲"/>
          </div>
        </Scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'
import Switches from '../../components/switches/switches'
import SongList from '../../components/song-list/song-list'
import Scroll from '../../components/scroll/scroll'
import NoResult from '../../components/no-result/no-result'

export default {
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  },
  data() {
    return {
      currentIndex: 0, // 默认大按钮的索引
      switches: [{name: '我的收藏'}, {name: '最近常听'}]
    }
  },
  mounted () {
    if (this.currentIndex === 0) {
      this.$refs.ilikedivflag.$el.style.display = 'block'
      this.$refs.ilistionrecentlyflag.$el.style.display = 'none'
      this.$refs.ilikedivflag.refresh()
    }
  },
  computed: {
    ...mapState(['savePlaySongsRecently', 'saveCollectionOrQuXiaoCollectionSong'])
  },
  methods: {
    ...mapActions(['searchResultClickOneSongInsertAndToPlayPage', 'clickRandomPlaySongs']),
    // 点击2个大按钮的某一个显示对应的组件
    switchItem(index) {
      this.currentIndex = index
      if (index === 0) {
        this.$refs.ilikedivflag.$el.style.display = 'block'
        this.$refs.ilistionrecentlyflag.$el.style.display = 'none'
        this.$refs.ilikedivflag.refresh()
      } else {
        this.$refs.ilistionrecentlyflag.$el.style.display = 'block'
        this.$refs.ilikedivflag.$el.style.display = 'none'
        this.$refs.ilistionrecentlyflag.refresh()
      }
    },
    // 点击最近播放页面的一首歌曲，把歌曲添加到当前播放列表中
    clickOneSong(item, index) {
      // if (index !== 0) {
      this.searchResultClickOneSongInsertAndToPlayPage(item)
      // topalert组件的方法
      // this.$refs.topalert.show()
      // }
    },
    // 点击随机播放按钮，随机播放当前组件内的歌曲,并且大播放器界面显示出来
    clickRandomPlay() {
      if (this.currentIndex === 0) {
        this.clickRandomPlaySongs({musicData: this.saveCollectionOrQuXiaoCollectionSong})
        this.$refs.usercenter.style.zIndex = 70 // 让组件自身在大播放器界面的下面
      } else {
        this.clickRandomPlaySongs({musicData: this.savePlaySongsRecently})
        this.$refs.usercenter.style.zIndex = 70
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
          .topjuli
            margin-top :100px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
