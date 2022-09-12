const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setActivity('Commands', { type: ActivityType.Listening });
    console.log(`Ready! Logged in as ${client.user.tag}.`);
  },
};
