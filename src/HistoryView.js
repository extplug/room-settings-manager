import { View } from 'backbone'
import html from 'bel'
import SpinnerView from 'plug/views/spinner/SpinnerView'

function Change ({ id, message, user, time }) {
  const lines = message.split('\n')
  const firstLine = lines.shift().replace(/^\[(.*?)\]\s*/, '')
  const userObj = API.getUser(user)

  const authorEl = html`
    <div class="extp-RoomSettingsChange-author">${userObj && userObj.username}</div>
  `

  return html`
    <li class="extp-RoomSettingsChange">
      <h2 class="extp-RoomSettingsChange-message">${firstLine}</h2>
      <time>${new Date(time).toLocaleString()}</time>
      ${authorEl}

      <p>
        ${lines}
      </p>
    </li>
  `
}

export default View.extend({
  className: 'general-settings',

  render () {
    this.spinner = new SpinnerView({ size: SpinnerView.LARGE })

    this.wrapper = html`
      <div class="extp-RoomSettingsHistory">
        ${this.spinner.el}
      </div>
    `
    this.$el.append(this.wrapper)

    this.spinner.render()

    this.options.load().then((changes) => {
      this.spinner.remove()
      this.wrapper.appendChild(html`
        <ul>
          ${changes.map(Change)}
        </ul>
      `)
    })

    return this
  },

  onResize () {}
})
