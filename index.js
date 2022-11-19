const { Client, GatewayIntentBits, Routes, EmbedBuilder, Collection, ActivityType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("./config.json");
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require("@discordjs/rest")
const db = require("croxydb");

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
const slashCommands = []

client.once("ready", () => {
    console.log(`${client.user.username} is online.`);

    let guildId = config.guildID;
    let clientId = config.clientID;
    let token = process.env.token;

    const rest = new REST({version: 10}).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands })
	    .then(() => console.log('Successfully registered application commands.'))
	    .catch(console.error); 

    const optionsPresence = [
        {
            type: ActivityType.Playing,
            name: "Underworld",
            status: "online",
            url: "https://discord.gg/SNXdvsstGR"
        },
        {
            type: ActivityType.Streaming,
            name: "Mikail <3",
            status: "online",
            url: "https://www.twitch.tv/mikailyone"
        },
        {
            type: ActivityType.Listening,
            name: "Ahmet Kaya - Yorgun Demokrat",
            status: "online",
            url: "https://open.spotify.com/track/1ffexZp7QsAa3R04gd6W2A?si=9bedda9622a14407"
        }
    ];

    setInterval(function() {

        let optionNumber = Math.floor(Math.random()* optionsPresence.length);

        client.user.setPresence({
            activities: [{name: optionsPresence[optionNumber].name, type: optionsPresence[optionNumber].type, url: optionsPresence[optionNumber].url }],
            status: optionsPresence[optionNumber].status
        })

    }, 60 * 1000);


});

const commandsPath = path.join(__dirname, 'slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());

    console.log(`De file ${command.data.name}.js is geladen`);
}



client.on('guildMemberAdd', async (member) => {

    /*
    let staffRole = member.guild.roles.cache.find(r => r.name.toLowerCase() == "register staff");

    var embed = new EmbedBuilder()
        .setTitle("**Bir üye aramıza katıldı.**")
        .setDescription(`${member} **Sunucumuza hoş geldiniz.**\n\n**Kayıt olmak için ${staffRole} rolündeki yetkilileri etiketlemeyi unutma.**`)
        .setColor("#FFFFFF")
        .setTimestamp()

    member.guild.channels.cache.find(c => c.name.toLowerCase() == "register-chat").send({ content: `${staffRole} ${member}`, embeds: [embed] }); // register chat

    */
    let role = member.guild.roles.cache.find(r => r.name.toLowerCase() == "kayıtsız"); // unregister role

    if (!role) return;

    member.roles.add(role)
    member.setNickname("Kayıtsız")

});

const modal1 = new ModalBuilder()
        .setCustomId('erkekform')
        .setTitle('kayıt ol.')
        
        const a1 = new TextInputBuilder()
            .setCustomId('erkekname')
            .setLabel('İsim')
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setPlaceholder('Mikail')
            .setRequired(true)

        const a2 = new TextInputBuilder()
            .setCustomId('erkekage')
            .setLabel('Yaş')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder('22')
            .setRequired(true)

        const row1 = new ActionRowBuilder().addComponents(a1);
        const row2 = new ActionRowBuilder().addComponents(a2);

        modal1.addComponents(row1, row2)

const modal2 = new ModalBuilder()
        .setCustomId('kızform')
        .setTitle('kayıt ol.')

        const a3 = new TextInputBuilder()
            .setCustomId('kızname')
            .setLabel('İsim')
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setPlaceholder('Sena')
            .setRequired(true)

        const a4 = new TextInputBuilder()
            .setCustomId('kızage')
            .setLabel('Yaş')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder('19')
            .setRequired(true)
        
        const row3 = new ActionRowBuilder().addComponents(a3)
        const row4 = new ActionRowBuilder().addComponents(a4)

        modal2.addComponents(row3, row4)


client.on('interactionCreate', async (interaction) => {

    if (interaction.customId === 'erkek'){
        await interaction.showModal(modal1)
    }else if(interaction.customId === 'kız'){
        await interaction.showModal(modal2)
    }
});

