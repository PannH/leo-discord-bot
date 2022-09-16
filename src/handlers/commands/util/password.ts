import { ApplicationCommandOptionType } from 'discord.js';
import { randomElement } from '../../../functions/randomElement';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const uppercases = ctx.interaction.options.getBoolean('uppercase-letters');
   const lowercases = ctx.interaction.options.getBoolean('lowercase-letters');
   const numbers = ctx.interaction.options.getBoolean('numbers');
   const symbols = ctx.interaction.options.getBoolean('symbols');
   const length = ctx.interaction.options.getInteger('length') ?? 8;
   const amount = ctx.interaction.options.getInteger('amount') ?? 5;

   const allCharacters = require('../../../../data/password_characters.json');

   const chars = [];

   if (uppercases)
      chars.push(...allCharacters.UPPERCASES);

   if (lowercases)
      chars.push(...allCharacters.LOWERCASES);

   if (numbers)
      chars.push(...allCharacters.NUMBERS);

   if (symbols)
      chars.push(...allCharacters.SYMBOLS);

   const passwords = [];

   for (let i=0; i<amount; i++) {

      let password = '';

      for (let j=0; j<length; j++) {

         password += randomElement(chars);

      };

      passwords.push(password);

   };

   const passwordsEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: 'Password Generator', iconURL: ctx.client.customImages.TOOLS })
      .setDescription(`> Generated ${amount} password(s).\n${passwords.map((p) => `${ctx.client.customEmojis.dot} \`${p}\``).join('\n')}`)
      .setFooter({ text: 'These passwords are randomly generated and usable for your own use.' });

   ctx.interaction.reply({
      embeds: [passwordsEmbed],
      ephemeral: true
   });

}, {
   name: 'password',
   aliases: ['secret', 'passwords'],
   description: 'Generate passwords to your own use.',
   formats: [
      '/password generate `[uppercase-letters]` `[lowercase-letters]` `[numbers]` `[symbols]` `(length)`'
   ],
   examples: [
      '/password generate `uppercase-letters: True` `lowercase-letters: True` `numbers: True` `symbols: False`',
      '/password generate `uppercase-letters: False` `lowercase-letters: False` `numbers: True` `symbols: True` `length: 8`',
   ],
   category: 'UTILITY',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'password',
      description: 'Randomly generate passwords to your own use.',
      options: [{
         name: 'generate',
         description: 'Generate a password.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'uppercase-letters',
            description: 'Wether you want to include uppercase letters in the passwords.',
            type: ApplicationCommandOptionType.Boolean,
            required: true
         }, {
            name: 'lowercase-letters',
            description: 'Wether you want to include lowercase letters in the passwords.',
            type: ApplicationCommandOptionType.Boolean,
            required: true
         }, {
            name: 'numbers',
            description: 'Wether you want to include numbers in the passwords.',
            type: ApplicationCommandOptionType.Boolean,
            required: true
         }, {
            name: 'symbols',
            description: 'Wether you want to include symbols in the passwords.',
            type: ApplicationCommandOptionType.Boolean,
            required: true
         }, {
            name: 'length',
            description: 'The passwords length.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100
         }, {
            name: 'amount',
            description: 'The amount of passwords to generate.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 20
         }]
      }]
   }
});