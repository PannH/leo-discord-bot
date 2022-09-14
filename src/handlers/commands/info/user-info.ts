import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const user = ctx.interaction.options.getUser('user') ?? ctx.executor;
   const member = ctx.guild.members.cache.get(user.id);

   if (!member)
      return void ctx.errorReply('Invalid User', `The specified user is not in the server.`);

   const infoEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Information: ${user.tag}`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 4096 }))
      .setDescription(user.toString())
      .addFields({
         name: 'Identifier',
         value: `\`${user.id}\``,
         inline: true
      }, {
         name: 'Account Type',
         value: user.system ? 'System' : user.bot ? 'Bot' : 'Human',
         inline: true
      }, {
         name: 'Is Administrator',
         value: member.permissions.has('Administrator') ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Account Creation',
         value: `${timestamp(user.createdTimestamp, 'f')} - ${timestamp(user.createdTimestamp, 'R')}`
      }, {
         name: 'Server Join',
         value: `${timestamp(member.joinedTimestamp, 'f')} - ${timestamp(member.joinedTimestamp, 'R')}`
      }, {
         name: 'Leo\'s Permissions',
         value: `${ctx.client.customEmojis.dot} **Timeout:** ${member.moderatable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString()}\n` +
                `${ctx.client.customEmojis.dot} **Manage:** ${member.manageable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString()}\n` +
                `${ctx.client.customEmojis.dot} **Kick:** ${member.kickable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString()}\n` +
                `${ctx.client.customEmojis.dot} **Ban:** ${member.bannable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString()}`
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'user-info',
   aliases: ['userinfo', 'user info', 'whois'],
   description: 'Display information about a user or you.',
   formats: [
      '/user-info `(user)`'
   ],
   examples: [
      '/user-info',
      '/user-info `user: @User`',
      '/user-info `user: 123456789123456789`'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'user-info',
      description: 'Display information about a user or you.',
      options: [{
         name: 'user',
         description: 'The user you want to display information about.',
         type: ApplicationCommandOptionType.User,
         required: false
      }]
   }
});