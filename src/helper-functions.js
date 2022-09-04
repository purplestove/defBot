const util = require('minecraft-server-util');
const { guild } = require('../config.json');

exports.isBotSpamChannel = (channelId) => {
  const botSpamChannels = Object.getOwnPropertyNames(
    guild.channelIds.botSpam
  ).map((key) => guild.channelIds.botSpam[key]);

  return botSpamChannels.includes(channelId);
};

exports.isAdmin = (member) => member.roles.cache.has(guild.roleIds.admin);

exports.getServerStatus = async (host, port) => {
  const options = { enableSRV: true };
  const response = await util.queryFull(host, port, options);
  return response;
};
