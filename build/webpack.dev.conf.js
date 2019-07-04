'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// 配置代理1，解决请求QQ音乐获取数据的跨域问题
// 获取推荐页面,热门歌单对应的后台数据的跨域问题
//声明变量接收express组件
const express = require('express')
const axios = require('axios')
//请求server，赋值express函数
var app = express()
//配置路由文件
var apiRoutes = express.Router()
//通过路由请求数据
app.use('/api',apiRoutes)


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // 配置代理1，解决请求QQ音乐获取数据的跨域问题
    before(apiRoutes){
      apiRoutes.get('/api/getHotGeDan', (req, res) => {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url,{
          headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
          params: req.query
        }).then((response)=>{
          res.json(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      }),
        // 获取从歌手界面点击的歌曲的歌词
      apiRoutes.get('/api/lyric', (req, res) => {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url,{
          headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
          params: req.query
        }).then((response)=>{
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
        }).catch((err)=>{
          console.log(err)
        })
      }),
        // 获取推荐页面下的详情页面内的歌曲列表的后台数据的函数
      apiRoutes.get('/api/getTuiJianDeatalPageSongs', (req, res) => {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url,{
          headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
          params: req.query
        }).then((response)=>{
          res.json(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      }),
      // 点击播放歌曲的时候，需要一个vkey，下面的函数就是获取vkey的
      apiRoutes.get('/api/getplaysongvkey', (req, res) => {
          var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
          axios.get(url,{
            // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
            headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/portal/player.html'},
            params: req.query
          }).then((response)=>{
            res.json(response.data)
          }).catch((err)=>{
            console.log(err)
          })
        })
      // 获取排行首页对应的后台数据的函数-QQ移动端
      apiRoutes.get('/api/getTopLst', (req, res) => {
        var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
        axios.get(url,{
          // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
          headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/portal/player.html'},
          params: req.query
        }).then((response)=>{
          res.json(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      }),
      // 接收到搜索框内的数据后，search-result组件内发起请求，获取对应的后台数据
      apiRoutes.get('/api/getSearchResult', (req, res) => {
          var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
          axios.get(url,{
            // headers: {referer: 'https://c.y.qq.com/',  host: 'c.y.qq.com'},
            headers: {origin: 'https://y.qq.com', referer: 'https://y.qq.com/m/index.html'},
            params: req.query
          }).then((response)=>{
            console.log(response)
            res.json(response.data)
          }).catch((err)=>{
            console.log(err)
          })
        })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
