const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder().setName('mute').setDescription('Mute a user.')
        .addUserOption(option => option.setName('target').setDescription('Select the user you wish to mute.').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('How long should the mute last?').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('What is the reason of the mute?')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const mutes_channel = client.channels.cache.get(process.env.channel_mutes)
        const user = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(user.id)
        const duration = interaction.options.getString('duration')
        const durationMS = ms(duration)
        const reason = interaction.options.getString('reason') || 'No reason provided'

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:shushing_face: Muted**')
            .setDescription(`You muted ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .addFields({ name: 'Duration', value: duration, inline: true })
            .setTimestamp(Date.now())
        const embed_mute = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:shushing_face: Muted**')
            .setDescription(`${interaction.member.user} has muted ${user}`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .addFields({ name: 'Duration', value: duration, inline: true })
            .setTimestamp(Date.now())
        const embed_member = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle('**:shushing_face: Muted**')
            .setDescription(`You have been muted in ${member.guild.name}`)
            .addFields({ name: 'By', value: `${interaction.member.user}`, inline: true })
            .addFields({ name: 'Reason', value: reason, inline: true })
            .addFields({ name: 'Duration', value: duration, inline: true })
            .setTimestamp(Date.now())
        const embed_error = new EmbedBuilder().setColor('Red')
            .setTitle('**:x: Error**')
            .setDescription('Something went wrong. Please try again later.')

        if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.reply({
            embeds: [embed_error.setDescription('This user has higher permissions than you.')],
            ephemeral: true
        })
        if (!durationMS) return await interaction.reply({
            embeds: [embed_error.setDescription('You haven\'t chosen any duration.')],
            ephemeral: true
        })

        try {
            await member.send({ embeds: [embed_member] }).catch(error => {throw error})
            mutes_channel.send({ embeds: [embed_mute] })
            await member.timeout(durationMS, reason)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            await interaction.reply({ embeds: [embed_error], ephemeral: true })
            console.error(error)
        }
    }
}