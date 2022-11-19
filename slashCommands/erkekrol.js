const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('erkekrol')
        .setDescription('erkek rol ayarlar.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription("erkek rolü etiketle.")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen erkek rol ayarlayamazsın.", ephemeral: true});

        let role = await interaction.options.getRole('role');

        db.set(`erkekrol_${interaction.guild.id}`, role.id)

        interaction.reply({content: "erkek rol ayarlandı.", ephemeral: true})

    },
};