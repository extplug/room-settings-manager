import { authenticate, httpTransport } from 'plug-auth-client'

const API_URL = 'https://rs.extplug.com'

export default class Storage {
  constructor ({ url = API_URL } = {}) {
    this.baseUrl = url

    this.token = authenticate({
      transport: httpTransport({ url: `${this.baseUrl}/auth` })
    }).then((result) => result.token)
  }

  getSettings (room) {
    return fetch(`${this.baseUrl}/${room}`)
      .then((response) => response.json())
  }

  getStyles (room) {
    return fetch(`${this.baseUrl}/${room}.css`)
      .then((response) => response.text())
  }
  getStylesSource (room) {
    return fetch(`${this.baseUrl}/${room}.css?source`)
      .then((response) => response.text())
  }

  saveSettings (room, settings) {
    return this.token.then((token) =>
      fetch(`${this.baseUrl}/${room}`, {
        method: 'PUT',
        headers: {
          authorization: `JWT ${token}`,
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
    ).then((response) => response.json())
  }

  saveStyles (room, cssText) {
    return this.token.then((token) =>
      fetch(`${this.baseUrl}/${room}.css`, {
        method: 'PUT',
        headers: {
          authorization: `JWT ${token}`,
          accept: 'application/json',
          'content-type': 'text/css'
        },
        body: cssText
      })
    ).then((response) => response.json())
  }
}
