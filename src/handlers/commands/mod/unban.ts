import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const userId = ctx.interaction.options.getString('query');
   const ban = (await ctx.guild.bans.fetch()).get(userId);
   const reason = ctx.interaction.options.getString('reason');

   if (!ban)
      return void ctx.errorReply(
         ctx.translate('commands:unban.errorTitles.userNotFound'),
         ctx.translate('commands:unban.errorDescriptions.userNotFound')
      );

   await ctx.interaction.deferReply();

   try {
      
      await ctx.guild.bans.remove(ban.user.id, reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('commands:unban.userUnban'), iconURL: ctx.client.customImages.TOOLS })
         .setDescription(
            ctx.translate('commands:unban.userHasBeenUnbanned', { userTag: ban.user.tag, reason: reason ?? ctx.translate('common:none') })
         );

      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {
         await ban.user.send({ content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:unban.youHaveBeenUnbanned', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}` });
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
   name: 'unban',
   aliases: ['revoke ban'],
   description: 'Unban someone from the banned users.',
   formats: [
      '/unban `[query]` `(reason)`'
   ],
   examples: [
      '/unban `query: Username`',
      '/unban `query: Username#1234`',
      '/unban `query: 123456789123456789`',
      '/unban `query: Username` `reason: You deserve to be free`'
   ],
   category: 'MODERATION',
   clientPermissions: ['BanMembers'],
   memberPermissions: ['BanMembers'],
   type: 'SLASH',
   slashData: {
      name: 'unban',
      description: 'Unban someone from the banned users.',
      options: [{
         name: 'query',
         description: 'Search a banned user by its username, tag or identifier.',
         type: ApplicationCommandOptionType.String,
         autocomplete: true,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for unbanning the user.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }]
   }
});