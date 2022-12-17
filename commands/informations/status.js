const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, Client, UserFlags, version, ChannelType } = require('discord.js')
const os = require('os')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder().setName('status').setDescription('Displays the status of the client and database connection.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const channelType = type => client.channels.cache.filter(channel => type.includes(channel.type)).size
        const attachement = new AttachmentBuilder('./structures/images/logo.png')
        const embed = new EmbedBuilder()
            .setColor(process.env.color_embed)
            .setTitle(`${client.user.username}'s Status`)
            .setThumbnail('attachment://logo.png')
            .addFields({
                name: 'Description',
                value: `
                :pencil: ${JSON.parse(fs.readFileSync('package.json')).description || 'None'}
                `
            })
            .addFields({
                name: 'General',
                value: `
                :robot: **Client** ${client.user.tag}
                :credit_card: **ID** ${client.user.id}
                :calendar: **Created** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>
                :crown: **Owner** <@${interaction.guild.ownerId}> (${JSON.parse(fs.readFileSync('package.json')).author})
                :white_check_mark: **Verified** ${client.user.flags & UserFlags.VerifiedBot ? 'Yes' : 'No'}
                :keyboard: **Commands** ${client.commands.size}
                `
            })
            .addFields({
                name: 'System',
                inline: true,
                value: `
                :desktop: **Operating System** ${os.type().replace('Windows_NT', 'Windows').replace('Darwin', 'macOS')}
                :alarm_clock: **Up Since** <t:${parseInt(client.readyTimestamp / 1000)}:R>
                :ping_pong: **Ping** ${client.ws.ping}ms
                :brain: **CPU Model** ${os.cpus()[0].model}
                :floppy_disk: **CPU Usage** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%
                :books: **Database** ${'soon'}
                :rocket: **Node.js** ${process.version}
                :abacus: **Discord.js** ${version}
                `
            })
            .addFields({
                name: 'Statistics',
                inline: true,
                value: `
                :desktop: **Servers** ${client.guilds.cache.size}
                :busts_in_silhouette: **Users** ${client.users.cache.size}
                :grinning: **Emojis** ${client.emojis.cache.size}
                :speech_left: **Text Channels** ${channelType([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}
                :microphone2: **Voice Channels** ${channelType([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}
                :thread: **Threads** ${channelType([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}
                `
            })
        interaction.reply({ embeds: [embed], files: [attachement], ephemeral: true })
    }
}