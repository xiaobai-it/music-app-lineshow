<template>
  <div class="rank" ref="rank">
    <!--排行页面、scroll滚动组件-->
    <Scroll class="toplist" :data="topList" ref="scroll">
      <div>
        <ul>
          <li class="item" v-for="(list, index) in topList" :key="index" @click="goToRankDetail(list)">
            <div class="icon">
              <img width="100" height="100" v-lazy="list.picUrl"/>
            </div>
            <ul class="songlist">
              <li class="song" v-for="(allSong, index) in list.songList" :key="index">
                <span>{{index + 1}}.</span>
                <span>{{allSong.singername}}-{{allSong.songname}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <!--显示加载状态的组件-->
        <div class="loading-container" v-if="!topList.length">
          <loading></loading>
        </div>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from '../../components/loading/loading'
import {getTopLst} from '../../api/allAPI'
import Scroll from '../../components/scroll/scroll'
import {mapState, mapActions} from 'vuex'
import PubSub from 'pubsub-js'

export default {
  components: {
    Loading,
    Scroll
  },
  data () {
    return {
      topList: [] // 排行首页数据
    }
  },
  mounted() {
    // 解决第一次mini播放器出来的时候，界面不能滚动的问题，事件是由tab组件传递过来的
    PubSub.subscribe('clickRankNav', (msg, data) => {
      setTimeout(() => {
        const bottom = !this.fullScreen ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroll.refresh()
      }, 20)
    })
    // 获取排行首页界面的后台数据
    getTopLst().then((response) => {
      if (response.data.code === 0) {
        // console.log(response.data.data.topList)
        this.topList = response.data.data.topList
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapState(['fullScreen'])
  },
  methods: {
    ...mapActions(['oneTopList']),
    // 打开排行详情页面
    goToRankDetail (list) {
      this.$router.push(`/rank/${list.id}`)
      // 把点击的数据。保存到vuex中
      this.oneTopList(list)
    }
  },
  watch: {
    // 监视mini播放器是否显示，解决迷你播放器和页面的自适应
    fullScreen () {
      const bottom = !this.fullScreen ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        margin-top: 70%
        transform: translateY(-50%)
</style>
