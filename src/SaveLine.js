import html from 'bel'

export default function SaveLine ({ onSave, placeholder }) {
  const message = html`
    <textarea class="extp-RoomSettingsMessage" placeholder="A short message describing your changes. (default: ${placeholder})"></textarea>
  `

  const button = html`
    <button class="extp-Button"
            onclick=${onclick}>
      Save
    </button>
  `

  return html`
    <div class="extp-RoomSettingsSaveLine">
      ${message}
      ${button}
    </div>
  `

  function onclick () {
    const saving = onSave({
      message: message.value || placeholder
    })

    button.setAttribute('disabled', 'disabled')
    if (saving && saving.then) {
      saving.then(() => {
        button.removeAttribute('disabled')
      })
    }
  }
}
