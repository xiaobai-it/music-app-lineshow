
const getters = {
  // 得到当前正在播放的歌曲
  currentSong (state) {
    return state.playList[state.currentIndex] || {}
  }
}
export default getters
