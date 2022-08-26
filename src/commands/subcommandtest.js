const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server.')
    .addSubcommand((subcommand1) =>
      subcommand1
        .setName('user')
        .setDescription('Info about a user')
        .addUserOption((option) =>
          option.setName('target').setDescription('The user')
        )
    )
    .addSubcommand((subcommand2) =>
      subcommand2.setName('server').setDescription('Info about the server')
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      const user = interaction.options.getUser('target');
      if (!user) {
        await interaction.reply('Cannot find the user!');
      }
      await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    } else if (interaction.options.getSubcommand() === 'server') {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    }
  },
};
