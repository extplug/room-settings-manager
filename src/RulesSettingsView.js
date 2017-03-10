import { View } from 'backbone'
import html from 'bel'
import lang from 'lang/Lang'

const options = {
  allowAutowoot: 'Allow Autowoot',
  allowAutograb: 'Allow Autograb',
  allowAutojoin: 'Allow Autojoin',
  allowAutorespond: 'Allow Auto-respond',
  allowEmotes: 'Allow Extended Emotes (RCS)',
  allowShowingMehs: 'Allow Showing Mehs',
  allowSmartVote: 'Allow Smartvote (RCS)',
  forceSmartVote: 'Force Smartvote (RCS)'
}

function Switch ({ name, label, enabled, enable, disable }) {
  // Enabled status seems to be reversed for plug.dj-style switches…
  return html`
    <div class="option extp-RulesSettingsView-option ${enabled ? '' : 'enabled' }">
      <span class="title">${label}</span>
      <button class="off" style="cursor: ${enabled ? 'default' : 'pointer'}" onclick=${enable}>
        ${lang.roomSettings.on}
      </button>
      <button class="on" style="cursor: ${enabled ? 'pointer' : 'default'}" onclick=${disable}>
        ${lang.roomSettings.off}
      </button>
    </div>
  `
}

export default View.extend({
  className: 'extp-RulesSettingsView general-settings',

  initialize ({ roomSettings }) {
    roomSettings.on('change', this.render, this)
  },

  render () {
    const { roomSettings } = this.options
    const rules = roomSettings.get('rules')

    const switches = Object.entries(options).map(([ name, label ]) =>
      Switch({
        name,
        label,
        enabled: rules[name],
        enable: () => this.enable(name),
        disable: () => this.disable(name)
      }))

    this.$el.empty().append(...switches)

    return this
  },

  remove () {
    this.options.roomSettings.off('change', this.render, this)

    return this._super()
  },

  enable (name) {
    const { roomSettings } = this.options
    roomSettings.set('rules', {
      ...roomSettings.get('rules'),
      [name]: true
    })
  },

  disable (name) {
    const { roomSettings } = this.options
    roomSettings.set('rules', {
      ...roomSettings.get('rules'),
      [name]: false
    })
  },

  onResize () {}
})
