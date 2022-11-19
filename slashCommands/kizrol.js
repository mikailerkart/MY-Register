const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('kızrol')
        .setDescription('kız rol ayarlar.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription("kız rolü etiketle.")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen kız rol ayarlayamazsın.", ephemeral: true});

        let role = await interaction.options.getRole('role');

        db.set(`kızrol_${interaction.guild.id}`, role.id)

        interaction.reply({content: "kız rol ayarlandı.", ephemeral: true})

    },
};