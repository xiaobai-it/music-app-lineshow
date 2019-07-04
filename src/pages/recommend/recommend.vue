<template>
  <div class="recommend" ref="recommend">
    <!--推荐页面-->
    <Scroll :data="GeDanData" class="recommend-content" ref="lunboDiv" >
      <div>
        <!--轮播图,注意要有数据的时候，显示轮播才可以，否则只循环一次到末尾，就停止轮播了-->
        <div class="slider-wrapper" v-if="lunboImgs.length > 0" >
          <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
            <!-- 轮播图片的个数 -->
            <swiperSlide v-for="(img,index) in lunboImgs" :key="index">
              <img :src="img.picUrl" @load="loadImg" alt="" class="lun-img" @click="clickImg(index)"/>
            </swiperSlide>
            <!-- 小圆点 -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <!--热门歌单推荐-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul v-if="GeDanData.length">
            <li v-for="(item, index) in GeDanData" :key="index" class="item" @click="goToRecommendDetail(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" width="60" height="60"/>
              </div>
              <div class="text">
                <!--<h2 class="name" v-html="item.creator.name"></h2>-->
                <h2 class="name" v-html="item.creator.name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container">
          <Loading title="玩命加载中..." v-if="!GeDanData.length"></Loading>
        </div>
      </div>
    </Scroll>
    <!--推荐页面详情页-->
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import 'swiper/dist/css/swiper.css'
import {swiper, swiperSlide} from 'vue-awesome-swiper'

import {getRecommend, getHotGeDan} from '../../api/allAPI'
import Scroll from '../../components/scroll/scroll'
import Loading from '../../components/loading/loading'
import {mapState, mapActions} from 'vuex'
import PubSub from 'pubsub-js'

export default {
  components: {
    swiper,
    swiperSlide,
    Scroll,
    Loading
  },
  data() {
    return {
      swiperOption: {
        // 所有的参数同 swiper 官方 api 参数
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false // 滑动不会失效
        },
        pagination: {el: '.swiper-pagination'},
        preventClicks: false,
        effect: 'coverflow',
        autoplayDisableOnInteraction: false,
        observer: true, // 修改swiper自己或者子元素的时候，自动初始化swiper
        observeParents: true // 修改swiper父元素的时候，自动初始化swiper
      },
      lunboImgs: [],
      GeDanData: [],
      lunboimgloadfinish: false
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    ...mapState(['fullScreen'])
  },
  mounted() {
    // 解决第一次mini播放器出来的时候，界面不能滚动的问题，事件是由tab组件传递过来的
    PubSub.subscribe('clickRecommendNav', (msg, data) => {
      setTimeout(() => {
        const bottom = !this.fullScreen ? '60px' : '0'
        this.$refs.recommend.style.bottom = bottom
        this.$refs.lunboDiv.refresh()
      }, 20)
    })
    // 获取轮播图的图片
    getRecommend().then((response) => {
      if (response.code === 0) {
        this.lunboImgs = response.data.slider
      }
    }).catch((err) => {
      console.log(err)
    })
    // 获取热门歌单的数据
    getHotGeDan().then((response) => {
      if (response.data.code === 0) {
        this.GeDanData = response.data.data.list
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  methods: {
    ...mapActions(['hotGeDanTuiJianDataActions']),
    // 点击推荐页面轮播图，进行跳转
    clickImg (index) {
      const linkUrl = this.lunboImgs[index].linkUrl
      // console.log(linkUrl)
      window.location.href = linkUrl
    },
    loadImg() {
      // 轮播图片加载完成的时候，让滚动重新刷新，保证可以滚动到最底部
      if (!this.lunboimgloadfinish) {
        this.$refs.lunboDiv.refresh()
        this.lunboimgloadfinish = true
      }
    },
    // 进入推荐详情页面
    goToRecommendDetail (item) {
      // console.log(item)
      this.$router.push(`/recommend/${item.dissid}`)
      this.hotGeDanTuiJianDataActions(item)
    }
  },
  watch: {
    // 监视playList歌曲数组的变化，如果数组长度大于0，让其最外面的div的bottom为60，解决迷你播放器和页面的自适应
    fullScreen () {
      // scroll滚动没有反应，于是监视fullScreen的状态改变 ，应该是swiper 和scroll 的冲突问题，待处理？？？？？？
      // 还是有问题，第一次显示mini播放器，推荐界面根本不滚动？？？？
      const bottom = !this.fullScreen ? '60px' : '0'
      this.$refs.recommend.style.bottom = bottom
      this.$refs.lunboDiv.refresh()
    },
    // 解决 vue-awesome-swiper 的轮播，在切换页面后，不能自动轮播的问题
    $route(newVal) {
      if (newVal.path !== '/recommend') {
        this.swiper.autoplay.stop()
      } else {
        this.swiper.autoplay.start()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .swiper-container >>> .swiper-pagination-bullet-active
    background: #ffcd32
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        .swiper-container
          background-color: #000
          .lun-img
            width: 100%
            height :auto
      .recommend-list
        .list-title
          height: 50px
          line-height: 50px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 10px 20px 10px 20px
          border-bottom : 1px solid #000
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 180%
        transform: translateY(-50%)
</style>
