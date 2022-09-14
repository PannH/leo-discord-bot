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
      return void ctx.errorReply('Invalid User', 'The specified member does not have any warn.');

   const baseEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Warnings: ${user.tag} (${warns.length})`, iconURL: ctx.client.customImages.LIST })
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
            name: `Warning #${warnIndex + 1}`,
            value: `${ctx.client.customEmojis.dot} Identifier: \`${warn.id}\`\n` +
                   `${ctx.client.customEmojis.dot} Date: ${timestamp(warn.createdAt.getTime(), 'f')} - ${timestamp(warn.createdAt.getTime(), 'R')}\n` +
                   `${ctx.client.customEmojis.dot} Moderator: ${(await ctx.client.users.fetch(warn.moderatorId)) ?? 'Not found'}\n` +
                   `${ctx.client.customEmojis.dot} Reason: \`${warn.reason}\``
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