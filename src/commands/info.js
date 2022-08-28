const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about our server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('server')
        .setDescription('Get information about the KiwiTech Discord Server.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Get information about a user.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('Select a user.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('members')
        .setDescription('Lists the Members of the KiwiTech Minecraft Servers.')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'server') {
      if (interaction.channel_id !== )
    } else if (interaction.options.getSubcommand() === 'user') {
      // do something else
    } else if (interaction.options.getSubcommand() === 'members') {
      // do another thing
    } else {
      interaction.reply('This command does not exist!');
    }
  },
};
