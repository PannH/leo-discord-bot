import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const warns = ctx.client.prisma.cache.warn
                  .filter((w) => w.userId === ctx.executor.id && w.guildId === ctx.guild.id)
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

   if (!warns.length)
      return void ctx.errorReply(
         ctx.translate('commands:myWarnings.errorTitles.invalidMember'),
         ctx.translate('commands:myWarnings.errorDescriptions.noWarning')
      );

      const baseEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `${ctx.translate('commands:myWarnings.yourWarnings')} (${warns.length})`, iconURL: ctx.client.customImages.LIST })
         .setThumbnail(ctx.executor.displayAvatarURL({ extension: 'png', size: 4096 }));
   
      const warnEmbeds = [];
   
      let warnIndex = 0;
      for (let i = 0; i < (warns.length / 5); i++) {
   
         const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());
   
         for (let j = 0; j < 5; j++) {
   
            const warn = warns[warnIndex];
   
            if (!warn)
               break;
   
            warnEmbeds[i] = pageEmbed.addFields({
               name: `${ctx.translate('commands:myWarnings.warnings')} #${warnIndex + 1}`,
               value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:myWarnings.date')}: ${timestamp(warn.createdAt.getTime(), 'f')} - ${timestamp(warn.createdAt.getTime(), 'R')}\n` +
                      `${ctx.client.customEmojis.dot} ${ctx.translate('commands:myWarnings.moderator')}: ${(await ctx.client.users.fetch(warn.moderatorId)) ?? 'Not found'}\n` +
                      `${ctx.client.customEmojis.dot} ${ctx.translate('commands:myWarnings.reason')}: \`${warn.reason}\``
            });
   
            warnIndex++;
   
         }
   
      }
   
      ctx.embedPagination(warnEmbeds, true);

}, {
   name: 'my-warnings',
   aliases: ['my warns', 'my warnings', 'my-warns'],
   description: 'Display your warnings.',
   formats: [
      '/my-warnings'
   ],
   examples: [
      '/my-warnings'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'my-warnings',
      description: 'Display your warnings.'
   }
});