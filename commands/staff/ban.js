const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user.')
        .addUserOption(option => option.setName('target').setDescription('Select the user you wish to ban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('What is the reason of the ban?'))
        .addStringOption(option => option.setName('clear').setDescription('Clear user\'s messages?').setChoices(
            { name: '1 day', value: '1' },
            { name: '2 days', value: '2' },
            { name: '3 days', value: '3' },
            { name: '4 days', value: '4' },
            { name: '5 days', value: '5' },
            { name: '6 days', value: '6' },
            { name: '7 days', value: '7' },
        )),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const bans_channel = client.channels.cache.get(process.env.channel_bans)
        const user = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(user.id)
        const reason = interaction.options.getString('reason') || 'No reason provided'
        const delete_messages = parseInt(interaction.options.getString('clear')) || 0

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:hammer: Ban**')
            .setDescription(`You banned ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        if (delete_messages > 0) embed.addFields({ name: 'Message Cleared', value: `${delete_messages} days`, inline: true })
        const embed_ban = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:hammer: Ban**')
            .setDescription(`${interaction.member.user} has banned ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setTimestamp(Date.now())
        if (delete_messages > 0) embed_ban.addFields({ name: 'Message Cleared', value: `${delete_messages} days`, inline: true })
        const embed_member = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:hammer: Ban**')
            .setDescription(`You have been banned from ${member.guild.name}`)
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
            bans_channel.send({ embeds: [embed_ban] })
            await member.ban({ deleteMessageDays: delete_messages, reason: reason })
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            await interaction.reply({ embeds: [embed_error], ephemeral: true })
            console.error(error)
        }
    }
}