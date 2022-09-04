const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const { getServerStatus } = require('../helper-functions');
const { server, embedColor } = require('../../config.json');

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
          { name: 'Copy', value: 'Copy' }
        )
    ),
  async execute(interaction) {
    const choice = interaction.options.getString('server');

    const statusEmbed = new EmbedBuilder({
      color: parseInt(embedColor),
      title: `Kiwitech ${choice}`,
      thumbnail: {
        url: interaction.guild.iconURL(),
      },
      footer: {
        text: `Requested by ${interaction.user.username}.`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      timestamp: Date.now(),
    });

    if (choice === 'SMP') {
      // do something
    } else if (choice === 'CMP') {
      // do something else
    } else if (choice === 'CMP2') {
      // do something else
    } else if (choice === 'Copy') {
      await interaction.deferReply();

      try {
        const result = await getServerStatus(server.copy.ip, server.copy.port);
        const playerlist =
          result.players.list.toString().replaceAll(',', '\n') ||
          'There is currently nobody online!';

        statusEmbed.addFields([
          { name: 'Status', value: 'Online' },
          { name: 'MOTD', value: result.motd.clean },
          { name: 'Version', value: result.version },
          {
            name: 'Playercount',
            value: `online: ${result.players.online} | max: ${result.players.max}`,
          },
          {
            name: 'Playerlist',
            value: playerlist,
          },
        ]);
        await interaction.editReply({ embeds: [statusEmbed] });
      } catch (err) {
        console.error(err);
        await interaction.editReply({
          content: 'Server offline or unreachable!',
        });
      }
    }
  },
};
