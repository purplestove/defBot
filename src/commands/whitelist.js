const { SlashCommandBuilder } = require('discord.js');
const { buildDefaultEmbed } = require('../helper-functions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Get information about the whitelist & add/remove users.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription(
          'Add a Player to the Whitelist on all Minecraft Servers.'
        )
        .addStringOption((option) =>
          option
            .setName('IGN')
            .setDescription('The Players In-Game-Name.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription(
          'Remove a Player from the Whitelist on all Minecraft Servers.'
        )
        .addStringOption((option) =>
          option
            .setName('IGN')
            .setDescription('The Players In-Game-Name.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('Lists all whitelisted')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'add') {
      // do something
    } else if (interaction.options.getSubcommand() === 'remove') {
      // do something else
    } else if (interaction.options.getSubcommand() === 'list') {
      // do something else
    }
  },
};
