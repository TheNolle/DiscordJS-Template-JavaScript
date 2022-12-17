const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const { presence } = require('../../../structures/functions/presence')

module.exports = {
    data: new SlashCommandBuilder().setName('set-presence').setDescription('Change the bot\'s presence and/or status.')
        .addBooleanOption(option => option.setName('reset').setDescription('Reset the bot\'s status?'))
        .addStringOption(option => option.setName('status').setDescription('What type of status do you want?').setChoices(
            { name: 'Online', value: 'online' },
            { name: 'Do Not Disturb', value: 'dnd' },
            { name: 'Idle', value: 'idle' },
            { name: 'Invisible', value: 'invisible' }
        ))
        .addStringOption(option => option.setName('type').setDescription('What type of presence do you want?').setChoices(
            { name: 'Watching', value: 'watching' },
            { name: 'Playing', value: 'playing' },
            { name: 'Listening', value: 'listening' },
            { name: 'Streaming', value: 'streaming' },
            { name: 'Competiting', value: 'competiting' }
        ))
        .addStringOption(option => option.setName('text').setDescription('What text do you want to display?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const status = interaction.options.getString('status') || client.user.presence.status
        const type = interaction.options.getString('type') || getType(client.user.presence.activities[0].type)
        const text = interaction.options.getString('text') || client.user.presence.activities[0].name
        const reset = interaction.options.getBoolean('reset') || false

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle(`:busts_in_silhouette: Presence Updater`)
        const embed_error = new EmbedBuilder().setColor('Red')
            .setTitle('**:x: Error**')
            .setDescription('Something went wrong. Please try again later.')

        try {
            embed.addFields({ name: 'Old Presence', value: `[${status}] **${type}** ${text}`, inline: true })
            if (reset) presence(client, { status: 'watching', type: type, text: `Visual Studio Code ⌨️` })
            else presence(client, { status: status, type: type, text: text })
            embed.addFields({ name: 'New Presence', value: `[${status}] **${type}** ${text}`, inline: true })
            return interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            return interaction.reply({ embeds: [embed_error], ephemeral: true })
        }
    }
}

function getType(type) {
    switch (type) {
        case 0: return 'playing'
        case 1: return 'streaming'
        case 2: return 'listening'
        case 3: return 'watching'
        case 4: return 'custom'
        case 5: return 'competiting'
        default: return 'playing'
    }
}