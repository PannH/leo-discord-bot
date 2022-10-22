import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import humanizeDuration from 'humanize-duration';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const duration = ctx.interaction.options.getNumber('duration');
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.memberNotFound'),
         ctx.translate('commands:timeout.errorDescriptions.memberNotFound')
      );

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.invalidMember'),
         ctx.translate('commands:timeout.errorDescriptions.cannotTimeOutYourself')
      );

   if (member.permissions.has('Administrator'))
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.invalidMember'),
         ctx.translate('commands:timeout.errorDescriptions.cannotTimeOutAnAdmin')
      );

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.invalidMember'),
         ctx.translate('commands:timeout.errorDescriptions.memberHierSupOrEqual')
      );

   if (!member.moderatable)
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.missingPerm'),
         ctx.translate('commands:timeout.errorDescriptions.cannotTimeOutThisMember')
      );
      
   if (member.communicationDisabledUntilTimestamp)
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.invalidMember'),
         ctx.translate('commands:timeout.errorDescriptions.alreadyTimedOut')
      );

   if (duration > (28 * 1000 * 60 * 60 * 24))
      return void ctx.errorReply(
         ctx.translate('commands:timeout.errorTitles.invalidDuration'),
         ctx.translate('commands:timeout.errorDescriptions.timeoutDurationTooLong')
      );

   await ctx.interaction.deferReply();

   try {
      
      await member.timeout(duration, reason);

      const humanizedDuration = humanizeDuration(duration, { maxDecimalPoints: 1, language: ctx.language });

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:timeout.memberTimeout'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:timeout.memberHasBeenTimedOut', { userTag: member.user.tag, duration: humanizedDuration, reason: reason ?? ctx.translate('common:none') })
         );

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:timeout.youHaveBeenTimedOut', { guildName: ctx.guild.name, duration: humanizedDuration, reason: reason ?? ctx.translate('common:none') })}` });
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

}, {
   name: 'timeout',
   aliases: ['time out', 'mute'],
   description: 'Temporarily time out a member.',
   formats: [
      '/timeout `[user]` `[duration]` `(reason)`'
   ],
   examples: [
      '/timeout `user: @User` `duration: 3 hours`',
      '/timeout `user: 123456789123456789` `duration: 1 week`',
      '/timeout `user: @User` `duration: 10 minutes` `reason: Not respecting the rules`'
   ],
   category: 'MODERATION',
   clientPermissions: ['ModerateMembers'],
   memberPermissions: ['ModerateMembers'],
   type: 'SLASH',
   slashData: {
      name: 'timeout',
      description: 'Temporarily time out a member.',
      options: [{
         name: 'user',
         description: 'The member you want to time out.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'duration',
         description: 'The timeout duration.',
         type: ApplicationCommandOptionType.Number,
         minValue: 1000,
         required: true,
         autocomplete: true
      }, {
         name: 'reason',
         description: 'The reason for timing out the member.',
         type: ApplicationCommandOptionType.String
      }]
   }
});