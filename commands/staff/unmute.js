const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('unmute').setDescription('Unmute a muted user.')
        .addUserOption(option => option.setName('target').setDescription('Select the user you wish to unmute.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('What is the reason of the unmute?')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const mutes_channel = client.channels.cache.get(process.env.channel_mutes)
        const user = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(user.id)
        const reason = interaction.options.getString('reason') || 'No reason provided'

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:speaking_head: Unmuted**')
            .setDescription(`You unmuted ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        const embed_unmute = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:speaking_head: Unmuted**')
            .setDescription(`${interaction.member.user} has unmuted ${user}`)
            .setTimestamp(Date.now())
        const embed_member = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:speaking_head: Unmuted**')
            .setDescription(`You have been unmuted in ${member.guild.name}`)
            .addFields({ name: 'By', value: `${interaction.member.user}`, inline: true })
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        const embed_error = new EmbedBuilder().setColor('Red')
            .setTitle('**:x: Error**')
            .setDescription('Something went wrong. Please try again later.')

        if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.reply({
            embeds: [embed_error.setDescription('This user has higher permissions than you.')],
            ephemeral: true
        })

        try {
            await member.send({ embeds: [embed_member] }).catch(error => {throw error})
            mutes_channel.send({ embeds: [embed_unmute] })
            await member.timeout(null)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            await interaction.reply({ embeds: [embed_error], ephemeral: true })
            console.error(error)
        }
    }
}