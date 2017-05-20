import { View } from 'backbone'
import $ from 'jquery'
import html from 'bel'
import SpinnerView from 'plug/views/spinner/SpinnerView'
import UserBadge from './UserBadge'

function Change ({ id, message, user, time }) {
  const lines = message.split('\n')
  const firstLine = lines.shift().replace(/^\[(.*?)\]\s*/, '')

  const date = new Date(time)

  return html`
    <li class="extp-RoomSettingsChange" data-commit-sha=${id}>
      <h2 class="extp-RoomSettingsChange-message">${firstLine}</h2>
      <time class="extp-RoomSettingsChange-date" datetime=${date.toISOString()}>
        ${date.toLocaleString()}
      </time>
      <div class="extp-RoomSettingsChange-author">
        by ${UserBadge(user)}
      </div>

      <p class="extp-RoomSettingsChange-description">
        ${lines}
      </p>
    </li>
  `
}

export default View.extend({
  className: 'general-settings',

  render () {
    this.spinner = new SpinnerView({ size: SpinnerView.LARGE })

    this.wrapper = $(html`
      <div class="extp-RoomSettingsHistory">
        ${this.spinner.el}
      </div>
    `)
    this.$el.append(this.wrapper)

    this.spinner.render()

    this.options.load().then((changes) => {
      this.spinner.remove()
      this.list = $(html`
        <ul class="extp-RoomSettingsChangeList">
          ${changes.map(Change)}
        </ul>
      `)

      this.scrollPane = this.list.jScrollPane().data('jsp')
      this.wrapper.append(this.list)

      requestAnimationFrame(() => {
        this.scrollPane.reinitialise()
      })
    })

    return this
  },

  onResize () {}
})
