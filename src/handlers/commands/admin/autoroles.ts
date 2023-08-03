import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, SnowflakeUtil } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const autoroles = ctx.client.prisma.cache.autorole.filter((ar) => ar.guildId === ctx.guild.id);

   switch (subCommand) {

      case 'add': {

         const role = ctx.interaction.options.getRole('role');

         if (autoroles.find((ar) => ar.roleId === role.id))
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.roleAlreadyPresent')
            );

         if (role.id === ctx.guild.roles.everyone.id)
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.cannotUseRole', { roleMention: ctx.guild.roles.everyone.toString() })
            );

         if (role.id === ctx.guild.roles.premiumSubscriberRole?.id)
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.cannotUseRole', { roleMention: ctx.guild.roles.premiumSubscriberRole.toString() })
            );

         if (ctx.guild.members.cache.find((m) => m.roles.botRole?.id === role.id))
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.botRole')
            );

         if (role.position >= ctx.me.roles.highest.position)
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.cannotAddRole')
            );

         try {
            
            await ctx.client.prisma.autorole.create({
               data: {
                  id: SnowflakeUtil.generate().toString(),
                  guildId: ctx.guild.id,
                  roleId: role.id
               }
            });

            await ctx.client.prisma.cache.update('autorole');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:autoroles.autoroleAddTitle'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:autoroles.autoroleAddDescription', { roleMention: role.toString() })
               );
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectederrorTitles'),
               ctx.translate('common:unexpectederrorDescriptions')
            );
      
            ctx.client.emit('error', error);

         }

         break;

      }

      case 'remove': {

         const role = ctx.interaction.options.getRole('role');
         const foundAutorole = autoroles.find((ar) => ar.roleId === role.id);

         if (!foundAutorole)
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.invalidRole'),
               ctx.translate('commands:autoroles.errorDescriptions.roleNotPresent')
            );

         try {
            
            await ctx.client.prisma.autorole.delete({
               where: {
                  id: foundAutorole.id
               }
            });

            await ctx.client.prisma.cache.update('autorole');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:autoroles.autoroleRemoveTitle'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:autoroles.autoroleRemoveDescription', { roleMention: role.toString() })
               );
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('unexpectederrorTitles'),
               ctx.translate('unexpectederrorDescriptions')
            );
      
            ctx.client.emit('error', error);

         }

         break;

      }

      case 'display': {

         if (!autoroles.length)
            return void ctx.errorReply(
               ctx.translate('commands:autoroles.errorTitles.noRoleFound'),
               ctx.translate('commands:autoroles.errorDescriptions.noRoleFound')
            );

         await ctx.interaction.deferReply({ ephemeral: true });

         const baseEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: `${ctx.translate('commands:autoroles.autoroles')}: ${ctx.guild.name} (${autoroles.length})`, iconURL: ctx.client.customImages.LIST })
            .setThumbnail(ctx.guild.iconURL({ extension: 'png', size: 4096 }));

         const autoroleEmbeds = [];

         let autoroleIndex = 0;
         for (let i = 0; i < (autoroles.length / 5); i++) {
         
            const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());
         
            for (let j = 0; j < 5; j++) {
            
               const autorole = autoroles[autoroleIndex];
            
               if (!autorole)
                  break;
            
               autoroleEmbeds[i] = pageEmbed.addFields({
                  name: '\u200b',
                  value: `${ctx.client.customEmojis.dot} ${ctx.guild.roles.cache.get(autorole.roleId)}`
               });
            
               autoroleIndex++;
            
            }
         
         }
      
         await ctx.embedPagination(autoroleEmbeds, true);

         break;

      }

      default:
         break;

   }

}, {
   name: 'autoroles',
   aliases: ['auto-roles', 'auto roles'],
   description: 'Manage the server\'s autoroles.',
   formats: [
      '/autoroles add `[role]`',
      '/autoroles remove `[role]`',
      '/autoroles display'
   ],
   examples: [
      '/autoroles add `role: @Member`',
      '/autoroles add `role: 123456789123456789`',
      '/autoroles remove `role: @Member`',
      '/autoroles display'
   ],
   category: 'ADMINISTRATION',
   clientPermissions: ['ManageRoles'],
   memberPermissions: ['Administrator'],
   type: 'SLASH',
   slashData: {
      name: 'autoroles',
      description: 'Manage the server\'s autoroles.',
      options: [{
         name: 'add',
         description: 'Add a role to the server\'s autoroles.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'role',
            description: 'The role to add to the autoroles.',
            type: ApplicationCommandOptionType.Role,
            required: true
         }]
      }, {
         name: 'remove',
         description: 'Remove a role from the server\'s autoroles.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'role',
            description: 'The role you want to remove from the autoroles.',
            type: ApplicationCommandOptionType.Role,
            required: true
         }]
      }, {
         name: 'display',
         description: 'Display the server\'s autoroles.',
         type: ApplicationCommandOptionType.Subcommand
      }]
   }
});