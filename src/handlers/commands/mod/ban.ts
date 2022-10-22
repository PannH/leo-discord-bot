import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');
   const deleteMessageDays = ctx.interaction.options.getInteger('days') ?? 0;

   if (!member)
      return void ctx.errorReply(
         ctx.translate('commands:ban.errorTitles.memberNotFound'),
         ctx.translate('commands:ban.errorDescriptions.memberNotFound')
      );

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply(
         ctx.translate('commands:ban.errorTitles.invalidMember'),
         ctx.translate('commands:ban.errorDescriptions.cannotBanYourself')
      );

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply(
         ctx.translate('commands:ban.errorTitles.invalidMember'),
         ctx.translate('commands:ban.errorDescriptions.memberHierSupOrEqual')
      );

   if (!member.bannable)
      return void ctx.errorReply(
         ctx.translate('commands:ban.errorTitles.missingPerm'),
         ctx.translate('commands:ban.errorDescriptions.cannotBanThisMember')
      );

   await ctx.interaction.deferReply();

   try {
      
      await member.ban({ reason, deleteMessageDays });

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:ban.memberBan'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:ban.memberHasBeenBanned', { userTag: member.user.tag, reason: reason ?? ctx.translate('common:none') })
         );

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {

         await member.send({
            content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:ban.youHaveBeenBanned', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}`
         });

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
   name: 'ban',
   aliases: [],
   description: 'Ban a member from the server.',
   formats: [
      '/ban `[user]` `(reason)`'
   ],
   examples: [
      '/ban `user: @User`',
      '/ban `user: 123456789123456789`',
      '/ban `user: @User` `reason: Not respecting the rules`',
      '/ban `user: @User` `days: 5`'
   ],
   category: 'MODERATION',
   clientPermissions: ['BanMembers'],
   memberPermissions: ['BanMembers'],
   type: 'SLASH',
   slashData: {
      name: 'ban',
      description: 'Ban a member from the server.',
      options: [{
         name: 'user',
         description: 'The member you want to ban.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for banning the member.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }, {
         name: 'days',
         description: 'The number of days of messages to delete.',
         type: ApplicationCommandOptionType.Integer,
         minValue: 1,
         maxValue: 7
      }]
   }
});