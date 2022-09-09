const { SlashCommandBuilder } = require('discord.js');
const {
  getServerStatus,
  buildDefaultEmbed,
  toColumn,
  queryMSPT,
} = require('../helper-functions');
const { server } = require('../../config.json');

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
          { name: 'SMP', value: 'SMP' },
          { name: 'CMP', value: 'CMP' },
          { name: 'CMP2', value: 'CMP2' },
          { name: 'Copy', value: 'Copy' },
          { name: 'Snapshots', value: 'Snapshots' }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const choice = interaction.options.getString('server');
    const { ip, port, rconPort, rconPassword } = server[choice.toLowerCase()];

    try {
      const result = await getServerStatus(ip, port);
      const { mspt, tps } = await queryMSPT(ip, rconPort, rconPassword);

      const playerlist =
        toColumn(result.players.list) || 'There is currently nobody online!';

      const statusEmbed = buildDefaultEmbed(interaction.user)
        .setTitle(`KiwiTech ${choice}`)
        .setThumbnail(interaction.guild.iconURL())
        .addFields([
          { name: 'Status', value: 'Online' },
          { name: 'Version', value: result.version },
          { name: 'Performance', value: `**${mspt}** mspt | **${tps}** TPS` },
          {
            name: 'Playercount',
            value: `online: **${result.players.online}** | max: **${result.players.max}**`,
          },
          { name: 'Playerlist', value: playerlist },
        ]);

      statusEmbed.setColor('Green');

      if (mspt > 30 && mspt < 50) {
        statusEmbed.setColor('Yellow');
      } else if (mspt >= 50) {
        statusEmbed.setColor('Red');
      }

      await interaction.editReply({ embeds: [statusEmbed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('Server offline or unreachable!');
    }
  },
};
