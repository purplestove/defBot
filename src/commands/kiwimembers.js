const { SlashCommandBuilder } = require('discord.js');
const { guildId } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiwimembers')
    .setDescription('Lists all members of the KiwiTech Minecraft Server.'),
  async execute(interaction) {
    const guild = await interaction.client.guilds.cache.get(guildId);
    console.log(guild);
  },
};
