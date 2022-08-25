const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('optionstest')
    .setDescription('Test Option feature.')
    .addStringOption((option => 
      option.setName('input')
      .setDescription('Enter a string.')
      .setRequired(true)))
    .addIntegerOption((option => 
      option.setName('int')
      .setDescription('Enter a number.')
      .setRequired(true))),
  async execute(interaction) {
    const inputString = interaction.options.getString('input');
    const inputInteger = interaction.options.getInteger('int');

    await interaction.reply({ content: `You chose \`${inputString}\` as your string and \`${inputInteger}\` as your integer.`, ephemeral: true });
  }
};