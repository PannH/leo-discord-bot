import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { categoryNames } from '../../../utils/categoryNames';
import { permissionNames } from '../../../utils/permissionNames';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const commandId = ctx.interaction.options.getString('command');
   const command = ctx.client.handlers.commands.cache.get(commandId);

   if (!command)
      return void ctx.errorReply('Invalid Command', 'Command not found. Try to wait for the autocomplete to prompt you an existing command.');
   
   const helpEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Command: /${command.data.name} (${categoryNames[command.data.category]})`, iconURL: ctx.client.customImages.QUESTION_MARK })
      .setDescription(`> ${command.data.description}`)
      .addFields({
         name: 'Formats',
         value: command.data.formats
            .map((f) => `${ctx.client.customEmojis.dot} ${f}`)
            .join('\n')
      }, {
         name: 'Examples',
         value: command.data.examples
            .map((e) => `${ctx.client.customEmojis.dot} ${e}`)
            .join('\n')
      }, {
         name: 'Required Permissions',
         value: !command.data.memberPermissions.length ? 'None' : command.data.memberPermissions.map((p) => `\`${permissionNames[p.toString()]}\``).join(', ')
      })
      .setFooter({ text: 'Options: [required] (optional)' });

   ctx.interaction.reply({
      embeds: [helpEmbed],
      ephemeral: true
   });

}, {
   name: 'help',
   aliases: [],
   description: 'Display help for a specific command.',
   formats: [
      '/help `[command]`'
   ],
   examples: [
      '/help `command: /purge`'
   ],
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