const { Client, EmbedBuilder, SelectMenuInteraction } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    description: 'Executes code on Button Interaction',
    /**
     * @param {SelectMenuInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (interaction.isAnySelectMenu()) {
            console.log(client.select_menus)
            const select_menu = client.select_menus.get(interaction.customId)
            const embed = new EmbedBuilder().setColor(process.env.color_embed)
            try {
                if (select_menu.permission && !interaction.member.permissions.has(select_menu.permission)) {
                    embed.setDescription('You are missing the correct permissions.')
                    return interaction.reply({ embeds: [embed], ephemeral: true })
                } else if (select_menu.ownerOnly && interaction.user.id !== interaction.guild.ownerId) {
                    embed.setColor(process.env.color_embed).setDescription('You are no the owner.')
                    return interaction.reply({ embeds: [embed], ephemeral: true })
                } else {
                    select_menu.execute(interaction, client)
                }
            } catch (error) {
                embed.setDescription('An error occured while trying to execute this Interaction.').addFields({ name: 'error', value: error.toString() })
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }
}