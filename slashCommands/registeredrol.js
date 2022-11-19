const { SlashCommandBuilder } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('registerrol')
        .setDescription('kayıtlı rol ayarlar.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription("kayıtlı rolü etiketle.")
                .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen kayıtlı rol ayarlayamazsın.", ephemeral: true});

        let role = await interaction.options.getRole('role');

        db.set(`kayıtlı_${interaction.guild.id}`, role.id)

        interaction.reply({content: "kayıtlı rol ayarlandı.", ephemeral: true})

    },
};