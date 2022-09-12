import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';

export default new Command(async (ctx) => {

   const warns = ctx.client.prisma.cache.warn
                  .filter((w) => w.userId === ctx.executor.id && w.guildId === ctx.guild.id)
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

   if (!warns.length)
      return void ctx.errorReply('Invalid User', 'You do not have any warning.');

      const baseEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `Your Warnings (${warns.length})`, iconURL: ctx.client.customImages.LIST })
         .setThumbnail(ctx.executor.displayAvatarURL({ extension: 'png', size: 4096 }));
   
      let warnEmbeds = [];
   
      let warnIndex = 0;
      for (let i = 0; i < (warns.length / 5); i++) {
   
         const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());
   
         for (let j = 0; j < 5; j++) {
   
            const warn = warns[warnIndex];
   
            if (!warn)
               break;
   
            warnEmbeds[i] = pageEmbed.addFields({
               name: `Warn #${warnIndex + 1}`,
               value: `${ctx.client.customEmojis.dot} Date: ${timestamp(warn.createdAt.getTime(), 'f')} - ${timestamp(warn.createdAt.getTime(), 'R')}\n` +
                      `${ctx.client.customEmojis.dot} Moderator: ${(await ctx.client.users.fetch(warn.moderatorId)) ?? 'Not found'}\n` +
                      `${ctx.client.customEmojis.dot} Reason: \`${warn.reason}\``
            });
   
            warnIndex++;
   
         };
   
      };
   
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