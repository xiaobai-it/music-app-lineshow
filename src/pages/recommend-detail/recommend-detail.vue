<template>
  <transition name="slide">
    <!--music-list组件-->
    <MusicList :singerName="singerName" :bgImg="bgImg" :musicData="musicData"></MusicList>
    <Loading title="玩命加载中..." v-if="!musicData"></Loading>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../../components/music-list/music-list'
import Loading from '../../components/loading/loading'
import {mapState} from 'vuex'
import {getTuiJianDeatalPageSongs, getplaysongvkey} from '../../api/allAPI'

export default {
  components: {
    MusicList,
    Loading
  },
  computed: {
    ...mapState(['oneHotGeDanTuiJianData']),
    singerName () {
      return this.oneHotGeDanTuiJianData.dissname
    },
    bgImg () {
      return this.oneHotGeDanTuiJianData.imgurl
    }
  },
  data () {
    return {
      musicData: []
    }
  },
  mounted () {
    // 获取路由中对应的dissid，请求后台获取对应的数据
    const dissid = this.oneHotGeDanTuiJianData.dissid
    // 数据不存在返回推荐主页
    if (!dissid) {
      this.$router.push('/recommend')
      return
    }
    getTuiJianDeatalPageSongs(dissid).then((response) => {
      // console.log(response.data)
      // console.log(response.data.cdlist[0].songlist)
      if (response.data.code === 0) {
        const songlist = response.data.cdlist[0].songlist
        // 对songlist进行处理，得到自己需要的数据
        songlist.forEach((item) => {
          let obj = {} // 创建一个对象保存需要的数据
          obj.id = item.id // 歌曲id
          obj.mid = item.mid // 歌曲mid
          obj.singer = this.dealSinger(item.singer) // 歌曲的歌手
          obj.name = item.name // 歌曲的名字
          obj.album = item.album.name // 歌曲的所属专辑
          obj.duration = item.interval // 歌曲的总时长
          obj.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.mid}.jpg?max_age=2592000`
          // 应该是点击歌曲，点击上一首、点击下一首 的时候在获取对应的歌曲链接，我这里就一次性都获取到了，
          // 这样做的缺点是小号流量，和用户体验不好，显示加载中的状态有点长，数据更新缓慢
          getplaysongvkey(item.mid).then((response) => {
            const purl = response.data.req_0.data.midurlinfo[0].purl
            obj.url = `http://isure.stream.qqmusic.qq.com/${purl}`
            if (item.album.mid && item.id) {
              this.musicData.push(obj)
            }
          }).catch((err) => {
            console.log(err)
          })
          // obj.url = ''
          // this.musicData.push(obj)
        })
        // console.log(this.musicData)
      }
    }).catch((err) => {
      console.log(err)
    })
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
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
