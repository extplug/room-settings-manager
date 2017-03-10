import BaseView from 'plug/views/rooms/settings/RoomSettingsMenuView'
import html from 'bel'

export default BaseView.extend({
  render () {
    this._super()

    this.$el.append(html`
      <div class="item extplug-styles" data-value="extplug-styles"
           onclick=${() => this.select('extplug-styles')}>
        <i class="icon icon-edit-white"></i>
        <span class="label">Room Styles</span>
      </div>
    `, html`
      <div class="item extplug-rules" data-value="extplug-rules"
           onclick=${() => this.select('extplug-rules')}>
        <i class="icon icon-locked"></i>
        <span class="label">Extension Rules</span>
      </div>
    `)

    this.$('.general').on('click', () => this.select('general'))

    return this
  },

  select (type) {
    this.$('.item').removeClass('selected')
    this.$(`[data-value="${type}"]`).addClass('selected')

    this.trigger('extplug:select', type)
  }
})
