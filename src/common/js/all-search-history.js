import goodStoroge from 'good-storage'

export function saveSearchHistory(searchValue) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('mySearchHistory', [])
  // 对搜索记录的总数和顺序进行规定
  // 找到新的搜索值，在本地缓存中的数组中，对应的索引
  let index = finalSearch.findIndex((item) => {
    return item === searchValue
  })
  if (index === 0) { // 本地缓存中的数组中的第一条数据
    return
  }
  if (index > 0) { // 存在的索引不是第一个，把它删除
    finalSearch.splice(index, 1)
  }
  // 向数组的第一个位置，插入最新的搜索记录
  finalSearch.unshift(searchValue)
  // 数组中的搜搜距离大于20条，全部去掉，只留20条
  if (finalSearch.length > 20) {
    finalSearch.pop()
  }
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('mySearchHistory', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// vuex初始化的时候，获取之前本地已经存储的搜索记录
export function getSearchHistoryFromLocalStroage() {
  return goodStoroge.get('mySearchHistory', [])
}
// 在vuex中的searchHistoryJiLu和本地缓存localstorage中，删除一条搜索记录
export function deleteOneSearchHistoryJiLU({delateItem, index}) {
  // 读取本地缓存的值
  let finalSearch = goodStoroge.get('mySearchHistory', [])
  // 删除一条记录
  finalSearch.splice(index, 1)
  // 把删除后的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('mySearchHistory', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// 在vuex中的searchHistoryJiLu和本地缓存localstorage中，删除所有搜索记录
export function deleteAllSearchHistoryJiLU() {
  // 删除所有本地缓存的值
  goodStoroge.remove('mySearchHistory')

  return [] // 返回vuex一个空数组
}

export function savePlaySongsRecently(currentPlaySong) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('savePlaySongsRecently', [])
  // 对搜索记录的总数和顺序进行规定
  // 找到新的搜索值，在本地缓存中的数组中，对应的索引
  let index = finalSearch.findIndex((item) => {
    return item.id === currentPlaySong.id
  })
  if (index === 0) { // 本地缓存中的数组中的第一条数据
    return
  }
  if (index > 0) { // 存在的索引不是第一个，把它删除
    finalSearch.splice(index, 1)
  }
  // 向数组的第一个位置，插入最新的搜索记录
  finalSearch.unshift(currentPlaySong)
  // 数组中的搜搜距离大于50条，全部去掉，只留50条
  if (finalSearch.length > 50) {
    finalSearch.pop()
  }
  // 把最新的搜索记录保存到本地缓存的savePlaySongsRecently数组中
  goodStoroge.set('savePlaySongsRecently', finalSearch)

  return finalSearch // 返回是最近播放歌曲的数组
}
// vuex初始化的时候，获取之前本地已经存储的搜索记录
export function getSavePlaySongsRecently() {
  return goodStoroge.get('savePlaySongsRecently', [])
}

// 保存收藏歌曲
export function saveCollectionSong(currentSong) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('collectionSong', [])
  // // 找到播放歌曲，在本地缓存中的数组中，对应的索引
  // let index = finalSearch.findIndex((item) => {
  //   return item.id === currentSong.id
  // })
  // if (index === 0) { // 本地缓存中的数组中的第一条数据
  //   return
  // }
  // if (index > 0) { // 存在的索引不是第一个，把它删除
  //   finalSearch.splice(index, 1)
  // }
  // 向数组的第一个位置，插入收藏的歌曲
  finalSearch.unshift(currentSong)
  // 数组中的收藏歌曲大于500条，全部去掉，只留500条
  if (finalSearch.length > 500) {
    finalSearch.pop()
  }
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('collectionSong', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}

// 删除收藏收藏歌曲
export function deleteCollectionSong(currentSong) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('collectionSong', [])
  // 找到当前播放的歌曲，在本地缓存中的数组中，对应的索引
  let index = finalSearch.findIndex((item) => {
    return item.id === currentSong.id
  })
  if (index !== -1) { // 存在的索引不是-1，把它删除
    finalSearch.splice(index, 1)
  }
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('collectionSong', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// 初始化的时候vuex中获取收藏的歌曲
export function getCollectionSong() {
  // 获取本地缓存的值
  return goodStoroge.get('collectionSong', [])
}
// 保存当前播放歌词的颜色的索引
export function saveCurrentLyricColor({index, text}) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('currentLyricColor', [])

  if (finalSearch.length > 0) {
    finalSearch.splice(0, 1)
  }

  finalSearch.push({index, text})
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('currentLyricColor', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// 初始化的时候vuex中获取当前播放歌词的颜色的索引
export function getCurrentLyricColor() {
  // 获取本地缓存的值
  return goodStoroge.get('currentLyricColor', [])
}
// 保存改变歌词大小的进度条的长度的数值
export function saveLyricProgressLen(finalLyricSize) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('LyricProgressLen', [])

  if (finalSearch.length > 0) {
    finalSearch.splice(0, 1)
  }

  finalSearch.push(finalLyricSize)
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('LyricProgressLen', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// 初始化的时候vuex中获取当前播放歌词的颜色的索引
export function getLyricProgressLen() {
  // 获取本地缓存的值
  return goodStoroge.get('LyricProgressLen', [])
}
