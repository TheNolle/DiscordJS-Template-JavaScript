const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('kick').setDescription('Kick a user.')
        .addUserOption(option => option.setName('target').setDescription('Select the user you wish to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('What is the reason of the kick?')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const kicks_channel = client.channels.cache.get(process.env.channel_kicks)
        const user = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(user.id)
        const reason = interaction.options.getString('reason') || 'No reason provided'

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:athletic_shoe: Kick**')
            .setDescription(`You kicked ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        const embed_kick = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:athletic_shoe: Kick**')
            .setDescription(`${interaction.member.user} has kicked ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        const embed_member = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:athletic_shoe: Kick**')
            .setDescription(`You have been kicked from ${member.guild.name}`)
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
            kicks_channel.send({ embeds: [embed_kick] })
            await member.kick(reason)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            await interaction.reply({ embeds: [embed_error], ephemeral: true })
            console.error(error)
        }
    }
}