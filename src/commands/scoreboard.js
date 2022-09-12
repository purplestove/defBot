const { SlashCommandBuilder } = require('discord.js');
const { server } = require('../../config.json');
const { queryScoreboard } = require('../helper-functions');
const { scoreboardToImage } = require('../image-functions');

const choices = [
  { name: 'Mined', value: 'm-' },
  { name: 'Used', value: 'u-' },
  { name: 'Crafted', value: 'c-' },
  { name: 'Broken (tools)', value: 'b-' },
  { name: 'Picked up', value: 'p-' },
  { name: 'Dropper', value: 'd-' },
  { name: 'Killed', value: 'k-' },
  { name: 'KIlled by', value: 'kb-' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scoreboard')
    .setDescription('Get a scoreboard.')
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('Action to search for.')
        .setRequired(true)
        .addChoices(...choices)
    )
    .addStringOption((option) =>
      option
        .setName('item')
        .setDescription('item to search for.')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    // TODO: scoreboard for a player only
    // TODO: same display as ingame (only 15 players) or full display
    // TODO: remove bots ?
    // TODO: add custom objective
    const objective = interaction.options.getString('item');
    const action = interaction.options.getString('action');

    const scores = await queryScoreboard(server.test, objective);

    const choice = choices.find((x) => x.value === action);

    const pretifiedObjective = objective.replace(action, `${choice.name} `);

    const buffer = scoreboardToImage(pretifiedObjective, scores);

    await interaction.editReply({ files: [{ attachment: buffer }] });
  },
};
