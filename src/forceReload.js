/* global API */

import ModerateDeleteChatAction from 'plug/actions/rooms/ModerateDeleteChatAction'

/**
 * Send a message and immediately try to delete it.
 */
function send (text) {
  API.sendChat(text)
  const sender = API.getUser().id
  API.on('chat', (message) => {
    if (message.uid === sender && message.message === text) {
      new ModerateDeleteChatAction(message.cid)
    }
  })
}

/**
 * Force a room settings reload for everyone in the room.
 */
export default function forceReload () {
  // Using the RCS way, because it's supported by both RCS and ExtPlug, and
  // doesn't require changing the room description which may be fiddly.
  send('!rcsreload ccs')
}
