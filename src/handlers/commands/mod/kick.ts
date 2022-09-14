import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply('Member Not Found', 'The user you provided was not found in the server.');

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply('Invalid Member', 'You cannot kick yourself.');

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   if (!member.kickable)
      return void ctx.errorReply('Missing Permission', 'I cannot kick this member.');

   await ctx.interaction.deferReply();

   try {
      
      await member.kick(reason);

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `Member Kick`, iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> **${member.user.tag}** has been kicked from the server with reason: \`${reason ?? 'No reason'}\`.`);
      
      await ctx.interaction.editReply({ embeds: [successEmbed] });

      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} You have been kicked from the server \`${ctx.guild.name}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to kick the member. The error has been reported to the developer.');

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