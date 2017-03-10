import { View } from 'backbone'
import currentRoom from 'plug/models/currentRoom'
import request from 'extplug/util/request'
import codemirror from './codemirror'

export default View.extend({
  className: 'general-settings',

  render () {
    const { roomSettings } = this.options

    const imports = this.getImports()
    const rsImport = `https://rs.extplug.com/${currentRoom.get('slug')}.css`

    if (imports.includes(rsImport)) {
      request(rsImport)
        .then(this.createEditor.bind(this))
        .fail((err) => {
          console.error(err.stack)
          alert(err.message)
        })
    } else {
      this.createEditor('')
    }

    // TODO list editable imports

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
  },

  getImports () {
    const css = this.options.roomSettings.get('css')
    const imports = []
    if (typeof css === 'string') {
      imports.push(css)
    }
    if (typeof css === 'object' && Array.isArray(css.import)) {
      imports.push(css.import)
    }

    return imports
  }
})
