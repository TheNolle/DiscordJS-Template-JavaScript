const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
async function loadEvents(client) {
    const { loadFiles } = require('../functions/file.loader')
    const ascii = require('ascii-table')
    const table = new ascii().setTitle('Events').setHeading('Type', 'Description', 'Once', 'Status')
    await client.events.clear()
    const Files = await loadFiles('events')
    Files.forEach(file => {
        const event = require(file)
        const execute = (...args) => event.execute(...args, client)
        client.events.set(event.name, execute)
        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute)
            else client.rest.on(event.name, execute)
        } else {
            if (event.once) client.once(event.name, execute)
            else client.on(event.name, execute)
        }
        table.addRow(event.name, event.description, event.once || 'false', '🟢 Enabled')
    })
    if (table.__rows.length > 0) return console.log(table.toString())
    else return
}

module.exports = { loadEvents }