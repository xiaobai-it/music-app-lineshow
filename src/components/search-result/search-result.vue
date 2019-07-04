<template>
  <Scroll class="suggest" :data="result" ref="suggest"
          :isShangLaLoading="isShangLaLoading"
          @scrollToBottomLoadingMore="scrollToBottomLoadingMore"
          :isSearchResultMove="isSearchResultMove"
          @myBeforeScrollStart="myBeforeScrollStart">
    <ul class="suggest-list" v-show="result.length > 0 && result !== undefined">
      <li class="suggest-item" v-for="(item, index) in result"  :key="index" @click="goToSingerDetailOrPlaySong(item)">
        <div class="icon">
          <i :class="showIconCls(item)" ></i>
        </div>
        <div class="name">
          <p class="text">{{showSongAndSinger(item)}}</p>
        </div>
      </li>
      <Loading title="正在加载中..." v-show="showLoadingMoreZuJian" ref="bottomLoading"/>
      <span class="dataSearchFinal" style="display: none" ref="dataSearchFinal">
        ------ 亲,这回真的到底了哦! ------
      </span>
    </ul>
    <Loading class="searchLoading" title="玩命加载中..." v-show="result.length === 0 && result !== undefined" ref="loading"/>
    <div class="no-result-wrapper" v-show="!LoadingMore && result.length === 0">
      <!--搜索不到任何数据的时候，显示的组件no-reslt-->
      <noResult title="抱歉，暂无搜索结果"/>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Loading from '../loading/loading'
import {getSearchResult, getplaysongvkey} from '../../api/allAPI'
import Scroll from '../../components/scroll/scroll'
import {mapActions} from 'vuex'
import noResult from '../../components/no-result/no-result'

