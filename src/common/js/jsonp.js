import originJsonp from 'jsonp'

// 封装jsonp让其可以实现promise语法
export default function jsonp(url, queryParams, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(queryParams)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
