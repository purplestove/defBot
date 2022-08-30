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
      // check, if the command is being used in a bot-spam channel
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
      // create an invitelink, use the same if it already exits.
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
      // check for admin role
      if (!interaction.member.roles.cache.has(guild.roleIds.admin)) {
        await interaction.reply({
          content:
            'You do not have the required permission to use this command!',
          ephemeral: true,
        });
        return;
      }
      // check for correct channel
      if (interaction.channelId !== guild.channelIds.botSpam.admin) {
        await interaction.reply({
          content: `You can only use this command in <#${guild.channelIds.botSpam.admin}>!`,
          ephemeral: true,
        });
        return;
      }

      const targetUser = interaction.options.getMember('target');

      if (!targetUser) {
        await interaction.reply({
          content: 'Cannot find that user!',
          ephemeral: true,
        });
        return;
      }

      const roles = targetUser.roles.cache
        .filter((role) => role.name !== '@everyone')
        .sort((roleA, roleB) => roleB.positon - roleA.position);

      const userEmbed = new EmbedBuilder({
        color: targetUser.roles.color?.color,
        title: 'User Information',
        thumbnail: { url: targetUser.user.displayAvatarURL() },
        fields: [
          { name: 'Username', value: targetUser.user.tag },
          { name: 'User ID', value: targetUser.user.id },
          {
            name: 'Joined Discord on',
            value: `${time(targetUser.user.createdAt, 'D')}\n(${time(
              targetUser.user.createdAt,
              'R'
            )})`,
            inline: true,
          },
          {
            name: 'Joined this server on',
            value: `${time(targetUser.joinedAt, 'D')}\n(${time(
              targetUser.joinedAt,
              'R'
            )})`,
            inline: true,
          },
          { name: 'Roles', value: roles.toJSON().join(', ') || 'None' },
        ],
        footer: {
          text: `Requested by ${interaction.user.username}.`,
          iconURL: interaction.user.displayAvatarURL(),
        },
        timestamp: new Date().toISOString(),
      });

      await interaction.reply({ embeds: [userEmbed] });
    } else if (interaction.options.getSubcommand() === 'members') {
      // do another thing
    }
  },
};
