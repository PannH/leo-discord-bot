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
         ctx.translate('commands:kick.errorTitles.memberNotFound'),
         ctx.translate('commands:kick.errorDescriptions.memberNotFound')
      );

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply(
         ctx.translate('commands:kick.errorTitles.invalidMember'),
         ctx.translate('commands:kick.errorDescriptions.cannotKickYourself')
      );

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply(
         ctx.translate('commands:kick.errorTitles.invalidMember'),
         ctx.translate('commands:kick.errorDescriptions.memberHierSupOrEqual')
      );

   if (!member.kickable)
      return void ctx.errorReply(
         ctx.translate('commands:kick.errorTitles.missingPerm'),
         ctx.translate('commands:kick.errorDescriptions.cannotKickThisMember')
      );

   await ctx.interaction.deferReply();

   try {
      
      await member.kick(reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:kick.memberKick'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:kick.memberHasBeenKicked', { userTag: member.user.tag, reason: reason ?? ctx.translate('common:none') })
         );
      
      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {

         await member.send({
            content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:kick.youHaveBeenKicked', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}`
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
   name: 'kick',
   aliases: [],
   description: 'Kick a member from the server.',
   formats: [
      '/kick `[user]` `(reason)`'
   ],
   examples: [
      '/kick `user: @User`',
      '/kick `user: 123456789123456789`',
      '/kick `user: @User` `reason: Not respecting the rules`'
   ],
   category: 'MODERATION',
   clientPermissions: ['KickMembers'],
   memberPermissions: ['KickMembers'],
   type: 'SLASH',
   slashData: {
      name: 'kick',
      description: 'Kick a member from the server.',
      options: [{
         name: 'user',
         description: 'The member you want to kick.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for kicking the member.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }]
   }
});