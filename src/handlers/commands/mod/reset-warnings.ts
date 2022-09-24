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
      return void ctx.errorReply('Invalid Member', 'You cannot reset your own warnings.');

   if (member) {

      if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
         return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   };

   if (!warns.length)
      return void ctx.errorReply('Invalid Member', 'The specified member does not have any warning.');

   const confirmed = await ctx.confirmationRequest(`Are you sure about resetting **${warns.length}** warning(s) from **${user.tag}**.`);

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
            .setAuthor({ name: 'Member Warnings Reset', iconURL: ctx.client.customImages.TOOLS })
            .setDescription(`> Reset **${warns.length}** warning(s) from **${user.tag}**.`);
   
         await ctx.interaction.editReply({
            embeds: [successEmbed],
            components: []
         });
   
         try {
            await member.send({ content: `${ctx.client.customEmojis.bell} Your warnings (${warns.length}) have been reset in the server \`${ctx.guild.name}\`.` });
         } catch (_) {
            return;
         };

      } catch (error) {
     
         ctx.errorReply('Unexpected Error', 'An error occured while trying to reset the member\'s warnings. The error has been reported to the developer.');
   
         ctx.client.emit('error', error);
         
      };

   } else {

      const cancelEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Cancellation', iconURL: ctx.client.customImages.ARROW_ROTATE })
         .setDescription('> The warning reset has been cancelled.');

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