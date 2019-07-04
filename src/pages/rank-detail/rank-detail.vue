<template>
  <transition name="slide">
    <MusicList :rank="rank" :singerName="singerName" :bgImg="bgImg" :musicData="musicData" ref="musicList"></MusicList>
    <Loading title="玩命加载中..." v-if="!musicData"></Loading>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import Loading from '../../components/loading/loading'
import MusicList from '../../components/music-list/music-list'
import {getTopLstDetail, getplaysongvkey} from '../../api/allAPI'

export default {
  components: {
    Loading,
    MusicList
  },
  data() {
    return {
      musicData: [], // 排行详情页的某一个数据
      rank: true // 是否显示song-list组件中的左侧数字
    }
  },
  mounted () {
    // 根据oneTopList.id 获取对应的歌曲详情数据
    if (!this.oneTopList.id) {
      this.$router.push('/rank')
      return
    }
    getTopLstDetail(this.oneTopList.id).then((response) => {
      if (response.code === 0) {
        // console.log(response)
        const songlist = response.songlist
        // 对songlist进行处理，得到自己需要的数据
        songlist.forEach((item) => {
          let obj = {} // 创建一个对象保存需要的数据
          obj.id = item.data.songid // 歌曲id
          obj.mid = item.data.songmid // 歌曲mid
          obj.singer = this.dealSinger(item.data.singer) // 歌曲的歌手
          obj.name = item.data.songname // 歌曲的名字
          obj.album = item.data.albumname // 歌曲的所属专辑
          obj.duration = item.data.interval // 歌曲的总时长
          obj.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.data.albummid}.jpg?max_age=2592000`
          // 应该是点击歌曲，点击上一首、点击下一首 的时候在获取对应的歌曲链接，我这里就一次性都获取到了，
          // 这样做的缺点是小号流量，和用户体验不好，显示加载中的状态有点长，数据更新缓慢
          getplaysongvkey(item.data.songmid).then((response) => {
            const purl = response.data.req_0.data.midurlinfo[0].purl
            obj.url = `http://isure.stream.qqmusic.qq.com/${purl}`
            if (item.data.albummid && item.data.songid) {
              this.musicData.push(obj)
            }
          }).catch((err) => {
            console.log(err)
          })
        })
        // console.log(this.musicData)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapState(['oneTopList']),
    singerName () {
      return this.oneTopList.topTitle
    },
    bgImg () {
      if (this.musicData.length > 0) {
        return this.musicData[0].image
      } else {
        return this.oneTopList.picUrl
      }
    }
  },
  methods: {
    // 把后台得到的数据中歌手名字进行处理，返回字符串
    dealSinger(singers) {
      let singerStr = []
      singers.forEach((singer) => {
        singerStr.push(singer.name)
      })
      return singerStr.join('/')
    }
  },
  watch: {
    // 监视playList歌曲数组的变化，如果数组长度大于0，让其最外面的div的bottom为60，解决迷你播放器和页面的自适应
    // scroll滚动没有反应，于是监视fullScreen的状态改变 ，应该是swiper 和scroll 的冲突问题，待处理？？？？？？
    musicData () {
      const bottom = !this.fullScreen ? '60px' : ''
      // 找到musicList组件的子元素需要滚动的div，设置bottom为60px
      // this.$refs.musicList.$el.style.bottom = bottom
      this.$refs.musicList.$children[0].$el.style.bottom = bottom
      this.$refs.musicList.singerDetailDiaoYong()
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
