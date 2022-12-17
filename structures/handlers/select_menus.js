const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
async function loadSelectMenus(client) {
    const { loadFiles } = require('../functions/file.loader')
    const ascii = require('ascii-table')
    const table = new ascii().setTitle('Select Menus').setHeading('Id', 'Status')
    await client.select_menus.clear()
    const Files = await loadFiles('select menus')
    Files.forEach(file => {
        const select_menu = require(file)
        client.select_menus.set(select_menu.id, select_menu)
        table.addRow(select_menu.id, '🟢 Enabled')
    })
    if (table.__rows.length > 0) return console.log(table.toString())
    else return
}

module.exports = { loadSelectMenus }