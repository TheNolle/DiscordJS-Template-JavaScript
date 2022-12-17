const { Client } = require('discord.js')
const { loadCommands } = require('../../structures/handlers/commands')
const { loadButtons } = require('../../structures/handlers/buttons')
const { loadSelectMenus } = require('../../structures/handlers/select_menus')
const { colorConsole } = require('../../structures/functions/color.console')
const { presence } = require('../../structures/functions/presence')

module.exports = {
    name: 'ready',
    description: 'Executes code on Bot startup',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        await loadComponents(client)
        presence(client, { status: 'online', type: 'watching', text: `${client.guilds.cache.map(guild => guild.name)}` })
        console.log(colorConsole(`🤖 &n&l&d${client.user.username}&r  &7• &aSuccessfully started and logged-in as &n&l&d${client.user.tag}&r&b.`))
    }
}

async function loadComponents(client) {
    await loadCommands(client)
    await loadButtons(client)
    await loadSelectMenus(client)
}