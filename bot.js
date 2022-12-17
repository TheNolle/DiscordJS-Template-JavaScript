const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
require('dotenv-defaults/config')

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)]
})
client.login(process.env.token)

client.events = new Collection()
client.commands = new Collection()
client.buttons = new Collection()
client.select_menus = new Collection()

console.clear()

require('./structures/handlers/events').loadEvents(client)