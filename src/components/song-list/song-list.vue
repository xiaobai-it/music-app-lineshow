<template>
  <!--通用的歌曲列表组件-->
  <div class="song-list">
    <ul v-if="musicData && musicData.length > 0 && musicData !== undefined">
      <li class="item" v-for="(item, index) in musicData" :key="index" @click="clickOneSong(item,index)">
        <div class="rank" v-if="rank">
          <span :class="showRankImg(index)" v-if="index < 3"></span>
          <span :class="showRankImg(index)" v-else>{{index + 1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">歌手:{{item.singer}} / 所属专辑:{{item.album}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    musicData: { // 歌曲列表数组
      type: Array,
      default: null
    },
    rank: { // 是否显示左侧排名
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    clickOneSong(item, index) {
      this.$emit('clickOneSong', item, index)
    },
    showRankImg (index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height:60px
      font-size:$font-size-medium
      border-bottom :1px solid #000
      .content
        flex:1
        align-items: center
        .name
          padding :0 0 10px 0
          font-size :$font-size-small
        .desc
          font-size :$font-size-small
          color :$color-dialog-background
      .rank
        flex :0 0 15px
        width :25px
        margin-right: 15px
        text-align: center
        .icon
          display :inline-block
          width: 17px
          height:17px
          background-size:17px 17px
          &.icon0
            background-image : url("./first@2x.png")
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size :$font-size-large
</style>
