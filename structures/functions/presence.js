const { Client, ActivityType } = require("discord.js")

/**
 * @param {Client} client
 */
function presence(client, parameters = {}) {
    var status = parameters.status.toLowerCase(), type = parameters.type.toLowerCase(), text = parameters.text
    if (status == null | status == '') status = 'online'
    if (type == null | type == '') type = 'custom'
    if (text == null | text == '') text = '.'
    const types = {
        watching: ActivityType.Watching,
        playing: ActivityType.Playing,
        listening: ActivityType.Listening,
        streaming: ActivityType.Streaming,
        competiting: ActivityType.Competing,
        custom: ActivityType.Custom
    }
    const statuses = { online: 'online', idle: 'idle', dnd: 'dnd', invisible: 'invisible' }
    try { client.user.setPresence({ activities: [{ type: types[type], name: text }], status: statuses[status] }) }
    catch (error) { console.error(error) }
}

module.exports = { presence }