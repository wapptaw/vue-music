export default async function (url, {method, params} = {method: 'GET', params: null}) {
  try {
    // 拼接url
    let paramsStr = ''
    if (method === 'GET') {
      if (params) {
        let arr = []
        for (let v in params) {
          arr.push(`${v}=${params[v]}`)
        }
        paramsStr = arr.join('&')
      }
      url += `?${paramsStr}` // 拼接url
    }
    // 使用fetch
    if (fetch) {
      let options = {}
      if (method === 'GET') {
        options = {
          method,
          credentials: 'include'
        }
      } else if (method === 'post') {
        options = {
          method,
          credentials: 'include',
          headers: new Headers({
            'Accept': 'application/json'
          }),
          body: paramsStr
        }
      }
      let res = await fetch(url, options)
      return res.json()
    } else {
      // 使用XMLHttpRequest
      let res = new Promise((resolve) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(xhr.response)
            } else {
              resolve(xhr.statusText)
            }
          }
        }
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.send(paramsStr)
      })
      return res
    }
  } catch (e) {
    throw new Error(e)
  }
}