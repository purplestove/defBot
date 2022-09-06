const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');
const { guild, embedColor } = require('../config.json');

exports.isAdmin = (member) => member.roles.cache.has(guild.roleIds.admin);

exports.getServerStatus = async (host, port) => {
  const options = { enableSRV: true };
  const response = await util.queryFull(host, port, options);
  return response;
};

exports.toColumn = (arr) => arr.toString().replaceAll(',', '\n');

exports.buildDefaultEmbed = (user) =>
  new EmbedBuilder({
    color: parseInt(embedColor),
    footer: {
      text: `Requested by ${user.username}.`,
      iconURL: user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  });