export default {
  components: {
    Loading,
    Scroll,
    noResult
  },
  props: {
    catZhida: { // 搜索的时候是否显示歌手
      type: Boolean,
      default: true
    },
    showSearchResult: { // 搜索输入框输入的数据
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1, // 查询第几页的数据
      result: [], // 保存搜索结果
      isShangLaLoading: true, // 为true时，把属性传递给scroll组件，可以实现上拉加载
      LoadingMore: true, // 上拉加载更多数据的标记
      showLoadingMoreZuJian: false, // 上拉加载的时候，是否显示loading组件
      isSearchResultMove: true // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘
    }
  },
  mounted () {
    this.$refs.loading.$el.style.display = 'none'
  },
  methods: {
    ...mapActions(['setSinger', 'searchResultClickOneSongInsertAndToPlayPage']),
    // 显示不同的图标
    showIconCls (item) {
      if (item.type === 'singer') {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    showSongAndSinger (item) {
      if (item.type === 'singer') {
        return item.singername
      } else {
        return `${item.songname} - ${this.dealSinger(item.singer)}`
      }
    },
    // 把后台得到的数据中歌手名字进行处理，返回字符串
    dealSinger(singers) {
      let singerStr = []
      singers.forEach((singer) => {
        singerStr.push(singer.name)
      })
      return singerStr.join('/')
    },
    // 接收到搜索框内的数据后，发起请求，获取对应的后台数据
    getSearch () {
      this.LoadingMore = true
      this.page = 1
      // 接收到搜索框内的数据后，发起请求，获取对应的后台数据
      getSearchResult(this.showSearchResult, this.catZhida, this.page).then((response) => {
        const songObj = response.data.data.song.list
        const singerObj = response.data.data.zhida
        let finalArr = []
        if (response.data.code === 0) {
          if (singerObj && singerObj.singerid) {
            finalArr.push({...singerObj, ...{type: 'singer'}})
          }
          if (songObj && songObj.length > 0) {
            finalArr = finalArr.concat(songObj)
          }
        }
        if (finalArr.length <= 19) {
          this.LoadingMore = false
        } else {
          this.$refs.bottomLoading.$el.style.display = 'block'
        }
        this.result = finalArr
        // console.log(this.result)
      }).catch((err) => {
        console.log('搜索结果出现问题', err)
      })
    },
    // 上拉加载更更多数据
    scrollToBottomLoadingMore () {
      if (!this.LoadingMore) {
        return
      }
      this.page++
      this.showLoadingMoreZuJian = true
      // 继续加载更多数据
      getSearchResult(this.showSearchResult, this.catZhida, this.page).then((response) => {
        const songObj = response.data.data.song.list
        const singerObj = response.data.data.zhida
        const song = response.data.data.song
        let finalArr = []
        if (response.data.code === 0) {
          if (singerObj && singerObj.singerid) {
            finalArr.push({...singerObj, ...{type: 'singer'}})
          }
          if (songObj && songObj.length > 0) {
            finalArr = finalArr.concat(songObj)
          }
        }
        this.result = [...this.result, ...finalArr]
        console.log(this.result)
        // 判断是否还需要继续加载更多数据
        if (!song.list.length || song.curnum + song.curpage * 20 >= song.totalnum) {
          this.showLoadingMoreZuJian = false
          this.LoadingMore = false
          this.$refs.dataSearchFinal.style.display = 'block'
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击搜索到的列表的某一项，跳转到歌手详情页或播放歌曲的页面
    // 同时把点击的值，保存在vuex中的searchHistoryJiLu中，然后在历史组件中显示出来搜索记录
    goToSingerDetailOrPlaySong (item) {
      if (item.type === 'singer') {
        console.log('跳转到歌手详情页面')
        // vuex中state中的singer对象，需要的数据是avatar、id、name所以这里传递的属性名需要一致
        const singerObj = {}
        singerObj.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.jpg?max_age=2592000`
        singerObj.id = item.singermid
        singerObj.name = item.singername
        this.setSinger(singerObj)
        // 跳转到歌手详情页
        this.$router.push(`/search/detail/${item.singermid}`)
      } else {
        // 跳转到播放器页面
        // 把传入的数据调整为：album duration id image mid name singer url
        const oneSongerObj = {}
        oneSongerObj.album = item.albumname
        oneSongerObj.duration = item.interval
        oneSongerObj.id = item.songid
        oneSongerObj.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`
        oneSongerObj.mid = item.songmid
        oneSongerObj.name = item.songname
        oneSongerObj.singer = this.dealSinger(item.singer)
        // 应该是点击歌曲，点击上一首、点击下一首 的时候在获取对应的歌曲链接，我这里就一次性都获取到了，
        // 这样做的缺点是消耗流量，和用户体验不好，显示加载中的状态有点长,数据更新缓慢
        getplaysongvkey(item.songmid).then((response) => {
          // 有的歌曲没有vkey，所以得不到purl。所以自己手动获取filename和testfile2g，然后拼接成歌曲的url
          const purl = response.data.req_0.data.midurlinfo[0].purl
          if (item.albummid && item.songid && purl) {
            oneSongerObj.url = `http://isure.stream.qqmusic.qq.com/${purl}`
          }
        }).catch((err) => {
          console.log(err)
        })
        // 想vuex中的playlist和sequenceList数组中，插入点击的歌曲
        this.searchResultClickOneSongInsertAndToPlayPage(oneSongerObj)
      }
      // 同时把输入框输入的值，保存在vuex中的searchHistoryJiLu中，然后在搜索历史组件中显示出来搜索记录
      this.$emit('saveSearchHistory')
    },
    // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘
    myBeforeScrollStart () {
      this.$emit('myBeforeScrollStart')
    },
    // 解决mini播放器的自适应问题，父组件调用
    myRefresh () {
      this.$refs.suggest.refresh()
    }
  },
  watch: {
    // 搜索内容改变的时候，去获取数据，输入框数据的传递顺序：
    // search-kuang组件分发一个事件queryValue 到search组件
    // search组件设置一个变量showSearchResult接收传递过来的搜索值，然后把变量showSearchResult当成属性传递给search0result组件
    // search0result接收showSearchResult属性并且监视这个属性值的改变，然后调用getSearchResult方法获取搜索数据
    showSearchResult () {
      // if (this.showSearchResult === '') {
      //   this.LoadingMore = false
      //   return
      // }
      // 控制搜索结果页面的显示、隐藏
      if (this.showSearchResult === '') {
        this.$refs.suggest.$el.style.display = 'none'
        this.$refs.loading.$el.style.display = 'none'
        // console.log('请求结束')
        return
      } else {
        this.$refs.suggest.$el.style.display = 'block'
        this.$refs.loading.$el.style.display = 'block'
      }
      // 每次请求前把，result变成空数组，是为了显示loading加载组件
      this.result = []
      this.$refs.dataSearchFinal.style.display = 'none'
      this.$refs.bottomLoading.$el.style.display = 'none'
      // 搜索结果改变的时候，发起新的请求
      this.getSearch()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px 10px 30px
      .dataSearchFinal
        display inline-block
        width :100%
        text-align :center
        color: $color-text-d
        height 40px
        line-height 40px
      .suggest-item
        display: flex
        align-items: center
        /*padding-bottom: 20px*/
        line-height: 40px
        border-bottom :1px solid #000
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .searchLoading
      position :fixed
      top:50%
      bottom:0
      left:0
      right:0
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 42%
      transform: translateY(-50%)
</style>
