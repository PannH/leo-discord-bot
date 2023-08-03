import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, SnowflakeUtil } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';
import humanizeDuration from 'humanize-duration';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const afks = ctx.client.prisma.cache.afk;

   switch (subCommand) {

      case 'set': {

         const foundAfk = afks.find((afk) => afk.guildId === ctx.guild.id && afk.userId === ctx.executor.id)
         const reason = ctx.interaction.options.getString('reason');

         if (foundAfk)
            return void ctx.errorReply(
               ctx.translate('commands:afk.errorTitles.alreadyAfk'),
               ctx.translate('commands:afk.errorDescriptions.alreadyAfk')
            );
         
         try {
            
            await ctx.client.prisma.afk.create({
               data: {
                  id: SnowflakeUtil.generate().toString(),
                  guildId: ctx.guild.id,
                  userId: ctx.executor.id,
                  reason
               }
            });

            await ctx.client.prisma.cache.update('afk');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:afk.afkStatusSet'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:afk.youAreNowAfk', { reason: reason ?? ctx.translate('common:none') })
               );
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectedErrorTitle'),
               ctx.translate('common:unexpectedErrorDescription')
            );
      
            ctx.client.emit('error', error);

         }

         break;

      }

      case 'unset': {

         const foundAfk = afks.find((afk) => afk.guildId === ctx.guild.id && afk.userId === ctx.executor.id);

         if (!foundAfk)
            return void ctx.errorReply(
               ctx.translate('commands:afk.errorTitles.notAfk'),
               ctx.translate('commands:afk.errorDescriptions.notAfk')
            );

         try {
           
            await ctx.client.prisma.afk.delete({
               where: {
                  id: foundAfk.id
               }
            });

            await ctx.client.prisma.cache.update('afk');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:afk.afkStatusUnset'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:afk.youAreNotAfkAnymore', { duration: humanizeDuration(Date.now() - foundAfk.createdAt.getTime(), { largest: 2, maxDecimalPoints: 1, language: ctx.language }), reason: foundAfk.reason ?? ctx.translate('common:none') })
               );
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });

         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectedErrorTitle'),
               ctx.translate('common:unexpectedErrorDescription')
            );
      
            ctx.client.emit('error', error);

         }

         break;

      }

      case 'display': {

         if (!afks.length)
            return void ctx.errorReply(
               ctx.translate('commands:afk.errorTitles.noAfkFound'),
               ctx.translate('commands:afk.errorDescriptions.noAfkFound')
            );

         const baseEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: `${ctx.translate('commands:afk.afkMembers')}: ${ctx.guild.name} (${afks.length})`, iconURL: ctx.client.customImages.LIST })
            .setThumbnail(ctx.guild.iconURL({ extension: 'png', size: 4096 }));

         afks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

         await ctx.interaction.deferReply({ ephemeral: true });
      
         const afkEmbeds = [];
      
         let afkIndex = 0;
         for (let i = 0; i < (afks.length / 5); i++) {
      
            const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());
      
            for (let j = 0; j < 5; j++) {
      
               const afk = afks[afkIndex];
      
               if (!afk)
                  break;
      
               afkEmbeds[i] = pageEmbed.addFields({
                  name: `${ctx.translate('commands:afk.afkMember')} #${afkIndex + 1}`,
                  value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:afk.user')}: ${await ctx.client.users.fetch(afk.userId) ?? 'Not Found'}\n` +
                         `${ctx.client.customEmojis.dot} ${ctx.translate('commands:afk.since')}: ${timestamp(afk.createdAt.getTime(), 'f')} - ${timestamp(afk.createdAt.getTime(), 'R')}\n` +
                         `${ctx.client.customEmojis.dot} ${ctx.translate('commands:afk.reason')}: \`${afk.reason ?? ctx.translate('common:none')}\``
               });
      
               afkIndex++;
      
            }
      
         }
      
         ctx.embedPagination(afkEmbeds, true);

         break;

      }

      default:
         break;

   }

}, {
   name: 'afk',
   aliases: [],
   description: 'Manage your AFK status or display the server\'s AFKs.',
   formats: [
      '/afk set `(reason)`',
      '/afk unset',
      '/afk display'
   ],
   examples: [
      '/afk set',
      '/afk set `reason: Gone on vacation`',
      '/afk unset',
      '/afk display'
   ],
   category: 'UTILITY',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'afk',
      description: 'Manage your AFK status or display the server\'s AFKs.',
      options: [{
         name: 'set',
         description: 'Set you as AFK in this server with an optional reason.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'reason',
            description: 'The reason for being AFK.',
            type: ApplicationCommandOptionType.String,
            maxLength: 512
         }]
      }, {
         name: 'unset',
         description: 'Unset your AFK status in this server.',
         type: ApplicationCommandOptionType.Subcommand
      }, {
         name: 'display',
         description: 'Display the server AFKs.',
         type: ApplicationCommandOptionType.Subcommand
      }]
   }
});