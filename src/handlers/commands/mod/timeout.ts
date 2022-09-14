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
      return void ctx.errorReply('Invalid Member', 'The provided member was not found in the server.');

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply('Invalid Member', 'You cannot time out yourself.');

   if (member.permissions.has('Administrator'))
      return void ctx.errorReply('Invalid Member', 'It is impossible to time out an administrator.');

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   if (!member.moderatable)
      return void ctx.errorReply('Missing Permission', 'I cannot time out this member.');
      
   console.log(member.communicationDisabledUntilTimestamp);

   if (member.communicationDisabledUntilTimestamp)
      return void ctx.errorReply('Invalid Member', 'The provided member is already timed out.');

   if (duration > (28 * 1000 * 60 * 60 * 24))
      return void ctx.errorReply('Invalid Duration', 'It is impossible to time out a member for more than 28 days.');

   await ctx.interaction.deferReply();

   try {
      
      await member.timeout(duration, reason);

      const humanizedDuration = humanizeDuration(duration, { maxDecimalPoints: 1 });

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Member Timeout', iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> **${member.user.tag}** has been timed out for \`${humanizedDuration}\` with reason: \`${reason ?? 'No reason'}\`.`);

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} You have been timed out in the server \`${ctx.guild.name}\` for \`${humanizedDuration}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to time out the member. The error has been reported to the developer.');

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