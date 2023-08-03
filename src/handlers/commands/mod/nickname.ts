import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply(
         ctx.translate('commands:nickname.errorTitles.memberNotFound'),
         ctx.translate('commands:nickname.errorDescriptions.memberNotFound')
      );

   if (!member.manageable && member.user.id !== ctx.client.user.id)
      return void ctx.errorReply(
         ctx.translate('commands:nickname.errorTitles.missingPerm'),
         ctx.translate('commands:nickname.errorDescriptions.cannotManageThisMember')
      );

   switch (subCommand) {

      case 'set': {

         const nickname = ctx.interaction.options.getString('nickname');

         await ctx.interaction.deferReply();

         try {
            
            await member.setNickname(nickname, reason);

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:nickname.nicknameSet'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:nickname.nicknameHasBeenSet', { memberMention: member.toString(), nickname, reason: reason ?? ctx.translate('common:none') })
               );
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
   
            try {

               await member.send({
                  content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:nickname.yourNicknameHasBeenSet', { guildName: ctx.guild.name, nickname, reason: reason ?? ctx.translate('common:none') })}`
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

         break;

      }

      case 'normalize': {

         const fancyChars = require('../../../../data/fancy_characters.json');
         const currentNickname = member.displayName;
         
         let newNickname = '';

         for (const char of [...currentNickname]) {

            newNickname += fancyChars[char] ?? char;

         }

         if (currentNickname === newNickname)
            return void ctx.errorReply(
               ctx.translate('commands:nickname.errorTitles.invalidNickname'),
               ctx.translate('commands:nickname.errorDescriptions.noFancyChar')
            );

         const confirmed = await ctx.confirmationRequest(
            ctx.translate('commands:nickname.renameConfirmRequest', { memberMention: member.toString(), nickname: newNickname })
         );

         if (confirmed === undefined)
            return;

         if (confirmed) {

            try {
               
               await member.setNickname(newNickname, reason);
   
               const successEmbed = new EmbedBuilder()
                  .setColor(ctx.client.colors.SECONDARY)
                  .setAuthor({ name: ctx.translate('commands:nickname.nicknameNormalization'), iconURL: ctx.client.customImages.TOOLS })
                  .setDescription(
                     ctx.translate('commands:nickname.nicknameHasBeenNormalized', { memberMention: member.toString(), nickname: newNickname, reason: reason ?? ctx.translate('common:none') })
                  );
         
               await ctx.interaction.editReply({
                  embeds: [successEmbed],
                  components: []
               });
      
               try {

                  await member.send({
                     content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:nickname.yourNicknameHasBeenNormalized', { guildName: ctx.guild.name, nickname: newNickname, reason: reason ?? ctx.translate('common:none') })}`
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

         } else {

            const cancelEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('common:cancellation'), iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription(
                  ctx.translate('commands:nickname.nicknameNormalizationCancel')
               );
      
            await ctx.interaction.editReply({
               embeds: [cancelEmbed],
               components: []
            });

         }

         break;

      }

      case 'reset': {

         if (!member.nickname)
            return void ctx.errorReply(
               ctx.translate('commands:nickname.errorTitles.invalidMember'),
               ctx.translate('commands:nickname.errorDescriptions.noNickname')
            );

         await ctx.interaction.deferReply();

         try {
            
            await member.setNickname(null, reason);

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:nickname.nicknameReset'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:nickname.nicknameHasBeenReset', { memberMention: member.toString(), reason: reason ?? ctx.translate('common:none') })
               );
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
   
            try {

               await member.send({ 
                  content: `${ctx.client.customEmojis.bell} ${ctx.translate('commands:nickname.yourNicknameHasBeenReset', { guildName: ctx.guild.name, reason: reason ?? ctx.translate('common:none') })}`
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

         break;

      }

      default:
         break;

   }

}, {
   name: 'nickname',
   aliases: [],
   description: 'Manage nicknames.',
   formats: [
      '/nickname set `[user]` `[nickname]` `(reason)`',
      '/nickname reset `[user]` `(reason)`',
      '/nickname normalize `[user]` `(reason)`'
   ],
   examples: [
      '/nickname set `user: @User` `nickname: BetterNick`',
      '/nickname set `user: 123456789123456789` `nickname: BetterNick` `reason: Here\'s a better one`',
      '/nickname reset `user: 123456789123456789`',
      '/nickname normalize `user: @User`',
      '/nickname normalize `user: 123456789123456789` `reason: Too many fancy characters`'
   ],
   category: 'MODERATION',
   clientPermissions: ['ManageNicknames', 'ChangeNickname'],
   memberPermissions: ['ManageNicknames', 'ChangeNickname'],
   type: 'SLASH',
   slashData: {
      name: 'nickname',
      description: 'Manage nicknames.',
      options: [{
         name: 'set',
         description: 'Set a member\'s nickname.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'user',
            description: 'The member you want to set the nickname of.',
            type: ApplicationCommandOptionType.User,
            required: true
         }, {
            name: 'nickname',
            description: 'The nickname you want to set.',
            type: ApplicationCommandOptionType.String,
            maxLength: 32,
            required: true
         }, {
            name: 'reason',
            description: 'The reason for setting the nickname.',
            type: ApplicationCommandOptionType.String,
            maxLength: 512
         }]
      }, {
         name: 'reset',
         description: 'Reset a member\'s nickname.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'user',
            description: 'The member you want to reset the nickname of.',
            type: ApplicationCommandOptionType.User,
            required: true
         }, {
            name: 'reason',
            description: 'The reason for resetting the nickname.',
            type: ApplicationCommandOptionType.String,
            maxLength: 512
         }]
      }, {
         name: 'normalize',
         description: 'Normalize a member\'s nickname (replace the fancy characters).',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'user',
            description: 'The member you want to normalize the nickname of.',
            type: ApplicationCommandOptionType.User,
            required: true
         }, {
            name: 'reason',
            description: 'The reason for normalizing the nickname.',
            type: ApplicationCommandOptionType.String,
            maxLength: 512
         }]
      }]
   }
});