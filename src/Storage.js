import { authenticate, httpTransport } from 'plug-auth-client'

const API_URL = 'https://rs.extplug.com'

function rejectNonOK(response) {
  if (response.ok) {
    return response
  }
  return response.json().catch(() => null).then((json) => {
    const error = new Error('An unknown error occurred.')
    error.body = json
    error.response = response
    throw error;
  })
}

export default class Storage {
  constructor ({ url = API_URL } = {}) {
    this.baseUrl = url

    this.token = authenticate({
      transport: httpTransport({ url: `${this.baseUrl}/auth` })
    }).then((result) => result.token)
  }

  getSettings (room) {
    return fetch(`${this.baseUrl}/${room}`)
      .then(rejectNonOK)
      .then((response) => response.json())
  }

  getStyles (room) {
    return fetch(`${this.baseUrl}/${room}.css`)
      .then(rejectNonOK)
      .then((response) => response.text())
  }
  getStylesSource (room) {
    return fetch(`${this.baseUrl}/${room}.css?source`)
      .then(rejectNonOK)
      .then((response) => response.text())
  }

  getHistory (room) {
    return fetch(`${this.baseUrl}/${room}/history`)
      .then(rejectNonOK)
      .then((response) => response.json())
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
    )
      .then(rejectNonOK)
      .then((response) => response.json())
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
    )
      .then(rejectNonOK)
      .then((response) => response.json())
  }
}
