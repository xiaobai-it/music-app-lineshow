<template>
  <transition name="qwd">
    <!--歌手详情页面-->
    <div>
      <musicList :musicData="musicData" :bgImg="bgImg" :singer-name="singerName" ref="musicList"/>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex'

import {getSingerDetail, getplaysongvkey} from '../../api/allAPI'
import musicList from '../../components/music-list/music-list'

export default {
  components: {
    musicList
  },
  data() {
    return {
      musicData: [] // 把后台得到的数据进行处理，得到我自己想要的歌手详情
    }
  },
  mounted() {
    // 获取歌手对应的详情数据
    if (!this.singer.id) {
      this.$router.push('/singer')
    } else {
      getSingerDetail(this.singer.id)
        .then((respose) => {
          if (respose.code === 0) {
            const list = respose.data.list
            // console.log(list)
            // console.log(list[0]['musicData'].strMediaMid)

            // 把后台得到的数据进行处理，得到我自己想要的数据
            list.forEach((item) => {
              let obj = {} // 创建一个对象保存需要的数据
              obj.id = item.musicData.songid
              obj.mid = item.musicData.songmid
              obj.singer = this.dealSinger(item.musicData.singer)
              obj.name = item.musicData.songname
              obj.album = item.musicData.albumname
              obj.duration = item.musicData.interval
              obj.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`
              // obj.url = `https://api.bzqll.com/music/tencent/url?key=579621905&id=${item.musicData.songmid}&br=320`
              // 应该是点击歌曲，点击上一首、点击下一首 的时候在获取对应的歌曲链接，我这里就一次性都获取到了，
              // 这样做的缺点是小号流量，和用户体验不好，显示加载中的状态有点长,数据更新缓慢
              getplaysongvkey(item.musicData.songmid).then((response) => {
                // 有的歌曲没有vkey，所以得不到purl。所以自己手动获取filename和testfile2g，然后拼接成歌曲的url
                const purl = response.data.req_0.data.midurlinfo[0].purl
                obj.url = `http://isure.stream.qqmusic.qq.com/${purl}`
                // const filename = response.data.req_0.data.midurlinfo[0].filename
                // const testfile2g = response.data.req_0.data.testfile2g.substr(23)
                // obj.url = `http://isure.stream.qqmusic.qq.com/${filename}?${testfile2g}`
                if (item.musicData.albummid && item.musicData.songid) {
                  this.musicData.push(obj)
                }
              }).catch((err) => {
                console.log(err)
              })
            })
            // console.log(this.singer)
            // console.log(this.musicData)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState(['singer']), // 从vuex中获取点击的某一个歌手的信
    // 传递给music-list的属性
    bgImg() {
      return this.singer.avatar
    },
    // 传递给music-list的属性
    singerName() {
      return this.singer.name
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
    musicData () {
      const bottom = this.musicData.length > 0 ? '60px' : ''
      // 找到musicList组件的子元素需要滚动的div，设置bottom为60px
      // this.$refs.musicList.$el.style.bottom = bottom
      this.$refs.musicList.$children[0].$el.style.bottom = bottom
      this.$refs.musicList.singerDetailDiaoYong()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
  .qwd-enter-active, .qwd-leave-active
    transition: all 0.5s ease

  .qwd-enter, .qwd-leave-to
    transform: translate(100%, 0)
</style>
