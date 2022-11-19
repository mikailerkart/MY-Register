const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "moderation",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong! ile yanıt verir.'),
	async execute(client, interaction) {
		await interaction.reply('Pong!');
	},
};