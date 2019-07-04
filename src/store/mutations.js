import {SET_SINNER, SET_PLAYING, SET_FULLSCREEN,
  SET_PLAYLIST, SET_SEQUENCELIST, SET_MODE, SET_CURRENTINDEX,
  SET_HOTGEDANTUIJIANDATAACTIONS, SET_ONETOPLIST,
  SET_SAVESEARCHHISTORYJILU, SET_SAVETHESONGSRECENTLY,
  SET_SAVECOLLECTIONSONG, SET_DELETECOLLECTIONSONG,
  SET_STARTSAVELYRICCOLOR, SET_STARTSAVELYRICPROGRESSLEN} from './actions-types'

const mutations = {
  [SET_SINNER] (state, {singerData}) {
    state.singer = singerData
  },
  [SET_PLAYING] (state, isPlaying) { // true or false
    state.playing = isPlaying
  },
  [SET_FULLSCREEN] (state, isFullScreen) { // true or false
    state.fullScreen = isFullScreen
  },
  [SET_PLAYLIST] (state, {musicData}) {
    state.playList = musicData
  },
  [SET_SEQUENCELIST] (state, {musicData}) {
    state.sequenceList = musicData
  },
  [SET_MODE] (state, {mode}) {
    state.mode = mode
  },
  [SET_CURRENTINDEX] (state, {index}) {
    state.currentIndex = index
  },
  [SET_HOTGEDANTUIJIANDATAACTIONS] (state, hotGeDanTuiJianDataActions) {
    state.oneHotGeDanTuiJianData = hotGeDanTuiJianDataActions
  },
  [SET_ONETOPLIST] (state, oneTopList) {
    state.oneTopList = oneTopList
  },
  [SET_SAVESEARCHHISTORYJILU] (state, searchHistoryArr) {
    state.searchHistoryJiLu = searchHistoryArr
  },
  [SET_SAVETHESONGSRECENTLY] (state, finalSongsRecently) {
    state.savePlaySongsRecently = finalSongsRecently
  },
  [SET_SAVECOLLECTIONSONG] (state, finalCollectionSongArr) {
    state.saveCollectionOrQuXiaoCollectionSong = finalCollectionSongArr
  },
  [SET_DELETECOLLECTIONSONG] (state, finalCollectionSongArr) {
    state.saveCollectionOrQuXiaoCollectionSong = finalCollectionSongArr
  },
  [SET_STARTSAVELYRICCOLOR] (state, finalSaveCurrentLyricColor) {
    state.saveLyricColor = finalSaveCurrentLyricColor
  },
  [SET_STARTSAVELYRICPROGRESSLEN] (state, finalSaveLyricProgressLen) {
    state.saveLyricFontSize = finalSaveLyricProgressLen
  }
}
export default mutations
