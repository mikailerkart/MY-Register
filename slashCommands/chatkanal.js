const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('chatkanal')
        .setDescription('chat kanalı ayarlar')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription("chat için kanalı etiketle")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen chat kanalı ayarlayamazsın.", ephemeral: true});

        let chatKanal = await interaction.options.getChannel('channel');

        db.set(`chatkanalı_${interaction.guild.id}`, chatKanal.id)

        interaction.reply({content: "chat kanalı ayarlandı.", ephemeral: true})

    },
};