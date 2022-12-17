const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
async function loadButtons(client) {
    const { loadFiles } = require('../functions/file.loader')
    const ascii = require('ascii-table')
    const table = new ascii().setTitle('Buttons').setHeading('Id', 'Status')
    await client.buttons.clear()
    const Files = await loadFiles('buttons')
    Files.forEach(file => {
        const button = require(file)
        client.buttons.set(button.id, button)
        table.addRow(button.id, '🟢 Enabled')
    })
    if (table.__rows.length > 0) return console.log(table.toString())
    else return
}

module.exports = { loadButtons }