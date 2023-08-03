import { ApplicationCommandOptionType, SnowflakeUtil } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply(
         ctx.translate('commands:warn.errorTitles.memberNotFound'),
         ctx.translate('commands:warn.errorDescriptions.memberNotFound')
      );

   if (member.user.bot)
      return void ctx.errorReply(
         ctx.translate('commands:warn.errorTitles.invalidMember'),
         ctx.translate('commands:warn.errorDescriptions.cannotWarnABot')
      );

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply(
         ctx.translate('commands:warn.errorTitles.invalidMember'),
         ctx.translate('commands:warn.errorDescriptions.cannotWarnYourself')
      );

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply(
         ctx.translate('commands:warn.errorTitles.invalidMember'),
         ctx.translate('commands:warn.errorDescriptions.memberHierSupOrEqual')
      );

   await ctx.interaction.deferReply();

   try {
      
      await ctx.client.prisma.warn.create({
         data: {
            id: SnowflakeUtil.generate().toString(),
            userId: member.user.id,
            guildId: ctx.guild.id,
            moderatorId: ctx.executor.id,
            reason
         }
      });

      await ctx.client.prisma.cache.update('warn');

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:warn.memberWarn'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:warn.memberHasBeenWarned', { userMention: member.toString(), reason: reason ?? ctx.translate('common:none') })
         );

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:warn.youHaveBeenWarned', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}` });
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
   name: 'warn',
   aliases: ['warnings'],
   description: 'Add a warning to a member.',
   formats: [
      '/warn `[user]` `(reason)`'
   ],
   examples: [
      '/warn `user: @User`',
      '/warn `user: 123456789123456789` `reason: Not respecting the rules`'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: ['KickMembers'],
   type: 'SLASH',
   slashData: {
      name: 'warn',
      description: 'Add a warning to a member.',
      options: [{
         name: 'user',
         description: 'The member you want to warn.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for the warn.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }]
   }
});