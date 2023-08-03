import { Autocomplete } from '../../structures/Autocomplete';
import type { ApplicationCommandOptionChoiceData } from 'discord.js';

export default new Autocomplete('chemical-element', async (client, interaction) => {

   const input = interaction.options.getFocused().toLowerCase();
   const chemicalElements = require('../../../data/chemical_elements.json');

   function mapElements(elements: any[]): ApplicationCommandOptionChoiceData[] {

      return elements
               .map((el) => ({
                  name: `${el.NAME} (${el.SYMBOL})`,
                  value: el.NAME.toLowerCase()
               }))
               .slice(0, 10);

   }

   let choices = [];

   if (!input.length) {

      choices = mapElements(chemicalElements);

   } else {

      const foundElements = chemicalElements.filter((el) => el.NAME.toLowerCase() === input || el.NAME.toLowerCase().includes(input) || el.SYMBOL.toLowerCase() === input);

      choices = !foundElements.length
                  ? [{ name: 'No chemical element found.', value: '' }]
                  : mapElements(foundElements);

   }

   await interaction.respond(choices);

});