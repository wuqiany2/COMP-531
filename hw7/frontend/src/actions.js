import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'

//export const url = 'https://webdev-dummy.herokuapp.com'
export const url = 'https://qw12backendserver.herokuapp.com'

export const resource = (method, endpoint, payload, isJson=true) => {
  const options =  {
    method,
    credentials: 'include'
  }

  if (isJson) options.headers = {'Content-type':'application/json'}

  if (payload) options.body = isJson? JSON.stringify(payload) : payload


  return fetch(`${url}/${endpoint}`, options)
    .then(r => {
      if (r.status === 200) {
        return (r.headers.get('Content-Type').indexOf('json') > 0) ? r.json() : r.text()
      } else {
        // useful for debugging, but remove in production
        //console.error(`${method} ${endpoint} ${r.statusText}`)
        throw new Error(r.statusText)
      }
    })
}


export default resource