const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('kayıtkanal')
        .setDescription('kayıt kanalı ayarlar')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription("kayıt için kanalı etiketle")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen kayıt kanalı ayarlayamazsın.", ephemeral: true});

        let kayıtkanal = await interaction.options.getChannel('channel');

        db.set(`kayıtkanalı_${interaction.guild.id}`, kayıtkanal.id)

        interaction.reply({content: "kayıt kanalı ayarlandı.", ephemeral: true})

    },
};