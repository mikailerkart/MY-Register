const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('unregisterrol')
        .setDescription('kayıtsız rol ayarlar.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription("kayıtsız rolü etiketle.")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen kayıtlı rol ayarlayamazsın.", ephemeral: true});

        let role = await interaction.options.getRole('role');

        db.set(`kayıtsız_${interaction.guild.id}`, role.id)

        interaction.reply({content: "kayıtsız rol ayarlandı.", ephemeral: true})

    },
};