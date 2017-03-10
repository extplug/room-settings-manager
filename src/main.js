import currentRoom from 'plug/models/currentRoom'
import Plugin from 'extplug/Plugin'
import Storage from './Storage'

const RoomSettingsManager = Plugin.extend({
  name: 'Room Settings Manager',
  description: 'Easily configure your room settings and style.',

  enable () {
  },

  disable () {
  },

  getStorage () {
    if (!this.storage) {
      this.storage = new Storage()
    }

    return this.storage
  },

  save () {
    const myRoomSettings = {
      stub: true
    }

    return this.getStorage().save(
      currentRoom.get('slug'),
      myRoomSettings
    ).catch((err) => {
      console.error(err)
      throw err
    })
  }
})

export default RoomSettingsManager
