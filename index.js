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
        .setTitle("**Bir ??ye aram??za kat??ld??.**")
        .setDescription(`${member} **Sunucumuza ho?? geldiniz.**\n\n**Kay??t olmak i??in ${staffRole} rol??ndeki yetkilileri etiketlemeyi unutma.**`)
        .setColor("#FFFFFF")
        .setTimestamp()

    member.guild.channels.cache.find(c => c.name.toLowerCase() == "register-chat").send({ content: `${staffRole} ${member}`, embeds: [embed] }); // register chat

    */
    let role = member.guild.roles.cache.find(r => r.name.toLowerCase() == "kay??ts??z"); // unregister role

    if (!role) return;

    member.roles.add(role)
    member.setNickname("Kay??ts??z")

});

const modal1 = new ModalBuilder()
        .setCustomId('erkekform')
        .setTitle('kay??t ol.')
        
        const a1 = new TextInputBuilder()
            .setCustomId('erkekname')
            .setLabel('??sim')
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setPlaceholder('Mikail')
            .setRequired(true)

        const a2 = new TextInputBuilder()
            .setCustomId('erkekage')
            .setLabel('Ya??')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder('22')
            .setRequired(true)

        const row1 = new ActionRowBuilder().addComponents(a1);
        const row2 = new ActionRowBuilder().addComponents(a2);

        modal1.addComponents(row1, row2)

const modal2 = new ModalBuilder()
        .setCustomId('k??zform')
        .setTitle('kay??t ol.')

        const a3 = new TextInputBuilder()
            .setCustomId('k??zname')
            .setLabel('??sim')
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setPlaceholder('Sena')
            .setRequired(true)

        const a4 = new TextInputBuilder()
            .setCustomId('k??zage')
            .setLabel('Ya??')
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
    }else if(interaction.customId === 'k??z'){
        await interaction.showModal(modal2)
    }
});

