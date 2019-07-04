<template>
  <div ref="scrollWrap">
  <!--这是一个滚动组件，整个项目都在用-->
    <slot></slot>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {// 监听滚动的类型，例如缓慢滚动、快速滚动等，这些属性都是better-scroll自带的
      type: Number,
      default: 1
    },
    click: {// 滚动的过程中，是否可以点击，这些属性都是better-scroll自带的
      type: Boolean,
      default: true
    },
    data: {// 数据在动态变化时，滚动重新刷新，这个属性是自定义属性,是组件传递过来的
      type: Array,
      default: null
    },
    listenScroll: {// 数据在动态变化时，滚动重新刷新，这个属性是自定义属性，是组件传递过来的
      type: Boolean,
      default: false
    },
    isShangLaLoading: {// 搜索页面默认加载20条数据，该属性为true时，才可以下拉加载更多，这个属性是自定义属性，是组件传递过来的
      type: Boolean,
      default: false
    },
    isSearchResultMove: {// 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘，该属性是自定义属性，是组件传递过来的
      type: Boolean,
      default: false
    },
    sleepRefresh: {// 上面 data属性的值发生改变的时候，重新调用scroll的refresh方法的时间
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    setTimeout(() => {
      // 初始化better-scroll，加入一个延时定时器，视为了确保DOM已经加载完成，浏览器的默认刷新时间是17毫秒
      if (!this.$refs.scrollWrap) {
        return
      }
      this.scroll = new BScroll(this.$refs.scrollWrap, {probeType: this.probeType, click: this.click})
      if (this.listenScroll) {
        let that = this // 保证回调函数是vue来调用
        this.scroll.on('scroll', (position) => {
          that.$emit('zizujianscroll', position)
        })
      }
      // 搜索页面默认加载20条数据，该属性为true时，才可以下拉加载更多
      if (this.isShangLaLoading) {
        let that = this // 保证回调函数是vue来调用
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            console.log('开始上拉加载')
            that.$emit('scrollToBottomLoadingMore')
          }
        })
      }
      // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘，该属性是自定义属性，是组件传递过来的
      if (this.isSearchResultMove) {
        let that = this // 保证回调函数是vue来调用
        this.scroll.on('beforeScrollStart', () => {
          that.$emit('myBeforeScrollStart')
        })
      }
    }, 20)
  },
  methods: {
    enable() { // 该方法是better-scroll自带的
      this.scroll && this.scroll.enable()
    },
    disable() { // 该方法是better-scroll自带的
      this.scroll && this.scroll.disable()
    },
    refresh() { // 该方法是better-scroll自带的
      this.scroll && this.scroll.refresh()
    },
    scrollTo() { // 该方法是better-scroll自带的
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      // 监视传递过来的属性data的变化，一但变化，就自动刷新滚动
      setTimeout(() => {
        this.refresh()
      }, this.sleepRefresh)
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
