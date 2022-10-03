import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import axios from 'axios';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const chemicalElementName = ctx.interaction.options.getString('element');
   const foundElement = require('../../../../data/chemical_elements.json').find((el) => el.NAME.toLowerCase() === chemicalElementName);

   if (!foundElement)
      return void ctx.errorReply('Invalid Chemical Element', 'The provided element is invalid. Wait for the autocomplete to prompt you an existing one.');

   await ctx.interaction.deferReply();

   try {
      
      const { data } = await axios.get('https://api.popcat.xyz/periodic-table', { params: { element: chemicalElementName } });
      
      const chemicalElementEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `Chemical Element: ${data['name']} (${data['symbol']})` })
         .setThumbnail(data['image'])
         .setDescription(`> ${data['summary']}`)
         .addFields({
            name: 'Atomic Number',
            value: String(data['atomic_number']),
            inline: true
         }, {
            name: 'Atomic Mass',
            value: String(data['atomic_mass']),
            inline: true
         }, {
            name: 'Phase',
            value: data['phase'],
            inline: true
         }, {
            name: 'Period',
            value: String(data['period']),
            inline: true
         }, {
            name: 'Discovered By',
            value: data['discovered_by'],
            inline: true
         });

      await ctx.interaction.editReply({ embeds: [chemicalElementEmbed] });

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to get information about the chemical element. Please, retry later.');

   };

}, {
   name: 'chemical-element',
   aliases: ['chemical element', 'chemical element'],
   description: 'Display information about a specific chemical element from the periodic table.',
   category: 'INFORMATION',
   formats: [
      '/chemical-element `[element]`'
   ],
   examples: [
      '/chemical-element `element: Gold (Au)`'
   ],
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'chemical-element',
      description: 'Display information about a specific chemical element from the periodic table.',
      options: [{
         name: 'element',
         description: 'The chemical element you want to display information of.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }
});