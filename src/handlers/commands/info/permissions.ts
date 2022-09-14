import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, Role } from 'discord.js';
import { permissionNames } from '../../../utils/permissionNames';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();

   switch (subCommand) {

      case 'member': {

         const member = ctx.interaction.options.getMember('user') as GuildMember;

         if (!member)
            return void ctx.errorReply('Member Not Found', 'The user you provided was not found in this server.');

         const permissionsEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: `Member Permissions: ${member.user.tag}`, iconURL: ctx.client.customImages.LIST })
            .setThumbnail(member.user.displayAvatarURL({ extension: 'png', size: 4096 }))
            .setDescription(
               member.permissions
                  .toArray()
                  .map((p) => `${ctx.client.customEmojis.dot} \`${permissionNames[p.toString()]}\``)
                  .join('\n')
            )
            .setFooter({ text: `Hierarchical Position: ${member.guild.roles.cache.size - member.roles.highest.position}/${member.guild.roles.cache.size} (based on roles)` });

         ctx.interaction.reply({
            embeds: [permissionsEmbed],
            ephemeral: true
         });

         break;

      };

      case 'role': {

         const role = ctx.interaction.options.getRole('role') as Role;

         const permissionsEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: `Role Permissions: ${role.name}`, iconURL: ctx.client.customImages.LIST })
            .setThumbnail(role.iconURL({ extension: 'png', size: 4096 }))
            .setDescription(
               role.permissions
                  .toArray()
                  .map((p) => `${ctx.client.customEmojis.dot} \`${permissionNames[p.toString()]}\``)
                  .join('\n')
            )
            .setFooter({ text: `Hierarchical Position: ${role.guild.roles.cache.size - role.position}/${role.guild.roles.cache.size}` });

         ctx.interaction.reply({
            embeds: [permissionsEmbed],
            ephemeral: true
         });

         break;

      };

      default:
         break;

   };

}, {
   name: 'permissions',
   aliases: ['perm', 'role permissions', 'user permissions', 'member permissions'],
   description: 'Display a member/role\'s permissions',
   formats: [
      '/permissions member `[user]`',
      '/permissions role `[role]`'
   ],
   examples: [
      '/permissions member `user: @User`',
      '/permissions member `user: 123456789123456789`',
      '/permissions role `role: @Role`',
      '/permissions role `role: 123456789123456789`',
   ],
   category: 'INFORMATION',
   clientPermissions: ['ManageRoles'],
   memberPermissions: ['ManageRoles'],
   type: 'SLASH',
   slashData: {
      name: 'permissions',
      description: 'Display a member/role\'s permissions',
      options: [{
         name: 'member',
         description: 'Display a member\'s permissions.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'user',
            description: 'The member you want to display the permissions of.',
            type: ApplicationCommandOptionType.User,
            required: true
         }]
      }, {
         name: 'role',
         description: 'Display a role\'s permissions.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'role',
            description: 'The role you want to display the permissions of.',
            type: ApplicationCommandOptionType.Role,
            required: true
         }]
      }]
   }
});