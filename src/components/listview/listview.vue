<template>
  <!--歌手页面-->
  <Scroll class="listview" :data="singerList" ref="listview"
          :listenScroll="listenScroll" :probeType="probeType"
          @zizujianscroll="zizujianscroll">
    <ul v-show="singerList.length">
      <li class="list-group" ref="listGroup" v-for="(items, index) in singerList" :key="index">
        <h2 class="list-group-title">{{items.title}}</h2>
        <uL>
          <li class="list-group-item"
              v-for="(item, index) in items.itemData" :key="index"
              @click="goToDetail(item)"
          >
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!--右侧竖直的滚动（热门-A-Z）-->
    <div class="list-shortcut" @touchstart.stop.prevent="rightTouchStart" @touchmove.stop.prevent="rightTouchMove">
      <ul>
        <li class="item" :class="{'current':currentIndex ===index}"
                          v-for="(item,index) in rightScrollList"
                          :key="index" :index="index">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <!--歌手名title定死在界面-->
    <div class="list-fixed" ref="fixed" v-show="singerTitle">
      <div class="fixed-title">{{singerTitle}} </div>
    </div>
    <!--数据没有显示的时候，显示的加载状态-->
    <div class="loading-container" v-if="!singerList.length">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Loading from '../loading/loading'
import Scroll from '../scroll/scroll'

export default {
  components: {
    Loading,
    Scroll
  },
  props: {
    singerList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      touchMouveZuoBiao: {y1: '', y2: '', startTouchIndex: null},
      listenScroll: true, // 传递给scroll组件，用来调用zizujianscroll方法实现字母和页面的联动效果
      probeType: 3, // 传递给scroll组件的属性，实时派发 scroll 事件,获取滚动的距离
      listHeight: [], // 每一个滚动的li的高度数组
      currentIndex: 0, // 当前的里的suoyin
      scrollY: 0, // 滚动的距离
      titleScroll: 0 // 歌手title的滚动距离
    }
  },
  computed: {
    rightScrollList() {
      return this.singerList.map((items) => {
        return items.title.substring(0, 1)
      })
    },
    // 显示歌手的title
    singerTitle () {
      // console.log(this.singerList)
      if (this.scrollY >= 0) {
        return ''
      }
      return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
    }
  },
  mounted() {
  },
  methods: {
    // 解决迷你播放器和页面的自适应,singer组件调用了该方法
    listViewRefresh () {
      this.$refs.listview.refresh()
    },
    // 实现点击右侧字母，主页面滚动到对应的位置,也就是点击事件
    rightTouchStart(even) {
      // 得到父元素的索引值
      let parentIndex = even.target.parentNode.getAttribute('index')
      // 解决点击顶部、尾部的留白，不触发
      if (!parentIndex || parentIndex === 0) {
        return
      }
      this.touchMouveZuoBiao.startTouchIndex = parentIndex
      // 根据点击的索引值，调用better-scroll自带的scrollToElement方法，让页面200毫秒滚动到对应的位置
      this.$refs.listview.scrollToElement(this.$refs.listGroup[parentIndex], 200)
      this.scrollY = -this.listHeight[parentIndex]
      let firstTouch = even.touches[0] // 第一个手指点击的位置
      this.touchMouveZuoBiao.y1 = firstTouch.pageY
    },
    // 实现滚动右侧字母，主页面滚动到对应的位置,也就是滑动事件
    rightTouchMove(even) {
      let firstTouch = even.touches[0] // 第一个手指移动的位置
      this.touchMouveZuoBiao.y2 = firstTouch.pageY
      // 计算出滑动的距离和一共滑动了几个元素[A-Z]
      let count
      if (this.touchMouveZuoBiao.y1 - this.touchMouveZuoBiao.y2 < 0) {
        count = this.touchMouveZuoBiao.y2 - this.touchMouveZuoBiao.y1
      } else {
        count = this.touchMouveZuoBiao.y2 - this.touchMouveZuoBiao.y1
      }
      let touchMouveDomCount = Math.floor(count / 18)
      // 得到滑动到的最终index
      // this.touchMouveZuoBiao.startTouchIndex：是第一次点击的时候，点击的是第几个li标签
      let finalIndex = this.touchMouveZuoBiao.startTouchIndex * 1 + touchMouveDomCount
      // 解决滑动到顶部、尾部的留白，不触发
      if (finalIndex <= 0) {
        finalIndex = 0
      } else if (finalIndex >= this.listHeight.length - 1) {
        finalIndex = this.listHeight.length - 1
      }
      // 根据点击的索引值，调用better-scroll自带的scrollToElement方法，让页面200毫秒滚动到对应的位置
      this.$refs.listview.scrollToElement(this.$refs.listGroup[finalIndex], 200)
      this.scrollY = -this.listHeight[finalIndex]
    },
    // better-scroll组件传递过来的函数，用来实现，字母和页面的联动效果
    zizujianscroll(position) {
    // position 是better-scroll中自带的选项，这里只用到属性y，获取滚动的距离
      this.scrollY = position.y
    },
    everyListGroupHeight () {
      let liHeight = 0
      this.listHeight.push(liHeight)
      let listGroup = this.$refs.listGroup
      for (let i = 0; i < listGroup.length - 1; i++) {
        liHeight += listGroup[i].clientHeight
        this.listHeight.push(liHeight)
      }
    },
    goToDetail (item) {
      this.$emit('goToDetail', item)
    }

  },
  watch: {
    singerList () {
      setTimeout(() => {
        // singerList数据变化的时候，得到每一个li的高度,不加定时器，得不到对应的dom
        this.everyListGroupHeight()
      }, 20)
    },
    scrollY (scrollY) {
      // scrollY是负数
      // 这个scrollY是data里面定义的，但是用的是better-scroll库，自己带有的方法,所以必须要同名
      const listHeight = this.listHeight
      // scrollY>0时,滚动到顶部
      if (scrollY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-scrollY >= height1 && -scrollY < height2) {
          this.currentIndex = i
          this.titleScroll = height2 + scrollY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 1
    },
    titleScroll () {
      // 监视歌手title的滚动距离
      let fixedTop = (this.titleScroll < 30 && this.titleScroll > 0) ? this.titleScroll - 30 : 0
      // if (this.fixedTop === fixedTop) {
      //   return
      // }
      // this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate(0,${fixedTop}px)`
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 10px 0 10px 30px
        border-bottom :1px solid #000
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
