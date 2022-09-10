const { SlashCommandBuilder } = require('discord.js');
const { buildDefaultEmbed, runRconCommand } = require('../helper-functions');
const { server } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Get information about the whitelist & add/remove users.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription(
          'Adds a Player to the Whitelist on all Minecraft Servers.'
        )
        .addStringOption((option) =>
          option
            .setName('ign')
            .setDescription('The Players In-Game Name.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription(
          'Removes a Player from the Whitelist on all Minecraft Servers.'
        )
        .addStringOption((option) =>
          option
            .setName('ign')
            .setDescription('The Players In-Game Name.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('Returns the Whitelist.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want the Whitelist from.')
            .setRequired(true)
            .addChoices(
              { name: 'smp', value: 'smp' },
              { name: 'cmp', value: 'cmp' },
              { name: 'cmp2', value: 'cmp2' },
              { name: 'copy', value: 'copy' },
              { name: 'snapshots', value: 'snapshots' }
            )
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    if (interaction.options.getSubcommand() === 'add') {
      const ign = interaction.options.getString('ign');
      const props = Object.getOwnPropertyNames(server);
      console.log(props);
      await interaction.editReply(ign);
    } else if (interaction.options.getSubcommand() === 'remove') {
      // do something else
    } else if (interaction.options.getSubcommand() === 'list') {
      const choice = interaction.options.getString('server');

      const { ip, rconPort, rconPassword } = server[choice];

      try {
        const response = await runRconCommand(
          ip,
          rconPort,
          rconPassword,
          'whitelist list'
        );

        if (response === 'There are no whitelisted players') {
          await interaction.editReply('There are no whitelisted players!');
          return;
        }

        const whitelistNames = response.split(': ');
        const whitelist = whitelistNames[1].toString().replaceAll(', ', '\n');

        const whitelistEmbed = buildDefaultEmbed(interaction.user)
          .setTitle(`${choice.toUpperCase()} Whitelist`)
          .setThumbnail(interaction.guild.iconURL())
          .setDescription(whitelist);

        interaction.editReply({ embeds: [whitelistEmbed] });
      } catch (err) {
        console.error(err);
        await interaction.editReply('Server offline or unreachable!');
      }
    }
  },
};
