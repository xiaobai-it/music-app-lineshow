// vue完成项目后，如何打包成静态文件，并且用Node调试?
// https://www.cnblogs.com/zhaobao1830/p/6431287.html

var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

// 配置代理1，解决请求QQ音乐获取数据的跨域问题
apiRoutes.get('/getHotGeDan', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {referer: 'https://c.y.qq.com/', host: 'c.y.qq.com'},
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})
// 获取从歌手界面点击的歌曲的歌词
apiRoutes.get('/lyric', function(req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {referer: 'https://c.y.qq.com/', host: 'c.y.qq.com'},
    params: req.query
  }).then((response) => {
    var serverData = response.data
    if (typeof serverData === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/ // 把歌词进行格式化，返回json格式的数据。否则不能用
      var macthes = serverData.match(reg)
      if (macthes) {
        serverData = JSON.parse(macthes[1])
      }
    }
    // res.json(response.data)
    res.json(serverData)
  }).catch((err) => {
    console.log(err)
  })
})
// 获取推荐页面下的详情页面内的歌曲列表的后台数据的函数
apiRoutes.get('/getTuiJianDeatalPageSongs', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {referer: 'https://c.y.qq.com/', host: 'c.y.qq.com'},
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})
// 点击播放歌曲的时候，需要一个vkey，下面的函数就是获取vkey的
apiRoutes.get('/getplaysongvkey', function(req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.get(url, {
    // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
    headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/portal/player.html'},
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})
// 获取排行首页对应的后台数据的函数-QQ移动端
apiRoutes.get('/getTopLst', function(req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
    headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/portal/player.html'},
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})
// 接收到搜索框内的数据后，search-result组件内发起请求，获取对应的后台数据
apiRoutes.get('/getSearchResult', function(req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
    headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/m/index.html'},
    params: req.query
  }).then((response) => {
    console.log(response)
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

//通过路由请求数据
app.use('/api', apiRoutes)

// 配置静态资源
app.use(express.static('./dist'))
// 监听服务器
var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('自己写的小服务器，端口号9000已经启动!' + '\n')
  console.log('http://localhost:' + port + '\n')
})
