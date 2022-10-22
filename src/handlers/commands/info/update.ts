import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const addedCommands = ['chemical-element', 'poll', 'language'].map((commandName) => ctx.client.handlers.commands.cache.find((c) => c.data.name === commandName));

   const updateEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:update.updateChanges')}: ${ctx.client.version}`, iconURL: ctx.client.customImages.TOOLS })
      .addFields({
         name: ctx.translate('commands:update.addedCommands'),
         value: addedCommands
                  .map((c) => c.mention(ctx.guild))
                  .join(', ')
      });

   ctx.interaction.reply({
      embeds: [updateEmbed],
      ephemeral: true
   });

}, {
   name: 'update',
   aliases: ['last update', 'news', 'whats new', 'changes'],
   description: 'Display the changes since the last update.',
   category: 'INFORMATION',
   formats: [
      '/update'
   ],
   examples: [
      '/update'
   ],
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'update',
      description: 'Display the changes since the last update.'
   }
});