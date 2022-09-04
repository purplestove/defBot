const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Get the status of a Minecraft Server.')
    .addStringOption((option) =>
      option
        .setName('server')
        .setDescription('The server you want info about.')
        .setRequired(true)
        .addChoices(
          { name: 'SMP', value: '\u200b' },
          { name: 'CMP', value: '\u200b' },
          { name: 'CMP2', value: '\u200b' },
          { name: 'Copy', value: '\u200b' }
        )
    ),
  async execute(interaction) {
    const serverChoice = interaction.options.getString('server');

    if (serverChoice === 'SMP') {
      // do something
    } else if (serverChoice === 'CMP') {
      // do something else
    } else if (serverChoice === 'CMP2') {
      // do something else
    } else if (serverChoice === 'Copy') {
      // do something else
    } else {
      await interaction.reply({
        content: `Could not find the server: ${serverChoice}`,
        ephemeral: true,
      });
      return;
    }
    await interaction.reply('test status command');
  },
};
