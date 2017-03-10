import { authenticate, httpTransport } from 'plug-auth-client'

const API_URL = 'https://rs.extplug.com'

export default class Storage {
  constructor () {
    this.token = authenticate({
      transport: httpTransport({ url: `${API_URL}/auth` })
    }).then((result) => result.token)
  }

  saveSettings (room, settings) {
    return this.token.then((token) =>
      fetch(`${API_URL}/${room}`, {
        method: 'PUT',
        headers: {
          authorization: `JWT ${token}`,
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
    )
  }

  saveStyles (room, cssText) {
    return this.token.then((token) =>
      fetch(`${API_URL}/${room}.css`, {
        method: 'PUT',
        headers: {
          authorization: `JWT ${token}`,
          accept: 'application/json',
          'content-type': 'text/css'
        },
        body: cssText
      })
    )
  }
}
