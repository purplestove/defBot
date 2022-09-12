const { SlashCommandBuilder, inlineCode, bold } = require('discord.js');
const util = require('minecraft-server-util');
const {
  buildDefaultEmbed,
  runRconCommand,
  escapeMarkdown,
} = require('../helper-functions');
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

      const options = { timeout: 1000 * 5 };
      const rcon = new util.RCON();

      try {
        const whitelistCheck = [];
        const opCheck = [];

        for (const s of props) {
          const { ip, rconPort, rconPassword } = server[s];

          await rcon.connect(ip, rconPort, options);
          await rcon.login(rconPassword, options);

          const whitelistData = await rcon.execute(`whitelist add ${ign}`);
          whitelistCheck.push(whitelistData);

          if (server[s].operator === true) {
            const opData = await rcon.execute(`op ${ign}`);
            opCheck.push(opData);
          }
          await rcon.close();
        }

        console.log(whitelistCheck);
        console.log(opCheck);

        await interaction.editReply(
          `Successfully added ${inlineCode(ign)} to the whitelist on ${bold(
            whitelistCheck.length
          )} servers.\nSuccessfully made ${inlineCode(
            ign
          )} an operator on ${bold(opCheck.length)} servers.`
        );
      } catch (err) {
        console.error(err);
        await interaction.editReply(
          'Something went wrong trying to execute this command! Please check if all servers are currently online.'
        );
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      const ign = interaction.options.getString('ign');
      const props = Object.getOwnPropertyNames(server);

      const options = { timeout: 1000 * 5 };
      const rcon = new util.RCON();

      try {
        const whitelistCheck = [];
        const opCheck = [];

        for (const s of props) {
          const { ip, rconPort, rconPassword } = server[s];

          await rcon.connect(ip, rconPort, options);
          await rcon.login(rconPassword, options);

          const whitelistData = await rcon.execute(`whitelist remove ${ign}`);
          whitelistCheck.push(whitelistData);

          if (server[s].operator === true) {
            const opData = await rcon.execute(`deop ${ign}`);
            opCheck.push(opData);
          }
          await rcon.close();
        }

        await interaction.editReply(
          `Successfully removed ${inlineCode(ign)} from the whitelist on ${bold(
            whitelistCheck.length
          )} servers.\nSuccessfully removed ${inlineCode(
            ign
          )} as an operator on ${bold(opCheck.length)} servers.`
        );
      } catch (err) {
        console.error(err);
        await interaction.editReply(
          'Something went wrong trying to execute this command! Please check if all servers are currently online.'
        );
      }
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
        const whitelist = whitelistNames[1]
          .split(', ')
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          .map(escapeMarkdown)
          .join('\n');

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
