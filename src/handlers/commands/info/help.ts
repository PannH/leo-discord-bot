import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';

export default new Command(async (ctx) => {

}, {
   name: 'help',
   aliases: [],
   description: 'Display help for a specific command.',
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'help',
      description: 'Display help for a specific command.',
      options: [{
         name: 'command',
         description: 'The command you want to display help about.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }
});