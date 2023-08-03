import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import axios from 'axios';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const chemicalElementName = ctx.interaction.options.getString('element');
   const foundElement = require('../../../../data/chemical_elements.json').find((el) => el.NAME.toLowerCase() === chemicalElementName);

   if (!foundElement)
      return void ctx.errorReply(
         ctx.translate('commands:chemicalElement.errorTitles.invalidChemicalElement'),
         ctx.translate('commands:chemicalElement.errorDescriptions.invalidChemicalElement')
      );

   await ctx.interaction.deferReply();

   try {
      
      const { data } = await axios.get('https://api.popcat.xyz/periodic-table', { params: { element: chemicalElementName } });
      
      const chemicalElementEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `${ctx.translate('commands:chemicalElement.chemicalElement')}: ${data['name']} (${data['symbol']})` })
         .setThumbnail(data['image'])
         .setDescription(`> ${data['summary']}`)
         .addFields({
            name: ctx.translate('commands:chemicalElement.atomicNumber'),
            value: String(data['atomic_number']),
            inline: true
         }, {
            name: ctx.translate('commands:chemicalElement.atomicMass'),
            value: String(data['atomic_mass']),
            inline: true
         }, {
            name: ctx.translate('commands:chemicalElement.phase'),
            value: data['phase'],
            inline: true
         }, {
            name: ctx.translate('commands:chemicalElement.period'),
            value: String(data['period']),
            inline: true
         }, {
            name: ctx.translate('commands:chemicalElement.discoveredBy'),
            value: data['discovered_by'],
            inline: true
         });

      if (ctx.language === 'fr')
         chemicalElementEmbed.setFooter({ text: 'Les données ne sont pas disponibles en français.' });

      await ctx.interaction.editReply({ embeds: [chemicalElementEmbed] });

   } catch (error) {
     
      ctx.errorReply(
         ctx.translate('common:unexpectedErrorTitle'),
         ctx.translate('common:unexpectedErrorDescription')
      );

      ctx.client.emit('error', error);

   }

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