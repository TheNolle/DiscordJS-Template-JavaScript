const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('clear').setDescription('Deletes a specified amount of messages from a channel or a target.')
        .addIntegerOption(option => option.setName('amount').setDescription('Select the amount of messages to delete.').setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('Select a target to clear their messages.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { channel, options } = interaction
        var amount = options.getInteger('amount')
        const target = options.getMember('target')
        const messages = await channel.messages.fetch()
        const embed = new EmbedBuilder().setColor(process.env.color_embed)
        if (amount < 0) amount = 1
        else if (amount > 100) amount = 100
        if (target) {
            var i = 0
            const filtered = []
            await messages.filter((m) => {
                if (m.author.id === target.id && amount > i) {
                    filtered.push(m)
                    i++
                }
            })
            await channel.bulkDelete(filtered, true).then(async m => {
                var size = 0
                await messages.forEach(_ => size++)
                if (m.size > 0) embed.setDescription(`🧹 Cleared \`${m.size}\` messages.`)
                else if (m.size === 0 && size > 0) embed.setDescription('Messages are older than 14 days.')
                else if (m.size === 0) embed.setDescription('There is no messages to delete.')
            })
        } else {
            await channel.bulkDelete(amount, true).then(async m => {
                var size = 0
                await messages.forEach(_ => size++)
                if (m.size > 0) embed.setDescription(`🧹 Cleared \`${m.size}\` messages.`)
                else if (m.size === 0 && size > 0) embed.setDescription('Messages are older than 14 days.')
                else if (m.size === 0) embed.setDescription('There is no messages to delete.')
            })
        }
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}