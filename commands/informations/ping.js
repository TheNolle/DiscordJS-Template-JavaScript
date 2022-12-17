const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Returns Client\'s and API\'s latency.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        const embed = new EmbedBuilder().setTitle('🏓 Pong!').setColor(process.env.color_embed)
            .setDescription(`
                **API's Latency:** ${Math.round(client.ws.ping)}ms
                **Your Latency:** ${Date.now() - interaction.createdTimestamp}ms
            `)
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}