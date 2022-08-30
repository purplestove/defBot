const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');
const { guild, embedColor } = require('../../config.json');

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
      if (
        !Object.getOwnPropertyNames(guild.channelIds.botSpam)
          .map((keys) => guild.channelIds.botSpam[keys])
          .includes(interaction.channelId)
      ) {
        await interaction.reply({
          content: 'You can only use this command in bot-spam channels!',
          ephemeral: true,
        });
        return;
      }
      const inviteLink = await interaction.guild.invites.create(
        guild.channelIds.general,
        {
          maxAge: 0,
          maxUses: 0,
          unique: false,
        }
      );

      const serverEmbed = new EmbedBuilder({
        color: parseInt(embedColor),
        title: `${interaction.guild.name} Server Info`,
        thumbnail: {
          url: interaction.guild.iconURL(),
        },
        fields: [
          {
            name: 'Membercount',
            value: interaction.guild.memberCount,
          },
          {
            name: 'Guild created',
            value: `${time(interaction.guild.createdAt, 'D')}\n(${time(
              interaction.guild.createdAt,
              'R'
            )})`,
          },
          {
            name: 'Permanent Invite Link',
            value: inviteLink.url,
          },
        ],
        footer: {
          text: `Requested by ${interaction.user.username}.`,
          iconURL: interaction.user.displayAvatarURL(),
        },
        timestamp: new Date().toISOString(),
      });

      await interaction.reply({ embeds: [serverEmbed] });
    } else if (interaction.options.getSubcommand() === 'user') {
      // do something else
    } else if (interaction.options.getSubcommand() === 'members') {
      // do another thing
    }
  },
};
