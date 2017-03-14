import { Model, View } from 'backbone'
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
  className: 'general-settings',

  initialize ({ roomSettings }) {
    this.rules = new Model(roomSettings.get('rules'))
    this.listenTo(this.rules, 'change', this.render)

    this.listenTo(roomSettings, 'change:rules', () => {
      this.rules.set(roomSettings.get('rules'))
    })
  },

  render () {
    const switches = Object.entries(options).map(([ name, label ]) =>
      Switch({
        name,
        label,
        enabled: this.rules.get(name),
        enable: () => this.enable(name),
        disable: () => this.disable(name)
      }))

    this.button = html`
      <button class="extp-Button" onclick=${() => this.save()}>
        Save
      </button>
    `

    this.$el.empty().append(html`
      <div class="extp-RulesSettingsView">
        ${switches}
      </div>
    `, html`
      <div class="extp-RulesSettingsSaveLine">
        ${this.button}
      </div>
    `)

    return this
  },

  enable (name) {
    this.rules.set(name, true)
  },

  disable (name) {
    this.rules.set(name, false)
  },

  save () {
    this.button.setAttribute('disabled', 'disabled')

    return this.options.save({
      rules: this.rules.toJSON()
    }).then(() => {
      this.button.removeAttribute('disabled')
    })
  },

  onResize () {}
})
