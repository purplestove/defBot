const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Gets information about a user.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Select a user').setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getMember('target');

    if (!targetUser) {
      await interaction.reply('Cannot find that user!');
      return;
    }

    const userTag = targetUser.user.tag;
    const userId = targetUser.user.id;
    const userAvatar = targetUser.user.displayAvatarURL();
    const userCreationTime = targetUser.user.createdAt;
    const userJoinedAt = targetUser.joinedAt;
    const roleManager = targetUser.roles;
    const roles = roleManager.cache
      .filter((role) => role.name !== '@everyone')
      .sort((roleA, roleB) => roleB.positon - roleA.position);

    const userinfoEmbed = new EmbedBuilder({
      color: roleManager.color?.color,
      title: 'User Information',
      author: {
        name: interaction.user.client.user.username,
        iconURL: interaction.user.client.user.displayAvatarURL(),
      },
      thumbnail: { url: userAvatar },
      fields: [
        { name: 'Username', value: userTag },
        { name: 'User ID', value: userId },
        {
          name: 'Joined Discord on',
          value: `${time(userCreationTime, 'D')}\n(${time(
            userCreationTime,
            'R'
          )})`,
          inline: true,
        },
        {
          name: 'Joined this server on',
          value: `${time(userJoinedAt, 'D')}\n(${time(userJoinedAt, 'R')})`,
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

    await interaction.reply({ embeds: [userinfoEmbed] });
  },
};
