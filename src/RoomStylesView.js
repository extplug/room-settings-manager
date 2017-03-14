import { View } from 'backbone'
import stripIndent from 'strip-indent'
import html from 'bel'
import currentRoom from 'plug/models/currentRoom'
import request from 'extplug/util/request'
import codemirror from './codemirror'
import convertCssObject from './convertCssObject'

const defaultText = stripIndent(`
  /* Add your CSS here! */
`)

export default View.extend({
  className: 'general-settings extp-RoomStylesView',

  render () {
    this.wrapper = html`
      <div class="extp-RoomStylesView-editor" />
    `

    this.button = html`
      <button class="extp-Button" onclick=${() => this.save()}>
        Save
      </button>
    `

    this.$el.append(this.wrapper, html`
      <div class="extp-RulesSettingsSaveLine extp-RoomStylesView-save">
        ${this.button}
      </div>
    `)

    this.loadStyles().then((cssText) => {
      this.createEditor(cssText)
    })

    return this
  },

  onResize () {
    this.editor && this.editor.refresh()
  },

  loadStyles () {
    return this.options.load().catch((err) => {
      const css = this.options.roomSettings.get('css')

      if (css != null && typeof css === 'object') {
        return convertCssObject(css)
      }

      if (typeof css === 'string') {
        // Auto-proxy using request util.
        return request(css)
      }

      return defaultText
    })
  },

  createEditor (contents) {
    this.editor = codemirror(this.wrapper, {
      mode: 'css',
      theme: 'base16-dark',
      lineNumbers: true,
      value: contents
    })
  },

  save () {
    if (!this.editor) return

    const styles = this.editor.getDoc().getValue()

    this.button.setAttribute('disabled', 'disabled')
    return this.options.save(styles).then(() => {
      this.button.removeAttribute('disabled')
    })
  }
})
