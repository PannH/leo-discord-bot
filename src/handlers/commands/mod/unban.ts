import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';

export default new Command(async (ctx) => {

   const userID = ctx.interaction.options.getString('query');
   const ban = (await ctx.guild.bans.fetch()).get(userID);
   const reason = ctx.interaction.options.getString('reason');

   if (!ban)
      return void ctx.errorReply('Invalid User', 'The provided user was not found in the server bans. Try to wait for the autocomplete to prompt you the found bans.');

   await ctx.interaction.deferReply();

   try {
      
      await ctx.guild.bans.remove(ban.user.id, reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Member Unban', iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> **${ban.user.tag}** has been unbanned from the server with reason: \`${reason ?? 'No reason'}\`.`);

      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {
         await ban.user.send({ content: `${ctx.client.customEmojis.bell} You have been unbanned from the server \`${ctx.guild.name}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to unban the user. The error has been reported to the developer.');

      ctx.client.emit('error', error);

   };

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