client.on('interactionCreate', async (interaction) => {

    let chatKanal = db.fetch(`chatkanalı_${interaction.guild.id}`)
    let channelLog = db.fetch(`log_${interaction.guild.id}`)
    let kayıtKanal = db.fetch(`kayıtkanalı_${interaction.guild.id}`)

    if(interaction.type == InteractionType.ModalSubmit) {

    if(interaction.customId === 'erkekform'){

        const erkekname = interaction.fields.getTextInputValue('erkekname')
        const erkekage = interaction.fields.getTextInputValue('erkekage')

        const erkekembed = new EmbedBuilder()
            .setTitle('Erkek kayıt formu')
            .setDescription(`Kullanıcı: ${interaction.user}\n\nİsim: **${erkekname}**\n\nYaş: **${erkekage}**\n\nCinsiyet: **Erkek**`)
            .setColor('#007fff')

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setLabel("Kayıt et")
                .setStyle(ButtonStyle.Success)
                .setCustomId('erkekkayıtet'),

            new ButtonBuilder()
                .setLabel("İptal et")
                .setStyle(ButtonStyle.Danger)
                .setCustomId('erkekkayıtiptal')
        )
        
        await interaction.reply({content: "Form başarıyla gönderildi.", ephemeral: true})

        client.channels.cache.get(kayıtKanal).send({embeds: [erkekembed], components: [row]}).then(async m => {
            db.set(`kullanıcı_${m.id}`, interaction.user.id)
            db.set(`kullanıcı_isim_${m.id}`, erkekname)
            db.set(`kullanıcı_age_${m.id}`, erkekage)
        })
    
    }

}

 if (interaction.customId === 'kızform'){

    const kızname = interaction.fields.getTextInputValue('kızname')
    const kızage = interaction.fields.getTextInputValue('kızage')

    const kızembed = new EmbedBuilder()
        .setTitle('Kız kayıt formu')
        .setDescription(`Kullanıcı: ${interaction.user}\n\nİsim: **${kızname}**\n\nYaş: **${kızage}**\n\nCinsiyet: **Kız**`)
        .setColor('#007fff')

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setLabel("Kayıt et")
            .setStyle(ButtonStyle.Success)
            .setCustomId('kızkayıtet'),

        new ButtonBuilder()
            .setLabel("İptal et")
            .setStyle(ButtonStyle.Danger)
            .setCustomId('kızkayıtiptal')
    )
    
    await interaction.reply({content: "Form başarıyla gönderildi.", ephemeral: true})

    client.channels.cache.get(kayıtKanal).send({embeds: [kızembed], components: [row]}).then(async m => {
        db.set(`kullanıcı_${m.id}`, interaction.user.id)
        db.set(`kullanıcı_isim_${m.id}`, kızname)
        db.set(`kullanıcı_age_${m.id}`, kızage)
    })


} 
else if (interaction.isButton()) {

    if (interaction.customId === 'erkekkayıtiptal'){

        let message = interaction.message

        message.delete()

    }

    if (interaction.customId === 'kızkayıtiptal'){

        let message = interaction.message

        message.delete()

    }

    if(interaction.customId === 'erkekkayıtet'){

        let message = interaction.message

        message.delete()

        let kullanıcı = db.fetch(`kullanıcı_${interaction.message.id}`)
        let kayıtlırol = db.fetch(`kayıtlı_${interaction.guild.id}`)
        let Kayıtsızrol = db.fetch(`kayıtsız_${interaction.guild.id}`)
        let erkekrol = db.fetch(`erkekrol_${interaction.guild.id}`)
        let member = interaction.guild.members.cache.get(kullanıcı)
        let name = db.fetch(`kullanıcı_isim_${interaction.message.id}`)
        let age = db.fetch(`kullanıcı_age_${interaction.message.id}`)

        member.roles.add(kayıtlırol)
        member.roles.add(erkekrol)
        member.roles.remove(Kayıtsızrol)
        member.setNickname(`${name} | ${age}`)
        interaction.reply({content: "Başarıyla kayıt edildi", ephemeral: true})

        var erkekembed = new EmbedBuilder()
        .setTitle(`Kayıt yapıldı`)
        .setDescription(`Kullanıcı: <@${kullanıcı}>\nİsim ve Yaş: ${name} ${age}\nYetkili: ${interaction.member}\nCinsiyet: **Erkek**`)
        .setColor('#007fff')
        .setTimestamp()

        client.channels.cache.get(channelLog).send({embeds: [erkekembed]})
        client.channels.cache.get(chatKanal).send(`<@${kullanıcı}> Sunucumuza hoş geldin <3.`)

    }

    if(interaction.customId === 'kızkayıtet'){

        let message = interaction.message

        message.delete()

        let kullanıcı = db.fetch(`kullanıcı_${interaction.message.id}`)
        let kayıtlırol = db.fetch(`kayıtlı_${interaction.guild.id}`)
        let Kayıtsızrol = db.fetch(`kayıtsız_${interaction.guild.id}`)
        let kızrol = db.fetch(`kızrol_${interaction.guild.id}`)
        let member = interaction.guild.members.cache.get(kullanıcı)
        let name = db.fetch(`kullanıcı_isim_${interaction.message.id}`)
        let age = db.fetch(`kullanıcı_age_${interaction.message.id}`)


        member.roles.add(kayıtlırol)
        member.roles.add(kızrol)
        member.roles.remove(Kayıtsızrol)
        member.setNickname(`${name} | ${age}`)
        interaction.reply({content: "Başarıyla kayıt edildi", ephemeral: true})

        var kızembed = new EmbedBuilder()
        .setTitle(`Kayıt yapıldı`)
        .setDescription(`Kullanıcı: <@${kullanıcı}>\nİsim ve Yaş: ${name} ${age}\nYetkili: ${interaction.member}\nCinsiyet: **Kız**`)
        .setColor('#007fff')
        .setTimestamp()

        client.channels.cache.get(channelLog).send({embeds: [kızembed]})
        client.channels.cache.get(chatKanal).send(`<@${kullanıcı}> Sunucumuza hoş geldin <3.`)

    }
}
});

client.on('interactionCreate', async (interaction) => {

    const command = client.commands.get(interaction.commandName);

	if (!command) return;
	
	    try {
		    await command.execute(client, interaction);
	    } catch (error) {
		    console.error(error);
		    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

});


client.login(process.env.token);