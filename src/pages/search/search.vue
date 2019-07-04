<template>
  <div class="search">
    <!--搜索页面-->
    <div class="search-box-wrapper">
      <!--搜索框组件-->
      <Searchkuang ref="searchkuang" @queryValue="queryValue"/>
    </div>
    <div class="shortcut-wrapper" v-show="!showSearchResult || showSearchResult === ''" ref="shortcutWrapper">
      <Scroll class="shortcut" :data="shortcut" :sleepRefresh="sleepRefresh" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul v-if="hotKey">
              <li class="item" v-for="(item, index) in hotKey" :key="index" @click="andSearchToInput(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-if="searchHistoryJiLu && searchHistoryJiLu.length > 0  && searchHistoryJiLu !== undefined ">
            <h1 class="title">
              <span class="text">
                搜索历史 {{searchHistoryJiLu.length > 0 && searchHistoryJiLu !== undefined ? searchHistoryJiLu.length : '0'}} / 20
              </span>
              <span class="clear" @click.stop="deleteAllSearchHistory">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!--显示搜索历史记录的组件-->
            <SearchHistoryList :searchHistoryJiLu="searchHistoryJiLu"
                               @clickOneSearchHistory="clickOneSearchHistory"
                               @deleteOneSearchHistory="deleteOneSearchHistory"/>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" v-show="showSearchResult && showSearchResult !== ''" ref="searchResult">
      <!--显示搜索结果的组件-->
      <SearchResult :showSearchResult="showSearchResult"
                    @myBeforeScrollStart="myBeforeScrollStart"
                    @saveSearchHistory="saveSearchHistory" ref="SearchResult"/>
    </div>
    <Confirm text="确认清空所有搜索历史？" confirmBtnText="清空" ref="confirm" @confirm="confirm"/>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import PubSub from 'pubsub-js'

import Searchkuang from '../../components/search-kuang/search-kuang'
import SearchResult from '../../components/search-result/search-result'
import SearchHistoryList from '../../components/search-history-list/search-history-list'
import Confirm from '../../components/confirm/confirm'
import Scroll from '../../components/scroll/scroll'
import {getHotKey} from '../../api/allAPI'
import {mapActions, mapState} from 'vuex'

export default {
  components: {
    Searchkuang,
    SearchResult,
    SearchHistoryList,
    Confirm,
    Scroll
  },
  data() {
    return {
      hotKey: [], // 热门搜索数据
      showSearchResult: '', // 输入框输入的数据
      searchHistoryValue: '', // 保存点击搜索历史中某一条数据
      sleepRefresh: 100 // scroll组件调用refresh方法的延时时间
    }
  },
  mounted() {
    // 解决第一次mini播放器出来的时候，界面不能滚动的问题，事件是由tab组件传递过来的
    PubSub.subscribe('clickSearchNav', (msg, data) => {
      setTimeout(() => {
        // 搜索首页距离mini播放器60px
        const bottom = !this.fullScreen ? '60px' : '0'
        if (this.$refs.shortcutWrapper) {
          this.$refs.shortcutWrapper.style.bottom = bottom
          this.$refs.shortcut.refresh()
        }
      }, 20)
    })
    // 获取搜索首页下的热门搜索内的后台数据的函数
    getHotKey().then((response) => {
      if (response.code === 0) {
        this.hotKey = response.data.hotkey.slice(0, 10)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapState(['searchHistoryJiLu', 'fullScreen']),
    shortcut () {
      // console.log(this.searchHistoryJiLu)
      return this.hotKey.concat(this.searchHistoryJiLu)
    }
  },
  methods: {
    ...mapActions(['saveSearchHistoryJiLU', 'deleteOneSearchHistoryJiLU', 'deleteAllSearchHistoryJiLU']),
    // 点击热门搜索，把值添加到搜索框内
    andSearchToInput(value) {
      this.$refs.searchkuang.andSearchToInput(value)
    },
    // search-kuang组件传递过来的函数，保存输入框输入的值
    queryValue(newQuery) {
      this.showSearchResult = newQuery
    },
    // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘
    myBeforeScrollStart() {
      this.$refs.searchkuang.blurInput()
    },
    // 把搜框输入的值，保存在vuex中的searchHistoryJiLu中，然后在历史组件中显示出来搜索记录
    saveSearchHistory() {
      this.saveSearchHistoryJiLU(this.showSearchResult)
      // showSearchResult
    },
    // 点击某一个搜索记录
    clickOneSearchHistory(item) {
      // 把点击的历史记录的一条赋值给showSearchResult，让seract-result组件去搜索数据
      this.showSearchResult = item
      // 把点击的历史记录的一条赋值给input框
      this.$refs.searchkuang.andSearchToInput(item)
    },
    // 删除某一个记录
    deleteOneSearchHistory({delateItem, index}) {
      // 调用vuex中的actions.js文件中的方法，删除点击的历史记录
      this.deleteOneSearchHistoryJiLU({delateItem, index})
    },
    // 打开确认框
    deleteAllSearchHistory () {
      this.$refs.confirm.show()
    },
    // 删除全部历史记录
    confirm () {
      this.deleteAllSearchHistoryJiLU()
    }
  },
  watch: {
    // 监视mini播放器是否显示，解决迷你播放器和页面的自适应
    fullScreen () {
      // 搜索首页距离mini播放器60px
      const bottom = !this.fullScreen ? '60px' : '0'
      setTimeout(() => {
        if (this.$refs.shortcutWrapper) {
          this.$refs.shortcutWrapper.style.bottom = bottom
          this.$refs.shortcut.refresh()
        }
        // 搜索结果页面距离mini播放器60px
        if (this.$refs.searchResult) {
          this.$refs.searchResult.style.bottom = bottom
          this.$refs.SearchResult.myRefresh()
        }
      }, 20)
    },
    // 第一次mini播放器出来的时候，界面不能滚动的处理办法
    showSearchResult (newValue) {
      if (!newValue) {
        setTimeout(() => {
          this.$refs.shortcutWrapper.style.display = 'block'
          this.$refs.searchResult.style.display = 'none'
          this.$refs.shortcut.refresh()
        }, 20)
      } else {
        setTimeout(() => {
          this.$refs.shortcutWrapper.style.display = 'none'
          this.$refs.searchResult.style.display = 'block'
        }, 20)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      z-index: 10
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          z-index: 9
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
