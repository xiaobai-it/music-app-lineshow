<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showMiniPlayList" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="playName">歌曲播放列表</h1>
          <h1 class="title">
            <i class="icon" :class="changePalyMode" @click="choosePlayMode"></i>
            <span class="text">{{showPalyModeText}}</span>
            <span class="clear" @click="clearMiniPlayLieBiao"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll class="list-content" :data="sequenceList" :sleepRefresh="sleepRefresh" ref="listContent">
          <transition-group name="list" tag="ul">
            <li class="item" v-for="(item, index) in sequenceList"
                :key="index" @click="playClickSong(item, index)" ref="currentPlaysongBiaoQian">
              <!--音乐图标-->
              <i class="current" :class="getcurrentsongicon(item)" ></i>
              <!--歌曲名和歌手-->
              <span class="text" :class="changesongColor(item)">{{item.name}}</span>
              <!--收藏图标-->
              <span class="like" @click.stop="clickCollectionOrQuXiaoCollectionSong(item)">
                <i :class="changeCollectionStyle(item)"></i>
              </span>
              <!--删除图标-->
              <span class="delete" @click.stop="deleteOneSingerAtMiniPlayList(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click.stop="addSongToAnotherPage" ref="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表？" confirmBtnText="清空"></confirm>
      <!--添加歌曲到队列的组件-->
      <AddSongToDuiLie ref="addSongToDuiLie"/>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapState, mapActions, mapGetters} from 'vuex'
import Scroll from '../../components/scroll/scroll'
import {playMode} from '../../common/js/playModeConfig'
import Confirm from '../confirm/confirm'
import {songsRandomPaiXu} from '../../common/js/songsRandomPaiXu'
import AddSongToDuiLie from '../addsong-toduilie/addsong-toduilie'

export default {
  components: {
    Scroll,
    Confirm,
    AddSongToDuiLie
  },
  data() {
    return {
      showMiniPlayList: false, // 是否显示迷你播放器的播放列表
      sleepRefresh: 100 // scroll组件调用refresh方法的延时时间
    }
  },
  computed: {
    ...mapState(['sequenceList', 'mode', 'playList', 'saveCollectionOrQuXiaoCollectionSong']),
    ...mapGetters(['currentSong']),
    // 改变播放模式的样式
    changePalyMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 根据播放模式的样式，显示对应的文字
    showPalyModeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    ...mapActions(['atMiniPlayListDeleteOneSinger',
      'setCurrentindex', 'setPlaying', 'setPlaylist',
      'clearMiniPlayLieBiaoData', 'setMode',
      'deleteCollectionSongs', 'saveCollectionSongs']),
    // 显示迷你播放器的播放列表,父组件调用
    show () {
      this.showMiniPlayList = true
      // 再次让scroll组件刷新一次
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.playingSongDeLi2(this.currentSong)
      }, 20)
    },
    // 隐藏迷你播放器的播放列表
    hide () {
      this.showMiniPlayList = false
    },
    // 找到正在播放歌曲，显示左侧图标
    getcurrentsongicon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    // 找到正在播放歌曲，改变歌曲名的颜色
    changesongColor (item) {
      if (this.currentSong.id === item.id) {
        return 'changesongColor'
      } else {
        return ''
      }
    },
    // 播放点击的歌曲
    playClickSong(item, index) {
      // 如果是随机播放，找到playList中对应的歌曲的索引
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
        this.setCurrentindex(index)
        this.setPlaying(true)
      } else {
        this.setCurrentindex(index)
        this.setPlaying(true)
      }
    },
    // 删除点击的歌曲一首在mini播放器列表中
    deleteOneSingerAtMiniPlayList (item) {
      this.atMiniPlayListDeleteOneSinger(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    // 点击打开弹出框组件清空mini播放器的播放列表
    clearMiniPlayLieBiao() {
      this.$refs.confirm.show()
    },
    // 点击弹出框组件的清空按钮，清空mini播放器的播放列表
    confirmClear() {
      this.clearMiniPlayLieBiaoData()
    },
    // 点击图标选择播放模式
    choosePlayMode () {
      this.$nextTick(() => {
        const newMode = (this.mode + 1) % 3
        // 改变vuex中的mode值
        this.setMode(newMode)
        // 如果点击的是随机播放，对playList数组里面的歌曲进行随机排序
        let songsRandomPaiXuArr = []
        if (this.mode === playMode.random) {
          songsRandomPaiXuArr = songsRandomPaiXu(this.sequenceList)
        } else {
          songsRandomPaiXuArr = this.sequenceList
        }
        // 歌曲位置改变，但是当前正在播放的歌曲的id是不变的，根据id找到排序后的对应的歌曲的index
        let index = songsRandomPaiXuArr.findIndex((song) => {
          return song.id === this.currentSong.id
        })
        this.setPlaylist(songsRandomPaiXuArr) // 修改vuex中的playList 值为 songsRandomPaiXuArr
        this.setCurrentindex(index)
      })
    },
    // 添加歌曲到队列（打开addSongToDuiLie组件）
    addSongToAnotherPage () {
      this.$refs.addSongToDuiLie.show()
    },
    // 让正在播放的歌曲的li，滚动到顶部
    playingSongDeLi2(currentSong) {
      // 让列表界面滚动到正在播放的歌曲的位置 songLiBiaoQian
      let currentSongIndex = this.sequenceList.findIndex((item) => {
        return item.id === currentSong.id
      })
      // 滚动到对应的li标签
      let li = this.$refs.currentPlaysongBiaoQian[currentSongIndex]
      this.$refs.listContent.scrollToElement(li, 400)
    },
    // 让正在播放的歌曲的li，滚动到顶部
    playingSongDeLi(currentSong) {
      // 让列表界面滚动到正在播放的歌曲的位置 songLiBiaoQian
      let currentSongIndex = this.sequenceList.findIndex((item) => {
        return item.id === currentSong.id
      })
      // 滚动到对应的li标签
      let li = this.$refs.currentPlaysongBiaoQian[currentSongIndex - 12]
      this.$refs.listContent.scrollToElement(li, 500)
    },
    // 点击收藏或者取消收藏歌曲
    clickCollectionOrQuXiaoCollectionSong(currentSong) {
      let index = this.saveCollectionOrQuXiaoCollectionSong.findIndex((item) => {
        return item.id === currentSong.id
      })
      // index !== -1 说明当前歌曲已经收藏了，这时候需要删除当前歌曲的收藏
      if (index !== -1) {
        this.deleteCollectionSongs(currentSong)
      } else {
        // index === -1 说明当前歌曲没有收藏，这时候需要收藏当前歌曲
        this.saveCollectionSongs(currentSong)
      }
    },
    // 改变收藏和取消收藏的样式
    changeCollectionStyle (currentSong) {
      let index = this.saveCollectionOrQuXiaoCollectionSong.findIndex((item) => {
        return item.id === currentSong.id
      })
      // index !== -1 说明当前歌曲已经收藏了
      return index !== -1 ? 'icon-favorite' : 'icon-not-favorite'
    }
  },
  watch: {
    // 点击歌曲的时候，让其显示在顶部
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id || !this.showMiniPlayList) {
        return
      }
      this.playingSongDeLi(newSong)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 5px 30px 10px 20px
        .playName
          text-align :center
          color: #aaa
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 25px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          line-height :40px
          padding: 0 30px 0 20px
          overflow: hidden
          border-bottom : 1px solid #000
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-large
            color: $color-theme-d
            padding-right: 15px
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
            &.changesongColor
              color :#F9C831
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 20px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          &:hover
            opacity : .5
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
