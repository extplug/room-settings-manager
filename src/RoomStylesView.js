import { View } from 'backbone'
import stripIndent from 'strip-indent'
import html from 'bel'
import empty from 'empty-element'
import currentRoom from 'plug/models/currentRoom'
import SpinnerView from 'plug/views/spinner/SpinnerView'
import request from 'extplug/util/request'
import codemirror from './codemirror'
import convertCssObject from './convertCssObject'
import SaveLine from './SaveLine'

const defaultText = stripIndent(`
  /* Add your CSS here! */
`)

export default View.extend({
  className: 'general-settings extp-RoomStylesView',

  defaultMessage: 'Update room styles.',

  render () {
    this.spinner = new SpinnerView({ size: SpinnerView.LARGE })

    this.wrapper = html`
      <div class="extp-RoomStylesView-editor">
        <div class="extp-RoomStylesView-loading">
          ${this.spinner.el}
        </div>
      </div>
    `

    this.$el.append(this.wrapper, SaveLine({
      placeholder: this.defaultMessage,
      onSave: () => this.save()
    }))

    this.spinner.render()

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
    this.editor = codemirror(empty(this.wrapper), {
      mode: 'css',
      theme: 'base16-dark',
      lineNumbers: true,
      value: contents
    })
  },

  save () {
    if (!this.editor) return

    const styles = this.editor.getDoc().getValue()

    return this.options.save(styles)
  }
})
