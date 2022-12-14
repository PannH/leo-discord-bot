import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const category = ctx.interaction.options.getString('category');
   const commands = category ? ctx.client.handlers.commands.cache.filter((c) => c.data.category === category) : ctx.client.handlers.commands.cache;

   const commandsEmbed = category ?
      new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `${ctx.translate('commands:commands.commands')} (${ctx.translate(`common:categoryNames.${category}`)})`, iconURL: ctx.client.customImages.LIST })
         .setDescription(
            commands
               .map((c) => `${ctx.client.customEmojis.dot} ${c.mention(ctx.guild)}: ${c.data.description}`)
               .join('\n')
         ) :
      new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:commands.commands'), iconURL: ctx.client.customImages.LIST })
         .addFields(
            ['ADMINISTRATION', 'MODERATION', 'UTILITY', 'INFORMATION', 'FUN'].map((cat) => {
               return {
                  name: ctx.translate(`common:categoryNames.${cat}`),
                  value: commands
                     .filter((c) => c.data.category === cat)
                     .map((c) => c.mention(ctx.guild))
                     .join(', ')
               }
            })
         );

   ctx.interaction.reply({
      embeds: [commandsEmbed],
      ephemeral: true
   });
   
}, {
   name: 'commands',
   aliases: ['cmds'],
   description: 'Display the bot\'s commands.',
   formats: [
      '/commands `(category)`'
   ],
   examples: [
      '/commands',
      '/commands `category: Moderation`'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'commands',
      description: 'Display the bot\'s commands.',
      options: [{
         name: 'category',
         description: 'The category you want to display the commands of.',
         type: ApplicationCommandOptionType.String,
         choices: [{
            name: 'Administration',
            value: 'ADMINISTRATION'
         }, {
            name: 'Moderation',
            value: 'MODERATION'
         }, {
            name: 'Information',
            value: 'INFORMATION'
         }, {
            name: 'Utility',
            value: 'UTILITY'
         }, {
            name: 'Fun',
            value: 'FUN'
         }]
      }]
   }
});