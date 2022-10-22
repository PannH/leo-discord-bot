import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const user = ctx.interaction.options.getUser('user');
   const warns = ctx.client.prisma.cache.warn.filter((w) => w.userId === user.id && w.guildId === ctx.guild.id);
   
   await ctx.interaction.deferReply({ ephemeral: true });

   const member = await ctx.guild.members.fetch(user.id);

   if (user.id === ctx.executor.id)
      return void ctx.errorReply(
         ctx.translate('commands:resetWarnings.errorTitles.invalidMember'),
         ctx.translate('commands:resetWarnings.errorDescriptions.cannotResetYourWarns')
      );

   if (member) {

      if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
         return void ctx.errorReply(
            ctx.translate('commands:resetWarnings.errorTitles.invalidMember'),
            ctx.translate('commands:resetWarnings.errorDescriptions.memberHierSupOrEqual')
         );

   };

   if (!warns.length)
      return void ctx.errorReply(
         ctx.translate('commands:resetWarnings.errorTitles.invalidMember'),
         ctx.translate('commands:resetWarnings.errorDescriptions.noWarning')
      );

   const confirmed = await ctx.confirmationRequest(
      ctx.translate('commands:resetWarnings.resetConfirmRequest', { warnCount: warns.length, userTag: user.tag })
   );

   if (confirmed === undefined)
      return;

   if (confirmed) {

      try {
         
         await ctx.client.prisma.warn.deleteMany({
            where: {
               guildId: ctx.guild.id,
               userId: user.id
            }
         });

         await ctx.client.prisma.cache.update('warn');

         const successEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: ctx.translate('commands:resetWarnings.memberWarningsReset'), iconURL: ctx.client.customImages.TOOLS })
            .setDescription(
               ctx.translate('commands:resetWarnings.resetWarningsFromUser', { warnCount: warns.length, userTag: user.tag })
            );
   
         await ctx.interaction.editReply({
            embeds: [successEmbed],
            components: []
         });
   
         try {
            await member.send({ content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:resetWarnings.yourWarningsHaveBeenReset', { warnCount: warns.length, guildName: ctx.guild.name })}` });
         } catch (_) {
            return;
         };

      } catch (error) {
     
         ctx.errorReply(
            ctx.translate('common:unexpectedErrorTitle'),
            ctx.translate('common:unexpectedErrorDescription')
         );
   
         ctx.client.emit('error', error);
         
      };

   } else {

      const cancelEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('common:cancellation'), iconURL: ctx.client.customImages.ARROW_ROTATE })
         .setDescription(
            ctx.translate('commands:resetWarnings.resetCancellation')
         );

      await ctx.interaction.editReply({
         embeds: [cancelEmbed],
         components: []
      });

   };

}, {
   name: 'reset-warnings',
   aliases: ['reset warnings', 'reset warns'],
   description: 'Reset a member\'s warnings.',
   formats: [
      '/reset-warnings `[user]`'
   ],
   examples: [
      '/reset-warnings `user: @User`',
      '/reset-warnings `user: 123456789123456789`'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'reset-warnings',
      description: 'Reset a member\'s warnings.',
      options: [{
         name: 'user',
         description: 'The user you want to reset the warnings of.',
         type: ApplicationCommandOptionType.User,
         required: true
      }]
   }
});