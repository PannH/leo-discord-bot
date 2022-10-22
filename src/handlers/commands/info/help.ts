import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { CategoryNames } from '../../../utils/CategoryNames';
import { PermissionNames } from '../../../utils/PermissionNames';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const commandId = ctx.interaction.options.getString('command');
   const command = ctx.client.handlers.commands.cache.get(commandId);

   if (!command)
      return void ctx.errorReply(
         ctx.translate(`commands:help.errorTitles.invalidCommand`),
         ctx.translate(`commands:help.errorDescriptions.invalidCommand`)
      );
   
   const helpEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate(`commands:help.command`)}: /${command.data.name} (${ctx.translate(`common:categoryNames.${command.data.category}`)})`, iconURL: ctx.client.customImages.QUESTION_MARK })
      .setDescription(`> ${command.data.description}`)
      .addFields({
         name: ctx.translate(`commands:help.formats`),
         value: command.data.formats
            .map((f) => `${ctx.client.customEmojis.dot} ${f}`)
            .join('\n')
      }, {
         name: ctx.translate(`commands:help.examples`),
         value: command.data.examples
            .map((e) => `${ctx.client.customEmojis.dot} ${e}`)
            .join('\n')
      }, {
         name: ctx.translate(`commands:help.requiredPerms`),
         value: !command.data.memberPermissions.length ? ctx.translate(`common:none`) : command.data.memberPermissions.map((p) => `\`${PermissionNames[p.toString()]}\``).join(', ')
      })
      .setFooter({ text: ctx.translate(`commands:help.options`) });

   if (command.data.note)
      helpEmbed.addFields({
         name: ctx.translate(`commands:help.note`),
         value: command.data.note
      });

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