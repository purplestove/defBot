const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');
const { guild, embedColor } = require('../config.json');

exports.isAdmin = (member) => member.roles.cache.has(guild.roleIds.admin);

exports.getServerStatus = (host, port) =>
  util.queryFull(host, port, { enableSRV: true });

exports.toColumn = (arr) => arr.join('\n');

exports.escapeMarkdown = (text) => {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
  return escaped;
};

exports.buildDefaultEmbed = (user) =>
  new EmbedBuilder({
    color: parseInt(embedColor),
    footer: {
      text: `Requested by ${user.username}.`,
      iconURL: user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  });

exports.queryMSPT = async (host, port, rconPassword) => {
  const options = { timeout: 1000 * 5 };
  const rcon = new util.RCON();

  await rcon.connect(host, port, options);
  await rcon.login(rconPassword, options);

  const data = await rcon.execute(
    `script run reduce(system_info('server_last_tick_times'), _a+_, 0)/100`
  );

  await rcon.close();

  const mspt = (Math.round(parseFloat(data.split(' ')[2]) * 100) / 100).toFixed(
    2
  );
  let tps;

  if (mspt <= 50) {
    tps = '20.0';
  } else {
    tps = 1000 / mspt;
  }

  return { mspt, tps };
};

exports.queryScoreboard = async (serverData, scoreboard) => {
  const options = { timeout: 1000 * 5 };
  const rcon = new util.RCON();

  await rcon.connect(serverData.ip, serverData.rconPort, options);
  await rcon.login(serverData.rconPassword, options);

  const data = await rcon.execute(
    `script run scores = []; for(system_info('server_whitelist'), put(scores, null, l('"' + _ + '"', scoreboard('${scoreboard}', _)) )); print(scores)`
  );

  await rcon.close();

  const scores = data.split(' =')[0].replaceAll('null', 0);

  return JSON.parse(scores);
};

exports.runRconCommand = async (host, rconPort, rconPassword, command) => {
  const options = { timeout: 1000 * 5 };
  const rcon = new util.RCON();

  await rcon.connect(host, rconPort, options);
  await rcon.login(rconPassword, options);

  const data = await rcon.execute(command);

  await rcon.close();
  return data;
};
