import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Command } from '../../../structures/Command';
import { percentage } from '../../../functions/percentage';
import { timestamp } from '../../../functions/timestamp';
import hexToRGB from 'hex2rgb';
import type { Role } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const role = ctx.interaction.options.getRole('role') as Role;

   const infoEmbed =  new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:roleInfo.information')}: ${role.name}`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(role.iconURL({ extension: 'png', size: 4096 }))
      .setDescription(role.toString())
      .addFields({
         name: ctx.translate('commands:roleInfo.identifier'),
         value: `\`${role.id}\``,
         inline: true
      }, {
         name: ctx.translate('commands:roleInfo.members'),
         value: `${role.members.size} (${percentage(role.members.size, role.guild.memberCount, 1)}%)`,
         inline: true
      }, {
         name: '\u200b',
         value: '\u200b',
         inline: true
      }, {
         name: ctx.translate('commands:roleInfo.administrator'),
         value: role.permissions.has('Administrator') ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:roleInfo.mentionable'),
         value: role.mentionable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:roleInfo.displayedSeparetly'),
         value: role.hoist ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:roleInfo.creationDate'),
         value: `${timestamp(role.createdTimestamp, 'f')} - ${timestamp(role.createdTimestamp, 'R')}`
      }, {
         name: ctx.translate('commands:roleInfo.color'),
         value: `${ctx.client.customEmojis.dot} HEX: \`${role.hexColor}\`\n` +
                `${ctx.client.customEmojis.dot} RGB: \`(${hexToRGB(role.hexColor).rgb.join(', ')})\``
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'role-info',
   aliases: ['roleinfo', 'role info'],
   description: 'Display information about a role.',
   formats: [
      '/role-info `[role]`'
   ],
   examples: [
      '/role-info `role: @Role`',
      '/role-info `role: 123456789123456789`'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'role-info',
      description: 'Display information about a role.',
      options: [{
         name: 'role',
         description: 'The role you want to display information about.',
         type: ApplicationCommandOptionType.Role,
         required: true
      }]
   }
});