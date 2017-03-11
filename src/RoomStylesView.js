import { View } from 'backbone'
import stripIndent from 'strip-indent'
import currentRoom from 'plug/models/currentRoom'
import request from 'extplug/util/request'
import codemirror from './codemirror'
import convertCssObject from './convertCssObject'

const defaultText = stripIndent(`
  /* Add your CSS here! */
`)

export default View.extend({
  className: 'general-settings',

  render () {
    const { roomSettings } = this.options

    const rsImport = `https://rs.extplug.com/${currentRoom.get('slug')}.css`

    fetch(rsImport).then((response) => response.text()).catch((err) => {
      const css = roomSettings.get('css')

      if (css != null && typeof css === 'object') {
        return convertCssObject(css)
      }

      if (typeof css === 'string') {
        // Auto-proxy using request util.
        return request(css)
      }

      return defaultText
    }).then((cssText) => {
      this.createEditor(cssText)
    })

    return this
  },

  onResize () {
    this.editor && this.editor.refresh()
  },

  createEditor (contents) {
    this.editor = codemirror(this.el, {
      mode: 'css',
      theme: 'base16-dark',
      lineNumbers: true,
      value: contents
    })
  }
})
