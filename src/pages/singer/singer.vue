<template>
  <div class="singer" ref="singer">
    <!--歌手页面-->
    <Listview :singerList="singerList" @goToDetail="goToDetail" ref="listviewzujian"/>
    <!--展示歌手详情页面-->
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'
import PubSub from 'pubsub-js'

import {getSingerList} from '../../api/allAPI'
import Listview from '../../components/listview/listview'

export default {
  components: {
    Listview
  },
  data() {
    return {
      singerList: []
    }
  },
  mounted() {
    // 解决第一次mini播放器出来的时候，界面不能滚动的问题，事件是由tab组件传递过来的
    PubSub.subscribe('clickSingerNav', (msg, data) => {
      setTimeout(() => {
        const bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.listviewzujian.listViewRefresh()
      }, 20)
    })
    this.loadingSingerData()
  },
  methods: {
    ...mapActions(['setSinger']),
    // 获取后台的歌手信息
    loadingSingerData() {
      // 获取后台的歌手信息
      getSingerList().then((response) => {
        if (response.code === 0) {
          this.singerList = response.data.list
          // 对得到的数据，进行处理，得到最终我们希望显示的样式数据
          let finallData = {
            hot: {
              title: '热门',
              itemData: []
            }
          }
          this.singerList.forEach((item, index) => {
            if (index < 10) {
              finallData.hot.itemData.push({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
              })
            }
            const key = item.Findex
            if (!finallData[key]) {
              finallData[key] = {
                title: key,
                itemData: []
              }
            }
            finallData[key].itemData.push({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          })
          // 上面得到的数据就是我们想要的数据，但是因为是对象，所以是无序的，还要变成数组，因为是数组是有序的
          // console.log(finallData)
          let hotArr = []
          let otherArr = []
          for (let key in finallData) {
            if (finallData[key].title.match(/[a-zA-Z]/)) {
              otherArr.push(finallData[key])
            } else if (finallData[key].title === '热门') {
              hotArr.push(finallData[key])
            }
          }
          // 对otherArr进行排序变成A到Z的顺序
          otherArr.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
          this.singerList = hotArr.concat(otherArr)
          // console.log(this.singerList)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 跳转到歌手详情页
    goToDetail(singerItem) {
      // console.log(singerItem)
      this.$router.push(`/singer/detail/${singerItem.id}`)
      this.setSinger(singerItem)
    }
  },
  computed: {
    ...mapState(['playList'])
  },
  watch: {
    // 监视playList歌曲数组的变化，如果数组长度大于0，让其最外面的div的bottom为60，解决迷你播放器和页面的自适应
    playList () {
      // scroll滚动没有反应，妈的什么情况
      const bottom = this.playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listviewzujian.listViewRefresh()
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