client.on('interactionCreate', async (interaction) => {

    let chatKanal = db.fetch(`chatkanal??_${interaction.guild.id}`)
    let channelLog = db.fetch(`log_${interaction.guild.id}`)
    let kay??tKanal = db.fetch(`kay??tkanal??_${interaction.guild.id}`)

    if(interaction.type == InteractionType.ModalSubmit) {

    if(interaction.customId === 'erkekform'){

        const erkekname = interaction.fields.getTextInputValue('erkekname')
        const erkekage = interaction.fields.getTextInputValue('erkekage')

        const erkekembed = new EmbedBuilder()
            .setTitle('Erkek kay??t formu')
            .setDescription(`Kullan??c??: ${interaction.user}\n\n??sim: **${erkekname}**\n\nYa??: **${erkekage}**\n\nCinsiyet: **Erkek**`)
            .setColor('#007fff')

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setLabel("Kay??t et")
                .setStyle(ButtonStyle.Success)
                .setCustomId('erkekkay??tet'),

            new ButtonBuilder()
                .setLabel("??ptal et")
                .setStyle(ButtonStyle.Danger)
                .setCustomId('erkekkay??tiptal')
        )
        
        await interaction.reply({content: "Form ba??ar??yla g??nderildi.", ephemeral: true})

        client.channels.cache.get(kay??tKanal).send({embeds: [erkekembed], components: [row]}).then(async m => {
            db.set(`kullan??c??_${m.id}`, interaction.user.id)
            db.set(`kullan??c??_isim_${m.id}`, erkekname)
            db.set(`kullan??c??_age_${m.id}`, erkekage)
        })
    
    }

}

 if (interaction.customId === 'k??zform'){

    const k??zname = interaction.fields.getTextInputValue('k??zname')
    const k??zage = interaction.fields.getTextInputValue('k??zage')

    const k??zembed = new EmbedBuilder()
        .setTitle('K??z kay??t formu')
        .setDescription(`Kullan??c??: ${interaction.user}\n\n??sim: **${k??zname}**\n\nYa??: **${k??zage}**\n\nCinsiyet: **K??z**`)
        .setColor('#007fff')

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setLabel("Kay??t et")
            .setStyle(ButtonStyle.Success)
            .setCustomId('k??zkay??tet'),

        new ButtonBuilder()
            .setLabel("??ptal et")
            .setStyle(ButtonStyle.Danger)
            .setCustomId('k??zkay??tiptal')
    )
    
    await interaction.reply({content: "Form ba??ar??yla g??nderildi.", ephemeral: true})

    client.channels.cache.get(kay??tKanal).send({embeds: [k??zembed], components: [row]}).then(async m => {
        db.set(`kullan??c??_${m.id}`, interaction.user.id)
        db.set(`kullan??c??_isim_${m.id}`, k??zname)
        db.set(`kullan??c??_age_${m.id}`, k??zage)
    })


} 
else if (interaction.isButton()) {

    if (interaction.customId === 'erkekkay??tiptal'){

        let message = interaction.message

        message.delete()

        interaction.reply({content: "Kay??t iptal edildi", ephemeral: true})

    }

    if (interaction.customId === 'k??zkay??tiptal'){

        let message = interaction.message

        message.delete()

        interaction.reply({content: "Kay??t iptal edildi", ephemeral: true})

    }

    if(interaction.customId === 'erkekkay??tet'){

        let message = interaction.message

        message.delete()

        let kullan??c?? = db.fetch(`kullan??c??_${interaction.message.id}`)
        let kay??tl??rol = db.fetch(`kay??tl??_${interaction.guild.id}`)
        let Kay??ts??zrol = db.fetch(`kay??ts??z_${interaction.guild.id}`)
        let erkekrol = db.fetch(`erkekrol_${interaction.guild.id}`)
        let member = interaction.guild.members.cache.get(kullan??c??)
        let name = db.fetch(`kullan??c??_isim_${interaction.message.id}`)
        let age = db.fetch(`kullan??c??_age_${interaction.message.id}`)

        member.roles.add(kay??tl??rol)
        member.roles.add(erkekrol)
        member.roles.remove(Kay??ts??zrol)
        member.setNickname(`${name} | ${age}`)
        interaction.reply({content: "Ba??ar??yla kay??t edildi", ephemeral: true})

        var erkekembed = new EmbedBuilder()
        .setTitle(`Kay??t yap??ld??`)
        .setDescription(`Kullan??c??: <@${kullan??c??}>\n??sim ve Ya??: ${name} ${age}\nYetkili: ${interaction.member}\nCinsiyet: **Erkek**`)
        .setColor('#007fff')
        .setTimestamp()

        client.channels.cache.get(channelLog).send({embeds: [erkekembed]})
        client.channels.cache.get(chatKanal).send(`<@${kullan??c??}> Sunucumuza ho?? geldin <3.`)

    }

    if(interaction.customId === 'k??zkay??tet'){

        let message = interaction.message

        message.delete()

        let kullan??c?? = db.fetch(`kullan??c??_${interaction.message.id}`)
        let kay??tl??rol = db.fetch(`kay??tl??_${interaction.guild.id}`)
        let Kay??ts??zrol = db.fetch(`kay??ts??z_${interaction.guild.id}`)
        let k??zrol = db.fetch(`k??zrol_${interaction.guild.id}`)
        let member = interaction.guild.members.cache.get(kullan??c??)
        let name = db.fetch(`kullan??c??_isim_${interaction.message.id}`)
        let age = db.fetch(`kullan??c??_age_${interaction.message.id}`)


        member.roles.add(kay??tl??rol)
        member.roles.add(k??zrol)
        member.roles.remove(Kay??ts??zrol)
        member.setNickname(`${name} | ${age}`)
        interaction.reply({content: "Ba??ar??yla kay??t edildi", ephemeral: true})

        var k??zembed = new EmbedBuilder()
        .setTitle(`Kay??t yap??ld??`)
        .setDescription(`Kullan??c??: <@${kullan??c??}>\n??sim ve Ya??: ${name} ${age}\nYetkili: ${interaction.member}\nCinsiyet: **K??z**`)
        .setColor('#007fff')
        .setTimestamp()

        client.channels.cache.get(channelLog).send({embeds: [k??zembed]})
        client.channels.cache.get(chatKanal).send(`<@${kullan??c??}> Sunucumuza ho?? geldin <3.`)

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