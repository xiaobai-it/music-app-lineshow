import {playMode} from '../common/js/playModeConfig' // 播放器的播放模式配置
import {getSearchHistoryFromLocalStroage,
  getSavePlaySongsRecently, getCollectionSong,
  getCurrentLyricColor, getLyricProgressLen} from '../common/js/all-search-history' // vuex初始化的时候，获取之前本地已经存储的搜索记录

const state = {
  singer: {}, // 歌手数据
  playing: false, // 歌曲是否在播放
  fullScreen: false, // 是否全屏播放
  playList: [], // 播放歌曲的数组，有三种:顺序、随机、单曲循环
  sequenceList: [], // 顺序播放歌曲的数组
  mode: playMode.sequence, // 默认顺序播放
  currentIndex: -1, // 当前歌曲播的索引,当前播放的歌曲（currentSong），通过vuex的计算属性getters获取
  oneHotGeDanTuiJianData: {}, // 推荐首页界面中,某一个热门歌单推荐的数据
  oneTopList: {}, // 排行首页界面中,某一个排行的数据
  searchHistoryJiLu: getSearchHistoryFromLocalStroage(), // 搜索的历史记录，只留10条，多余的全部删除,从本地缓存中读取数据，否则一刷新，初始数据始终为0
  savePlaySongsRecently: getSavePlaySongsRecently(), // 保存最近播歌曲的数组，只保留50条多的删除
  saveCollectionOrQuXiaoCollectionSong: getCollectionSong(), // 保存收藏、取消收藏歌曲
  saveLyricColor: getCurrentLyricColor(), // 保存当前播放歌词的颜色的索引
  saveLyricFontSize: getLyricProgressLen() // 保存歌词的大小
}
export default state
