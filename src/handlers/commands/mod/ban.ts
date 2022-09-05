import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');
   const deleteMessageDays = ctx.interaction.options.getInteger('days') ?? 0;

   if (!member)
      return void ctx.errorReply('Member Not Found', 'The provided user was not found in the server.');

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply('Invalid Member', 'You cannot ban yourself.');

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   if (!member.bannable)
      return void ctx.errorReply('Missing Permission', 'I cannot ban this member.');

   await ctx.interaction.deferReply();

   try {
      
      await member.ban({ reason, deleteMessageDays });

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Member Ban', iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> **${member.user.tag}** has been banned from the server with reason: \`${reason ?? 'No reason'}\`.`);

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} You have been banned from the server \`${ctx.guild.name}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to ban the member. The error has been reported to the developer.');

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