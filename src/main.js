import currentRoom from 'plug/models/currentRoom'
import Plugin from 'extplug/Plugin'
import { authenticate, httpTransport } from 'plug-auth-client'

const API_URL = 'https://rs.extplug.com'

const RoomSettingsManager = Plugin.extend({
  name: 'Room Settings Manager',
  description: 'Easily configure your room settings and style.',

  enable () {
    this.token = authenticate({
      transport: httpTransport({ url: `${API_URL}/auth` })
    }).then((result) => result.token)
  },

  disable () {
  },

  save () {
    const myRoomSettings = {
      stub: true
    }

    this.token.then((token) =>
      fetch(`${API_URL}/${currentRoom.get('slug')}`, {
        method: 'PUT',
        headers: {
          authorization: `JWT ${token}`,
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(myRoomSettings)
      })
    ).catch((err) => {
      console.error(err)
      throw err
    })
  }
})

export default RoomSettingsManager
