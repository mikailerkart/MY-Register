const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("croxydb")

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('registeraction')
        .setDescription('kayıt button ile verir.')
        .addStringOption(option =>
            option.setName('ed')
                .setDescription("embed için açıklama")
                .setRequired(true))
        .addStringOption(option =>
                    option.setName('bl1')
                            .setDescription("erkek button için açıklama")
                            .setRequired(true))
        .addStringOption(option =>
                    option.setName('bl2')
                            .setDescription('kız button için açıklama')
                            .setRequired(true)),
    async execute(client, interaction) {

        if (!interaction.member.roles.cache.has('853318642434179174')) return interaction.reply({ content: "Sen kayıt embed + button ayarlayamazsın", ephemeral: true});

        let kayıtlı = db.fetch(`kayıtlı_${interaction.guild.id}`)

        if(!kayıtlı) return interaction.reply({ content: "Kayıtlı rolü ayarlamamışsın", ephemeral: true});

        let kayıtsız = db.fetch(`kayıtsız_${interaction.guild.id}`)

        if(!kayıtsız) return interaction.reply({ content: "Kayıtsız rolü ayarlamamışsın", ephemeral: true})

        let erkekrol = db.fetch(`erkekrol_${interaction.guild.id}`)

        if(!erkekrol) return interaction.reply({ content: "Erkek rolü ayarlamamışsın", ephemeral: true})

        let kızrol = db.fetch(`kızrol_${interaction.guild.id}`)

        if(!kızrol) return interaction.reply({ content: "Kız rolü ayarlamamışsın", ephemeral: true})

        let kayıtKanal = db.fetch(`kayıtkanalı_${interaction.guild.id}`)

        if(!kayıtKanal) return interaction({ content: "Kayıt kanalı ayarlamamışsın", ephemeral: true})

        let channelLog = db.fetch(`log_${interaction.guild.id}`)

        if(!channelLog) return interaction.reply({ content: "Kayıt-log ayarlamamışsın", ephemeral: true});

        let chatKanal = db.fetch(`kayıtkanalı_${interaction.guild.id}`)

        if(!chatKanal) return interaction.reply({ content: "chat kanalı ayarlamamışsın", ephemeral: true})

        let embedDescription = await interaction.options.getString("ed");

        let buttonLabel1 = await interaction.options.getString("bl1");

        let buttonLabel2 = await interaction.options.getString("bl2");

        var embed = new EmbedBuilder()
            .setTitle(`Kayıt ol.`)
            .setDescription(`${embedDescription}`)
            .setColor("#007fff")

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(`${buttonLabel1}`)
                .setCustomId('erkek')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel(`${buttonLabel2}`)
                .setCustomId('kız')
                .setStyle(ButtonStyle.Danger)
        )

        await interaction.reply({ content: `kayıt için buttonlu embed gönderildi.`, ephemeral: true})

        await interaction.channel.send({embeds: [embed], components: [row]})

    },
};