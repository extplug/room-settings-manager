import html from 'bel'
import Events from 'plug/core/Events'
import ShowUserRolloverEvent from 'plug/events/ShowUserRolloverEvent'
import users from 'plug/collections/users'
import getUserClasses from 'extplug/util/getUserClasses'

export default function UserBadge (uid) {
  const user = users.findWhere({ id: uid })
  if (user) {
    return html`
      <div class="extp-UserBadge user ${getUserClasses(uid).join(' ')}"
           onclick=${onclick}>
        <div class="extp-UserBadge-img">
          <div class="thumb small">
            <i class="avi avi-${user.get('avatarID')}"></i>
          </div>
        </div>
        <span class="extp-UserBadge-name">
          ${user.get('username')}
        </span>
      </div>
    `
  } else {
    // TODO load user using a bulk load action
    const placeholder = html`<div />`
    return placeholder
  }

  function onclick (event) {
    const el = $(event.target).closest('.extp-UserBadge')
    Events.dispatch(new ShowUserRolloverEvent(ShowUserRolloverEvent.SHOW, user, {
      x: el.offset().left - 6,
      y: el.offset().top
    }, true))
  }
}
