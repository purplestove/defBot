const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiwimembers')
    .setDescription('Lists all members of the KiwiTech Minecraft Server.'),
  async execute(interaction) {
    await interaction.reply('This Does not work yet.');
  },
};
