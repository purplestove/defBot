const { guild } = require('../config.json');

exports.isBotSpamChannel = (channelId) => {
  const botSpamChannels = Object.getOwnPropertyNames(
    guild.channelIds.botSpam
  ).map((key) => guild.channelIds.botSpam[key]);

  return botSpamChannels.includes(channelId);
};

exports.isAdmin = (member) => member.roles.cache.has(guild.roleIds.admin);
