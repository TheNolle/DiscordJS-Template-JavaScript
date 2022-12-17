const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('unnick').setDescription('Reset your/target\'s nickname.')
        .addUserOption(option => option.setName('target').setDescription('Select a target to clear their messages.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const user = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(user.id)
        const nickname = member.displayName

        const embed = new EmbedBuilder().setColor(process.env.color_embed)
            .setTitle(':label: Nick')
            .setDescription(`Reseted ${user}'s nickname`)
            .addFields({ name: 'From', value: nickname, inline: true })
            .addFields({ name: 'To', value: user.username, inline: true })
        const embed_error = new EmbedBuilder().setColor('Red')
            .setTitle('**:x: Error**')
            .setDescription('Something went wrong. Please try again later.')

        if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.reply({
            embeds: [embed_error.setDescription('This user has higher permissions than you.')],
            ephemeral: true
        })

        try {
            await member.setNickname('')
            interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            console.error(error)
        }
    }
}