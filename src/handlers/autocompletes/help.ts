import { Autocomplete } from '../../structures/Autocomplete';
import { CategoryNames } from '../../utils/CategoryNames';
import type { ApplicationCommandOptionChoiceData } from 'discord.js';

export default new Autocomplete('help', async (client, interaction) => {

   const input = interaction.options.getFocused().toLowerCase();

   let choices: ApplicationCommandOptionChoiceData[];

   function mapCommands(commands: typeof client.handlers.commands.cache): ApplicationCommandOptionChoiceData[] {

      return commands
         .map((c) => {
            return {
               name: `/${c.data.name} (${CategoryNames[c.data.category]})`,
               value: c.id
            }
         })
         .slice(0, 10);

   }

   if (!input.length) {

      choices = mapCommands(client.handlers.commands.cache);

   } else {

      const foundCommands = client.handlers.commands.cache.filter((c) => c.data.name === input || c.data.aliases.find((a) => a === input)?.length >= 1 || c.data.name.includes(input) || c.data.aliases.find((a) => a.includes(input))?.length >= 1);

      choices = !foundCommands.size
                  ? [{ name: 'No command found.', value: '' }]
                  : mapCommands(foundCommands);

   }

   interaction.respond(choices);

});