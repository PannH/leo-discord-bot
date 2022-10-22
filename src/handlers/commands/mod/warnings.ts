import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const user = ctx.interaction.options.getUser('user');

   await ctx.interaction.deferReply({ ephemeral: true });

   const warns = ctx.client.prisma.cache.warn
                  .filter((w) => w.userId === user.id && w.guildId === ctx.guild.id)
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

   if (!warns.length)
      return void ctx.errorReply(
         ctx.translate('commands:warnings.errorTitles.noWarnFound'),
         ctx.translate('commands:warnings.errorDescriptions.noWarnFound')
      );

   const baseEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:warnings.warnings')}: ${user.tag} (${warns.length})`, iconURL: ctx.client.customImages.LIST })
      .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 4096 }));

   let warnEmbeds = [];

   let warnIndex = 0;
   for (let i = 0; i < (warns.length / 5); i++) {

      const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());

      for (let j = 0; j < 5; j++) {

         const warn = warns[warnIndex];

         if (!warn)
            break;

         warnEmbeds[i] = pageEmbed.addFields({
            name: `${ctx.translate('commands:warnings.warning')} #${warnIndex + 1}`,
            value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:warnings.identifier')}: \`${warn.id}\`\n` +
                   `${ctx.client.customEmojis.dot} ${ctx.translate('commands:warnings.date')}: ${timestamp(warn.createdAt.getTime(), 'f')} - ${timestamp(warn.createdAt.getTime(), 'R')}\n` +
                   `${ctx.client.customEmojis.dot} ${ctx.translate('commands:warnings.moderator')}: ${(await ctx.client.users.fetch(warn.moderatorId)) ?? ctx.translate('commands:warnings.notFound')}\n` +
                   `${ctx.client.customEmojis.dot} ${ctx.translate('commands:warnings.reason')}: \`${warn.reason ?? ctx.translate('common:none')}\``
         });

         warnIndex++;

      };

   };

   ctx.embedPagination(warnEmbeds, true);

}, {
   name: 'warnings',
   aliases: ['warns'],
   description: 'Display a member\'s warnings.',
   formats: [
      '/warnings `[user]`'
   ],
   examples: [
      '/warnings `user: @User`',
      '/warnings `user: 123456789123456789`'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: ['KickMembers'],
   type: 'SLASH',
   slashData: {
      name: 'warnings',
      description: 'Display a member\'s warnings.',
      options: [{
         name: 'user',
         description: 'The user you want to display the warnings of.',
         type: ApplicationCommandOptionType.User,
         required: true
      }]
   }
});