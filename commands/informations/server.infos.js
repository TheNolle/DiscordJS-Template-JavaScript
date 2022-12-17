const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, GuildExplicitContentFilter, GuildNSFWLevel, GuildVerificationLevel } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('serverinfo').setDescription('Returns server related informations.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const { guild } = interaction
        const { members, channels, emojis, roles, stickers } = guild
        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position)
        const userRoles = sortedRoles.filter(role => !role.managed)
        const managedRoles = sortedRoles.filter(role => role.managed)
        const botCount = members.cache.filter(member => member.user.bot).size
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
        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator)
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
            return separator ? splitPascal(pascal, separator) : pascal
        }
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size
        const totalChannels = getChannelTypeSize([
            ChannelType.GuildText,
            ChannelType.GuildAnnouncement,
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
            ChannelType.GuildForum,
            ChannelType.PublicThread,
            ChannelType.PrivateThread,
            ChannelType.AnnouncementThread,
            ChannelType.GuildCategory
        ])
        const embed = new EmbedBuilder()
            .setColor(process.env.color_embed)
            .setTitle(`${guild.name}'s Information`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields({
                name: 'Description',
                value: `:pencil: ${guild.description || 'None'}`
            })
            .addFields({
                name: 'General',
                value: `
                :scroll: **Created** <t:${parseInt(guild.createdTimestamp / 1000)}:R>,
                :credit_card: **ID** ${guild.id},
                :crown: **Owner** <@${guild.ownerId}>,
                :earth_africa: **Language** ${new Intl.DisplayNames(['en'], { type: 'language' }).of(guild.preferredLocale)},
                :computer: **Vanity URL** ${guild.vanityURLCode || 'None'}
                `
            })
            .addFields({ name: 'Features', value: guild.features?.map(feature => `- ${toPascalCase(feature, ' ')}`)?.join('\n') || 'None', inline: true })
            .addFields({
                name: 'Security',
                value: `
                :eyes: **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], ' ')}
                :underage: **NSFW Level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], ' ')}
                :lock: **Verification Level** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], ' ')}
                `,
                inline: true
            })
            .addFields({
                name: `Users (${guild.memberCount})`,
                value: `
                :busts_in_silhouette: **Members** ${guild.memberCount - botCount}
                :robot: **Bots** ${botCount}
                `,
                inline: true
            })
            .addFields({ name: `User Roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') || 'None'}` })
            .addFields({ name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(' ') || 'None'}` })
            .addFields({
                name: `Channels, Threads & Categories (${totalChannels})`,
                value: `
                :speech_balloon: **Text** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}
                :microphone2: **Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}
                :thread: **Threads** ${getChannelTypeSize([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}
                :bookmark_tabs: **Categories** ${getChannelTypeSize([ChannelType.GuildCategory])}
                `,
                inline: true
            })
            .addFields({
                name: `Emojis & Stickers (${emojis.cache.size + stickers.cache.size})`,
                value: `
                :partying_face: **Animated** ${emojis.cache.filter(emoji => emoji.animated).size}
                :smile: **Static** ${emojis.cache.filter(emoji => !emoji.animated).size}
                :railway_track: **Stickers** ${stickers.cache.size}
                `,
                inline: true
            })
            .addFields({
                name: 'Nitro',
                value: `
                📈 **Tier** ${guild.premiumTier || 'None'}
                💪🏻 **Boosts** ${guild.premiumSubscriptionCount}
                💎 **Boosters** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}
                🏋🏻‍♀️ **Total Boosters** ${guild.members.cache.filter(member => member.premiumSince).size}
                `,
                inline: true
            })
            .addFields({ name: 'Banner', value: guild.bannerURL() ? '** **' : 'None' })
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}