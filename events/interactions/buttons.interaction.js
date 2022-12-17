const { ButtonInteraction, Client, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    description: 'Executes code on Button Interaction',
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId)
            const embed = new EmbedBuilder().setColor(process.env.color_embed)
            try {
                if (button.permission && !interaction.member.permissions.has(button.permission)) {
                    embed.setDescription('You are missing the correct permissions.')
                    return interaction.reply({ embeds: [embed], ephemeral: true })
                } else if (button.ownerOnly && interaction.user.id !== interaction.guild.ownerId) {
                    embed.setColor(process.env.color_embed).setDescription('You are no the owner.')
                    return interaction.reply({ embeds: [embed], ephemeral: true })
                } else {
                    button.execute(interaction, client)
                }
            } catch (error) {
                embed.setDescription('An error occured while trying to execute this Interaction.').addFields({ name: 'error', value: error.toString() })
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }
}