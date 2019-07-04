<template>
  <div class="search-list" v-if="searchHistoryJiLu && searchHistoryJiLu.length > 0 && searchHistoryJiLu !== undefined">
  <!--<div class="search-list" v-if="searchHistoryJiLu">-->
    <transition-group name="list" tag="ul">
    <li class="search-item"
        v-for="(item, index) in searchHistoryJiLu" :key="index" @click="clickOneSearchHistory(item,index)">
      <span class="text">{{item}}</span>
      <span class="icon" @click.stop="deleteOneSearchHistory({delateItem:item, index})">
        <i class="icon-delete"></i>
      </span>
    </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searchHistoryJiLu: {
      type: Array,
      default: null
    }
  },
  methods: {
    // 点击某一个搜索记录
    clickOneSearchHistory(item, index) {
      this.$emit('clickOneSearchHistory', item)
    },
    // 删除摸一个记录
    deleteOneSearchHistory({delateItem, index}) {
      this.$emit('deleteOneSearchHistory', {delateItem, index})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      border-bottom : 1px solid #000
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
