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
    // this check is technically not necessary because you can limit the usage of the command in the server settings.
    if (!isAdmin(interaction.member)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
      return;
    }
    // this check also not necessary
    if (interaction.channelId !== guild.channelIds.memberGeneral) {
      await interaction.reply({
        content: `You can only use this command in <#${guild.channelIds.memberGeneral}>!`,
        ephemeral: true,
      });
      return;
    }
    const target = interaction.options.getMember('target');

    const trialEmbed = new EmbedBuilder({
      color: parseInt(embedColor),
      title: `${guild.emojis.kiwi}  Welcome to KiwiTech ${target.user.username}!  ${guild.emojis.kiwi}`,
      thumbnail: {
        url: target.user.displayAvatarURL(),
      },
      fields: [
        {
          name: `${guild.emojis.owoKiwi}  Server Tour`,
          value:
            'Please let us know, when you have time for the server tour. Make sure to take your time, it will most likely take around two hours. You will be whitelisted once the tour starts.',
        },
        {
          name: `${guild.emojis.owoKiwi}  Mods & Resources`,
          value: `On KiwiTech we share our waypoints with a mod that Earthcomputer wrote. You can find it in <#${guild.channelIds.modsResources}>. Also make sure to put the mod for instamineable deepslate in your mods-folder.`,
        },
        {
          name: `${guild.emojis.owoKiwi}  Server Info`,
          value: `You can find the IPs of our servers in <#${guild.channelIds.serverInfo}>. There is also instructions on how to connect to KiwiTech using KCP. This is especially useful if you live outside of Europe and/or have unstable connection. Make sure to also read the SMP rules.`,
        },
        {
          name: `${guild.emojis.owoKiwi}  Todo on KiwiTech`,
          value: `When you got your trial member role, we also gave you the Kiwi Inc. role. This role gets pinged from time to time to inform active SMP players about new projects or important things to do on our servers. You can check out our <#${guild.channelIds.todoList}> to see what needs to be done or bring your own ideas and discuss them with us.`,
        },
        {
          name: '\u200b',
          value: `*The most important thing on KiwiTech is to have fun! If you have any questions, you can always ask us anything in member channels or ingame. We are also active in VC!*  ${guild.emojis.froghypers}`,
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.username}.`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      timestamp: Date.now(),
    });

    await interaction.reply({
      content: `<@${target.user.id}>`,
      embeds: [trialEmbed],
    });

    await interaction.editReply({
      content: '\u200b',
      embeds: [trialEmbed],
    });
  },
};
