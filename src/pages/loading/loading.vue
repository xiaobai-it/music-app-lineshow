<template>
    <div class="loading-wrap">
      <div class="loading-wrap-all">
        <div class="loading-desc">不一样的音乐体验</div>
        <div class="loading-img-wrap">
          <img src="./images/loading.jpg" class="loading-img" alt="">
        </div>
        <div class="loading-content">
          <div class="loading-content-wrap">
            <img src="./images/logo@2x.png" class="loading-content-img" alt="">
            <span class="loading-content-text">爱玩音乐</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.$router.push('/recommend')
    }, 3500)
  },
  watch: {
    // 监视路由，如果路由是/loading，就自动跳转达到recomend页面
    $route(newVal) {
      if (newVal.path === '/loading') {
        setTimeout(() => {
          this.$router.push('/recommend')
        }, 3500)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .loading-wrap,.loading-wrap-all
    position: fixed
    top: 0
    left: 0
    width : 100%
    height: 100%
    background : $color-background
    /*transition: all 5s linear*/
  .loading-wrap-all
    position: relative
    animation : loading-wrap-animation 3s
    .loading-desc
      position :absolute
      width :100%
      text-align :center
      font-size :25px
      color: $color-theme
      font-weight :bold
      z-index: 10
      animation : loading-desc-animation 2s
      animation-fill-mode: forwards
    .loading-img-wrap
      position :absolute
      top: 10%
      width :100%
      height : 80%
      .loading-img
        width : 100%
        animation : loading-img-animation 3s
        /*animation-fill-mode: forwards*/
    .loading-content
      position : absolute
      bottom : 0
      width : 100%
      height :10%
      text-align : center
      color: $color-theme
      font-weight :bold
      .loading-content-wrap
        margin-top :5%
        .loading-content-img
          width: 40px
          height: 40px
          border-radius : 50%
          vertical-align: middle
        .loading-content-text
          text-align :center
          font-size :$font-size-medium

  @keyframes loading-desc-animation {
    from {height :0%; line-height : 0px; transform:scale(0)}
    to {height :10%; line-height: 70px; transform:scale(1)}
  }
  @keyframes loading-wrap-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
  @keyframes loading-img-animation {
    0% {transform:scale(0)}
    50% {transform:scale(1.1)}
    100% {transform:scale(1)}
  }
</style>
