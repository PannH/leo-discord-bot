import { ApplicationCommandOptionType } from 'discord.js';
import { timestamp } from '../../../functions/timestamp';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const user = ctx.interaction.options.getUser('user');
   const warnId = ctx.interaction.options.getString('identifier');

   await ctx.interaction.deferReply({ ephemeral: true });

   const member = await ctx.guild.members.fetch(user.id);
   const foundWarn = ctx.client.prisma.cache.warn.find((w) => w.id === warnId && w.userId === user.id && w.guildId === ctx.guild.id);

   if (user.id === ctx.executor.id)
      return void ctx.errorReply('Invalid Member', 'You cannot remove a warning from yourself.');

   if (member) {

      if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
         return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   };

   if (!foundWarn)
      return void ctx.errorReply('Invalid Identifier', 'The specified member does not have any warning matching the given identifier.');

   const confirmed = await ctx.confirmationRequest(`Are you sure about removing the warning given ${timestamp(foundWarn.createdAt.getTime(), 'R')} with reason: \`${foundWarn.reason}\` ?`);

   if (confirmed === undefined)
      return;

   if (confirmed) {

      try {
         
         await ctx.client.prisma.warn.delete({
            where: {
               id: foundWarn.id
            }
         });

         await ctx.client.prisma.cache.update('warn');

         const successEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: 'Member Unwarn', iconURL: ctx.client.customImages.TOOLS })
            .setDescription(`> Removed a warning from **${user.tag}**.`);
   
         await ctx.interaction.editReply({
            embeds: [successEmbed],
            components: []
         });
   
         try {
            await member.send({ content: `${ctx.client.customEmojis.bell} One of your warnings has been removed in the server \`${ctx.guild.name}\`.` });
         } catch (_) {
            return;
         };

      } catch (error) {
     
         ctx.errorReply('Unexpected Error', 'An error occured while trying to unwarn the member. The error has been reported to the developer.');
   
         ctx.client.emit('error', error);

      };

   } else {

      const cancelEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Cancellation', iconURL: ctx.client.customImages.ARROW_ROTATE })
         .setDescription('> The unwarn has been cancelled.');

      await ctx.interaction.editReply({
         embeds: [cancelEmbed],
         components: []
      });

   };

}, {
   name: 'unwarn',
   aliases: ['remove-warning', 'remove warning'],
   description: 'Remove a warning from a member.',
   formats: [
      '/unwarn `[user]` `[identifier]`'
   ],
   examples: [
      '/unwarn `user: @User` `identifier: 123456789123456789`',
      '/unwarn `user: 123456789123456789` `identifier: 123456789123456789`'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: ['KickMembers'],
   type: 'SLASH',
   slashData: {
      name: 'unwarn',
      description: 'Remove a warning from a member.',
      options: [{
         name: 'user',
         description: 'The user you want to remove the warning from.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'identifier',
         description: 'The identifier of the warning you want to remove (check /warnings).',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }
});