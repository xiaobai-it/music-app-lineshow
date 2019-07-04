import jsonp from '../common/js/jsonp'
import axios from 'axios'

// 获取推荐页面,轮播图对应的后台数据的函数
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取推荐页面,热门歌单对应的后台数据的函数
export function getHotGeDan() {
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // 正常访问QQAPI失败，因此用的webpack的代理解决的，在build/webpack.dev.conf.js里配置
  const url = '/api/getHotGeDan'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sin: 0,
    ein: 19
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

// 获取歌手页面对应的后台数据的函数
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取歌手详情对应的后台数据的函数
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    ct: 24,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 100
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取歌曲的歌词对应的后台数据的函数
export function getLyric(mid) {
  // 正常访问QQ音乐歌词API失败，因此用的webpack的代理解决的，在build/webpack.dev.conf.js里配置
  const url = '/api/lyric'
  const queryParams = {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

// 获取推荐页面下的详情页面内的歌曲列表的后台数据的函数
export function getTuiJianDeatalPageSongs(dissid) {
  // 再次跨域了，正常请求请求不到数据
  // const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const url = '/api/getTuiJianDeatalPageSongs'
  const queryParams = {
    disstid: dissid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    needNewCode: 0,
    new_format: 1,
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json'
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
// 点击播放歌曲的时候，需要一个vkey，下面的函数就是获取vkey的
// 参考网址：https://blog.csdn.net/xiayiye5/article/details/79487560
// http://ws.stream.qqmusic.qq.com/${item.musicData.songid}.m4a?fromtag=46
// https://api.bzqll.com/music/tencent/url?key=579621905&id=${item.musicData.songmid}br=320
// https://api.bzqll.com/music/tencent/url?key=579621905&id=${item.musicData.songmid}&br=320
// 上面3种，目前都不可用了
// http://isure.stream.qqmusic.qq.com/C400000nIGM005K6oC.m4a?guid=9092958176&vkey=03BC619A4AF3A01B610B35CBD108367451EAE304B38ACC84CEDCE84223745DA2024B5A6FEA86EA0DFDD184A6DDDF3905542F4F76660176C2&uin=0&fromtag=66
export function getplaysongvkey(songmid) {
  // 再次跨域了，正常请求请求不到数据
  // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey4780514060559309&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22req%22%3A%7B%22module%22%3A%22CDN.SrfCdnDispatchServer%22%2C%22method%22%3A%22GetCdnDispatch%22%2C%22param%22%3A%7B%22guid%22%3A%229092958176%22%2C%22calltype%22%3A0%2C%22userip%22%3A%22%22%7D%7D%2C%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%229092958176%22%2C%22songmid%22%3A%5B%22002mZevo3wHvsc%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%220%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A0%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D'
  const url = '/api/getplaysongvkey'
  const queryParams = {
    // -: 'getplaysongvkey7257571376863041',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"9092958176","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"9092958176","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
// 获取排行首页对应的后台数据的函数-QQ移动端
export function getTopLst() {
  // 再次跨域了，正常请求请求不到数据
  // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const url = '/api/getTopLst'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
// 点击排行首页对应某一个方框，获取对应的歌曲后台数据的函数-QQ移动端 --排行详情页
export function getTopLstDetail(detailId) {
  // const url = 'https://c.y.qq.com/portalcgi/fcgi-bin/music_mini_portal/fcg_getuser_infoEx.fcg'
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    // source: 4001,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: detailId
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}

// 获取搜索首页下的热门搜索内的的后台数据的函数
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 接收到搜索框内的数据后，search-result组件内发起请求，获取对应的后台数据
export function getSearchResult(queryValue, catZhida, page) {
  // 再次跨域了，正常请求请求不到数据
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = '/api/getSearchResult'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: queryValue, // 查询的数据
    zhidaqu: 1,
    // catZhida: 1, // 是否显示歌手
    catZhida: catZhida ? 1 : 0, // 是否显示歌手
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: page, // 查询第几页的数据
    remoteplace: 'txt.mqq.all'
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
