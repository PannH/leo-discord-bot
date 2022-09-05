import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply('Invalid Member', 'The user you provded was not found in the server.');

   if (!member.communicationDisabledUntilTimestamp)
      return void ctx.errorReply('Invalid Member', 'The provided member is not timed out.');

   await ctx.interaction.deferReply();

   try {
      
      await member.timeout(null, reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Member Timeout', iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> **${member.user.tag}** timeout has been removed with reason: \`${reason ?? 'No reason'}\`.`);

      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} Your timeout has been removed in the server \`${ctx.guild.name}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to remove the member\'s timeout. The error has been reported to the developer.');

      ctx.client.emit('error', error);

   };

}, {
   name: 'remove-timeout',
   aliases: ['remove timeout', 'remove time out', 'unmute'],
   description: 'Remove the timeout from a timed out member.',
   formats: [
      '/remove-timeout `[user]` `(reason)`'
   ],
   examples: [
      '/remove-timeuot `user: @User`',
      '/remove-timeout `user: 123456789123456789`',
      '/remove-timeout `user: @User` `reason: You deserve to be free`'
   ],
   category: 'MODERATION',
   clientPermissions: ['ModerateMembers'],
   memberPermissions: ['ModerateMembers'],
   type: 'SLASH',
   slashData: {
      name: 'remove-timeout',
      description: 'Remove the timeout from a timed out member.',
      options: [{
         name: 'user',
         description: 'The member you want to remove the timeout of.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for removing the timeout.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }]
   }
});