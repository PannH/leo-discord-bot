import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply(
         ctx.translate('commands:removeTimeout.errorTitles.memberNotFound'),
         ctx.translate('commands:removeTimeout.errorDescriptions.memberNotFound')
      );

   if (!member.communicationDisabledUntilTimestamp)
      return void ctx.errorReply(
         ctx.translate('commands:removeTimeout.errorTitles.invalidMember'),
         ctx.translate('commands:removeTimeout.errorDescriptions.memberNotTimedOut')
      );

   await ctx.interaction.deferReply();

   try {
      
      await member.timeout(null, reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:removeTimeout.memberTimeoutRemove'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:removeTimeout.timeoutHasBeenRemoved', { memberMention: member.toString(), reason: reason ?? ctx.translate('common:none') })
         );

      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {

         await member.send({
            content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:removeTimeout.yourTimeoutHasBeenRemoved', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}`
         });

      } catch (_) {
         return;
      }

   } catch (error) {
     
      ctx.errorReply(
         ctx.translate('common:unexpectedErrorTitle'),
         ctx.translate('common:unexpectedErrorDescription')
      );

      ctx.client.emit('error', error);

   }

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