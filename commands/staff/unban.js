const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder().setName('unban').setDescription('Unban a banned user.')
        .addStringOption(option => option.setName('target').setDescription('Provide the ID of the user you ant to unban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('What is the reason of the unban?')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const bans_channel = client.channels.cache.get(process.env.channel_bans)
        const user = interaction.options.getString('target')
        const reason = interaction.options.getString('reason') || 'No reason provided'

        await axios.get(`https://discord.com/api/v10/users/${user}`, { headers: { Authorization: `Bot ${process.env.token}` } })
            .then(async result => {
                const username = result.data.username
                const embed = new EmbedBuilder().setColor(process.env.color_embed)
                    .setTitle('**:open_hands: Unban**')
                    .setDescription(`You unbanned user: \`${username}\` *(${user})*`)
                    .addFields({ name: 'Reason', value: reason, inline: true })
                    .setTimestamp(Date.now())
                const embed_unban = new EmbedBuilder().setColor(process.env.color_embed)
                    .setTitle('**:open_hands: Unban**')
                    .setDescription(`${interaction.member.user} has unbanned user: \`${username}\` *(${user})*`)
                    .addFields({ name: 'Reason', value: reason, inline: true })
                    .setTimestamp(Date.now())
                const embed_error = new EmbedBuilder().setColor('Red')
                    .setTitle('**:x: Error**')
                    .setDescription('Something went wrong. Please try again later.')

                await interaction.guild.bans.fetch().then(async bans => {
                    if (bans.size == 0) return await interaction.reply({ embeds: [embed_error.setDescription('There is noone to unban')], ephemeral: true })
                    let banned = await bans.find(ban => ban.user.id == user)
                    if (!banned) return await interaction.reply({ embeds: [embed_error.setDescription('This user is not banned')], ephemeral: true })

                    await interaction.guild.bans.remove(user, reason).catch(error => console.error(error))

                    await interaction.reply({ embeds: [embed], ephemeral: true })
                    bans_channel.send({ embeds: [embed_unban] })
                }).catch(error => console.error(error))
            })
            .catch(async _ => { return await interaction.reply({ embeds: [embed_error.setDescription('No user with this ID')], ephemeral: true }) })
    }
}