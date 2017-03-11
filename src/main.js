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
        roomSettingsView.view = new RoomStylesView({
          roomSettings: this.ext.roomSettings,
          save: (styles) => this.updateStyles(styles)
        })
      }
      if (section === 'extplug-rules') {
        roomSettingsView.view = new RulesSettingsView({
          roomSettings: this.ext.roomSettings,
          save: (fragment) => this.updateSettings(fragment)
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

  updateSettings (fragment) {
    const roomSettings = this.ext.roomSettings.toJSON()
    Object.assign(roomSettings, fragment)

    return this.getStorage().saveSettings(
      currentRoom.get('slug'),
      roomSettings
    ).catch((err) => {
      console.error(err)
      throw err
    })
  },

  updateStyles (styles) {
    const cssUrl = `https://rs.extplug.com/${currentRoom.get('slug')}.css`

    return this.getStorage().saveStyles(
      currentRoom.get('slug'),
      styles
    ).then((result) => {
      if (this.ext.roomSettings.get('css') !== cssUrl) {
        return this.updateSettings({ css: cssUrl })
      }
      return result
    }).catch((err) => {
      console.error(err)
      throw err
    })
  }
})

export default RoomSettingsManager
