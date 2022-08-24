import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Command } from '../../structures/Command';
import { percentage } from '../../functions/percentage';
import { timestamp } from '../../functions/timestamp';
import hexToRGB from 'hex2rgb';
import type { Role } from 'discord.js';

export default new Command(async (ctx) => {

   const role = ctx.interaction.options.getRole('role') as Role;

   const infoEmbed =  new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Information: ${role.name}`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(role.iconURL({ extension: 'png' }))
      .setDescription(role.toString())
      .addFields({
         name: 'Identifier',
         value: `\`${role.id}\``,
         inline: true
      }, {
         name: 'Members',
         value: `${role.members.size} (${percentage(role.members.size, role.guild.memberCount, 1)}%)`,
         inline: true
      }, {
         name: '\u200b',
         value: '\u200b',
         inline: true
      }, {
         name: 'Administrator',
         value: role.permissions.has('Administrator') ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Mentionable',
         value: role.mentionable ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Displayed Separetly',
         value: role.hoist ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Creation',
         value: `${timestamp(role.createdTimestamp, 'f')} - ${timestamp(role.createdTimestamp, 'R')}`
      }, {
         name: 'Color',
         value: `${ctx.client.customEmojis.dot} HEX: \`${role.hexColor}\`\n` +
                `${ctx.client.customEmojis.dot} RGB: \`(${hexToRGB(role.hexColor).rgb.join(', ')})\``
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'role-info',
   aliases: ['roleinfo', 'role info'],
   description: 'Display information about a role.',
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