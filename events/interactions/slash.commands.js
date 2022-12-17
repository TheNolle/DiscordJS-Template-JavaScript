const { ChatInputCommandInteraction, Client, ChannelType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    description: 'Executes code on Slash Command/Context-Menu Command',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (interaction.channel.type == ChannelType.DM || interaction.channel.type == ChannelType.GroupDM) {
            const embed = new EmbedBuilder().setColor(process.env.color_embed)
                .setTitle('Not Allowed')
                .setDescription('I am sorry but for now i do not support DM commands...')
            interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.reply({ content: 'This command is outdated', ephemeral: true })
            command.execute(interaction, client)
        }
    }
}