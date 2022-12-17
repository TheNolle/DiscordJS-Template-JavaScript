const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
async function loadCommands(client) {
    const { loadFiles } = require('../functions/file.loader')
    const ascii = require('ascii-table')
    const table = new ascii().setTitle('Commands').setHeading('Name', 'Description', 'Status')
    await client.commands.clear()
    const commands = []
    const files = await loadFiles('commands')
    files.forEach(file => {
        const command = require(file)
        const cmd = {
            name: command.data.name,
            description: command.data.description,
            ownerOnly: command.ownerOnly,
            json: command.data.toJSON()
        }
        commands.push(cmd.json)
        table.addRow(cmd.name, cmd.description, '🟢 Enabled')
        client.commands.set(cmd.name, command)
    })
    client.application.commands.set(commands)
    if (table.__rows.length > 0) return console.log(table.toString())
    else return
}

module.exports = { loadCommands }