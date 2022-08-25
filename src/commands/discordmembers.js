const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discordmembers')
    .setDescription('Returns the amount of members on the Discord Server.'),
  async execute(interaction) {
    await interaction.reply({ content: `**Total members:** ${interaction.guild.memberCount}`, ephemeral: true });
  },
};
