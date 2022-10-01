const objectivesJson = require('../assets/dictionary-1.19.json');

const objectives = Object.keys(objectivesJson).map((key) => key);

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === 'scoreboard') {
      const focusedOption = interaction.options.getFocused(true);
      const actionOption = interaction.options._hoistedOptions.find(
        (x) => x.name === 'action'
      );
      // <action> isn't supplied
      if (!actionOption) {
        await interaction.respond({});
      } else {
        const filtered = objectives.filter((choice) =>
          choice.startsWith(`${actionOption.value}${focusedOption.value}`)
        );
        await interaction.respond(
          filtered.slice(0, 25).map((choice) => ({
            name: choice.replace(actionOption.value, ''),
            value: choice,
          }))
        );
      }
    }
  },
};