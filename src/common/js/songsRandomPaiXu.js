export function songsRandomPaiXu(songsArr) {
  let newSongArr = songsArr.slice()
  for (var i = 0; i < newSongArr.length; i++) {
    let j = getRandomIndex(0, i)
    let temp = newSongArr[i]
    newSongArr[i] = newSongArr[j]
    newSongArr[j] = temp
  }
  return newSongArr
}

function getRandomIndex(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}
