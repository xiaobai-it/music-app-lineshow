<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <!--输入框-->
    <input class="box" v-model="query" :placeholder="placeholder" ref="input"/>
    <!--删除按钮-->
    <i class="icon-dismiss" v-if="query" @click="clearInputValue"></i>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    placeholder: {
      type: String,
      default: '点击搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  mounted () {
    this.$watch('query', this.jieLiuFunc((newQuery) => {
      // 输入框的数据改变的时候，发送输入的数据query 给父组件search-result组件
      this.$emit('queryValue', newQuery)
    }, 300))
  },
  methods: {
    // 清除搜索内容
    clearInputValue () {
      this.query = ''
    },
    // 点击热门搜索，把值添加到搜索框内
    andSearchToInput (value) {
      this.query = value
    },
    // 节流函数，实现搜索框快速变换搜索数据，只发起最后一次的请求
    jieLiuFunc (func, time) {
      let timer
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, time)
      }
    },
    // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘
    blurInput () {
      this.$refs.input.blur()
    }
  },
  watch: {
    // query () {
    //   // 输入框的数据改变的时候，发送输入的数据query 给search-result组件
    //   // 为了实现节流函数的效果，所以把监听query改变的状态写在了montend里面
    //   this.$emit('queryValue', this.query)
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
