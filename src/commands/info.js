const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');
const { guild, embedColor } = require('../../config.json');
const { isBotSpamChannel, isAdmin } = require('../helper-functions');

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
      if (!isBotSpamChannel(interaction.channelId)) {
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
        title: `Server Info ${interaction.guild.name}`,
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
        timestamp: Date.now(),
      });

      await interaction.reply({ embeds: [serverEmbed] });
    } else if (interaction.options.getSubcommand() === 'user') {
      if (!isAdmin(interaction.member)) {
        await interaction.reply({
          content:
            'You do not have the required permission to use this command!',
          ephemeral: true,
        });
        return;
      }

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
        .sort((roleA, roleB) => roleB.position - roleA.position);

      const userEmbed = new EmbedBuilder({
        color: targetUser.roles.color?.color,
        title: 'User Info',
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
        timestamp: Date.now(),
      });

      await interaction.reply({ embeds: [userEmbed] });
    } else if (interaction.options.getSubcommand() === 'members') {
      if (!isBotSpamChannel) {
        await interaction.reply({
          content: 'You can only use this command in bot-spam channels!',
          ephemeral: true,
        });
        return;
      }

      await interaction.guild.members.fetch();

      const minecraftMembers = interaction.guild.roles.cache
        .get(guild.roleIds.member)
        .members.map((m) => m.user.username)
        .toString()
        .replaceAll(',', '\n');

      const minecraftMemberCount = interaction.guild.roles.cache
        .get(guild.roleIds.member)
        .members.map((m) => m.user.username).length;

      const memberEmbed = new EmbedBuilder({
        color: parseInt(embedColor),
        title: `Member Info ${interaction.guild.name}`,
        thumbnail: {
          url: interaction.guild.iconURL(),
        },
        fields: [
          {
            name: 'Memberlist',
            value: minecraftMembers,
          },
          {
            name: 'Membercount',
            value: minecraftMemberCount,
          },
        ],
        footer: {
          text: `Requested by ${interaction.user.username}.`,
          iconURL: interaction.user.displayAvatarURL(),
        },
        timestamp: Date.now(),
      });

      await interaction.deferReply();
      await interaction.editReply({ embeds: [memberEmbed] });
    }
  },
};
