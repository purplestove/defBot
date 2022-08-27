const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { memberRoleId } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiwimembers')
    .setDescription('Lists all members of the KiwiTech Minecraft Server.'),
  async execute(interaction) {
    try {
      await interaction.guild.members.fetch();

      const kiwiMembers = await interaction.guild.roles.cache
        .get(memberRoleId)
        .members.map((m) => m.user.username)
        .toString()
        .replaceAll(',', '\n');

      const KiwiMemberEmbed = await new EmbedBuilder()
        .setColor('#35aa78')
        .setAuthor({
          name: interaction.user.client.user.username,
          iconURL: interaction.user.client.user.displayAvatarURL(),
        })
        .setThumbnail(interaction.guild.iconURL())
        .addFields({ name: 'KiwiTech Memberlist', value: kiwiMembers })
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.username}.`,
          iconURL: interaction.user.displayAvatarURL(),
        });
      // deferReply() function might be needed, if all of the above tasks take longer than 3 seconds.
      await interaction.deferReply();
      await interaction.editReply({ embeds: [KiwiMemberEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
};
