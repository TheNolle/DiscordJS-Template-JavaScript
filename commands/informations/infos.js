const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('infos').setDescription('Get targetted User\'s informations.')
        .addUserOption(option => option.setName('target').setDescription('Select a user you want to get the informations from.')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const target = await interaction.options.getMember('target') || interaction.member
        const { roles, presence, user } = target
        const formatter = new Intl.ListFormat('fr-FR', { style: 'narrow', type: 'conjunction' })
        await user.fetch()
        const statusType = {
            idle: 'N935Y3A',
            dnd: 'dTuMurU',
            online: 'yNRLSwa',
            invisible: 'y8Ny6kL'
        }
        const activityType = [
            ':joystick: ***Playing***',
            ':microphone2: ***Streaming***',
            ':headphones: ***Listening to***',
            ':tv: ***Watching***',
            ':person_juggling: ***Custom***',
            ':trophy: ***Competiting in***'
        ]
        const clientType = [
            { name: 'desktop', text: 'Computer', emoji: ':computer:' },
            { name: 'mobile', text: 'Phone', emoji: ':selfie:' },
            { name: 'web', text: 'Website', emoji: ':earth_africa:' },
            { name: 'offline', text: 'Offline', emoji: ':zzz:' }
        ]
        const badges = {
            BugHunterLevel1: 'Bug Hunter 1',
            BugHunterLevel2: 'Bug Hunter 2',
            CertifiedModerator: 'Moderator',
            HypeSquadOnlineHouse1: 'Bravery',
            HypeSquadOnlineHouse2: 'Brilliance',
            HypeSquadOnlineHouse3: 'Balande',
            Hypesquad: 'Hypesquad',
            Partner: 'Partner',
            PremiumEarlySupporter: 'Nitro',
            Staff: 'Staff',
            VerifiedBot: 'Bot',
            VerifiedDeveloper: 'Developer'
        }
        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0
            const result = []
            for (const role of roles) {
                const roleString = `<@&${role.id}>`
                if (roleString.length + totalLength > maxFieldLength) break
                totalLength += roleString.length + 1
                result.push(roleString)
            }
            return result.length
        }
        const sortedRoles = roles.cache.map(role => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1)
        const clientStatus = presence?.clientStatus instanceof Object ? Object.keys(presence.clientStatus) : 'offline'
        const userFlags = user.flags.toArray()
        const deviceFilter = clientType.filter(device => clientStatus.includes(device.name))
        const devices = !Array.isArray(deviceFilter) ? new Array(deviceFilter) : deviceFilter
        const embed = new EmbedBuilder()
            .setColor(user.hexAccentColor || process.env.color_embed)
            .setAuthor({ name: user.tag, iconURL: `https://i.imgur.com/${statusType[presence?.status || 'invisible']}.png` })
            .setThumbnail(user.avatarURL({ size: 1024 }))
            .setImage(user.bannerURL({ size: 1024 }))
            .addFields({ name: 'ID', value: `:credit_card: ${user.id}` })
            .addFields({ name: 'Activities', value: presence?.activities.map(activity => `${activityType[activity.type]} ${activity.name}`).join('\n') || 'None' })
            .addFields({ name: 'Joined Server', value: `:handshake: <t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true })
            .addFields({ name: 'Account Created', value: `:calendar: <t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true })
            .addFields({ name: 'Nickname', value: `:detective:  ${target.nickname || 'None'}`, inline: true })
            .addFields({ name: `Roles (${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length})`, value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') || 'None'}` })
            .addFields({ name: `Badges (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : 'None' })
            .addFields({ name: 'Devices', value: devices.map(device => `${device.emoji} ${device.text}`).join('\n'), inline: true })
            .addFields({ name: 'Profile Color', value: `:art: ${user.hexAccentColor || 'None'}`, inline: true })
            .addFields({ name: 'Boosting Server', value: `:person_lifting_weights: ${roles.premiumSubscriberRole ? `Since <t:${parseInt(target.premiumSinceTimestamp / 1000)}:R>` : 'No'}`, inline: true })
            .addFields({ name: 'Banner', value: user.bannerURL() ? '** **' : ':flags: None' })
        if (user.bot) embed.setFooter({ text: 'This user is a BOT' })
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}