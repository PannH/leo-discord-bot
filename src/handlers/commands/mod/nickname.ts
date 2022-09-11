import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply('Invalid Member', 'The provided member was not found in the server.');

   if (!member.manageable && member.user.id !== ctx.client.user.id)
      return void ctx.errorReply('Invalid Member', 'I cannot manage this member\'s nickname.');

   switch (subCommand) {

      case 'set': {

         const nickname = ctx.interaction.options.getString('nickname');

         await ctx.interaction.deferReply();

         try {
            
            await member.setNickname(nickname, reason);

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'Nickname Set', iconURL: ctx.client.customImages.TOOLS })
               .setDescription(`> **${member}** nickname has been set to \`${nickname}\` with reason: \`${reason ?? 'No reason'}\`.`);
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
   
            try {
               await member.send({ content: `${ctx.client.customEmojis.bell} Your nickname in the server \`${ctx.guild.name}\` has been set to \`${nickname}\` with reason: \`${reason ?? 'No reason'}\`.` });
            } catch (_) {
               return;
            };

         } catch (error) {
     
            ctx.errorReply('Unexpected Error', 'An error occured while trying to set the member\'s nickname. The error has been reported to the developer.');
      
            ctx.client.emit('error', error);

         };

         break;

      };

      case 'normalize': {

         const fancyChars = require('../../../../data/fancy_characters.json');
         const currentNickname = member.displayName;
         
         let newNickname = '';

         for (let char of [...currentNickname]) {

            newNickname += fancyChars[char] ?? char;

         };

         if (currentNickname === newNickname)
            return void ctx.errorReply('Invalid Nickname', 'The member\'s nickname does not contain any fancy character to replace.');

         const confirmed = await ctx.confirmationRequest(`Are you sure to rename ${member} to \`${newNickname}\``);

         if (confirmed === undefined)
            return;

         if (confirmed) {

            try {
               
               await member.setNickname(newNickname, reason);
   
               const successEmbed = new EmbedBuilder()
                  .setColor(ctx.client.colors.SECONDARY)
                  .setAuthor({ name: 'Nickname Normalize', iconURL: ctx.client.customImages.TOOLS })
                  .setDescription(`> **${member}** nickname has been normalized to \`${newNickname}\` with reason: \`${reason ?? 'No reason'}\`.`);
         
               await ctx.interaction.editReply({
                  embeds: [successEmbed],
                  components: []
               });
      
               try {
                  await member.send({ content: `${ctx.client.customEmojis.bell} Your nickname in the server \`${ctx.guild.name}\` has been normalized to \`${newNickname}\` with reason: \`${reason ?? 'No reason'}\`.` });
               } catch (_) {
                  return;
               };
   
            } catch (error) {
        
               ctx.errorReply('Unexpected Error', 'An error occured while trying to normalize the member\'s nickname. The error has been reported to the developer.');
         
               ctx.client.emit('error', error);
   
            };

         } else {

            const cancelEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'Cancellation', iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription('> The nickname normalization has been cancelled.');
      
            await ctx.interaction.editReply({
               embeds: [cancelEmbed],
               components: []
            });

         };

         break;

      };

      case 'reset': {

         if (!member.nickname)
            return void ctx.errorReply('Invalid Member', 'This member does not have a nickname.');

         await ctx.interaction.deferReply();

         try {
            
            await member.setNickname(null, reason);

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'Nickname Reset', iconURL: ctx.client.customImages.TOOLS })
               .setDescription(`> **${member}** nickname has been reset with reason: \`${reason ?? 'No reason'}\`.`);
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
   
            try {
               await member.send({ content: `${ctx.client.customEmojis.bell} Your nickname in the server \`${ctx.guild.name}\` has been reset with reason: \`${reason ?? 'No reason'}\`.` });
            } catch (_) {
               return;
            };

         } catch (error) {
     
            ctx.errorReply('Unexpected Error', 'An error occured while trying to reset the member\'s nickname. The error has been reported to the developer.');
      
            ctx.client.emit('error', error);

         };

         break;

      };

      default:
         break;

   };

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