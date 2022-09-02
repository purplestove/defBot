const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { guild, embedColor } = require('../../config.json');
const { isAdmin } = require('../helper-functions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trialinfo')
    .setDescription('Posts an embed with information for a new trial member.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select a user.')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
      return;
    }

    if (interaction.channelId !== guild.channelIds.memberGeneral) {
      await interaction.reply({
        content: `You can only use this command in ${guild.channelIds.memberGeneral}`,
        ephemeral: true,
      });
      return;
    }
    const target = interaction.options.getMember('target');

    const trialEmbed = new EmbedBuilder({
      color: parseInt(embedColor),
      title: `Trial Info for <@${target.id}>`,
      thumbnail: {
        url: target.user.displayAvatarURL(),
      },
      fields: [
        {
          name: '\u200b',
          value: 'Message for trial member.',
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.username}.`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      timestamp: new Date().toISOString(),
    });

    await interaction.reply({ embeds: [trialEmbed] });
  },
};
