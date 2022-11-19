const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('kayıt log ayarlar')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription("kayıt için kanalı etiketle")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen log kanalı ayarlayamazsın.", ephemeral: true});

        let channelLog = await interaction.options.getChannel('channel');

        db.set(`log_${interaction.guild.id}`, channelLog.id)

        interaction.reply({content: "kayıt-log kanalı ayarlandı.", ephemeral: true})

    },
};