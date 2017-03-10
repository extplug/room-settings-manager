import currentRoom from 'plug/models/currentRoom'
import Plugin from 'extplug/Plugin'
import style from './style.css'

import RoomSettingsMenuViewOverride from './RoomSettingsMenuView'
import RoomStylesView from './RoomStylesView'
import RulesSettingsView from './RulesSettingsView'
import Storage from './Storage'

const RoomSettingsManager = Plugin.extend({
  name: 'Room Settings Manager',
  description: 'Easily configure your room settings and style.',

  style,

  enable () {
    const menu = new RoomSettingsMenuViewOverride()
    this.oldRoomSettingsMenuView = this.overrideRoomSettingsMenu(menu)

    const roomSettingsView = this.ext.appView.settings
    menu.on('extplug:select', (section) => {
      if (!section.startsWith('extplug-')) {
        roomSettingsView.change(section)
        return
      }

      roomSettingsView.clear()
      roomSettingsView.section = section

      if (section === 'extplug-styles') {
        roomSettingsView.view = new RoomStylesView()
      }
      if (section === 'extplug-rules') {
        roomSettingsView.view = new RulesSettingsView({
          roomSettings: this.ext.roomSettings
        })
      }

      roomSettingsView.$el.append(roomSettingsView.view.$el)
      roomSettingsView.view.render()
    })
  },

  disable () {
    this.overrideRoomSettingsMenu(this.oldRoomSettingsMenuView)
  },

  overrideRoomSettingsMenu (newMenu) {
    const roomSettingsView = this.ext.appView.settings
    const oldMenu = roomSettingsView.menu
    roomSettingsView.menu = newMenu
    oldMenu.remove()

    roomSettingsView.$el.prepend(roomSettingsView.menu.$el);
    roomSettingsView.menu.render();
    return oldMenu
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
