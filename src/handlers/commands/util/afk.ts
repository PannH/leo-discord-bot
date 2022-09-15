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
            return void ctx.errorReply('Already AFK', 'You are already set as AFK in this server.');
         
         try {
            
            await ctx.client.prisma.afk.create({
               data: {
                  id: SnowflakeUtil.generate().toString(),
                  guildId: ctx.guild.id,
                  userId: ctx.executor.id,
                  reason: reason ?? 'None'
               }
            });

            await ctx.client.prisma.cache.update('afk');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'AFK Set', iconURL: ctx.client.customImages.TOOLS })
               .setDescription(`> You're now set as AFK in this server with reason: \`${reason ?? 'No reason'}\``);
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });
            
         } catch (error) {
     
            ctx.errorReply('Unexpected Error', 'An error occured while trying to set you as AFK. The error has been reported to the developer.');
      
            ctx.client.emit('error', error);

         };

         break;

      };

      case 'unset': {

         const foundAfk = afks.find((afk) => afk.guildId === ctx.guild.id && afk.userId === ctx.executor.id);

         if (!foundAfk)
            return void ctx.errorReply('Not AFK', 'You are not set as AFK in this server.');

         try {
           
            await ctx.client.prisma.afk.delete({
               where: {
                  id: foundAfk.id
               }
            });

            await ctx.client.prisma.cache.update('afk');

            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'AFK Unset', iconURL: ctx.client.customImages.TOOLS })
               .setDescription(`> You have been unset from AFK. You have been AFK for \`${humanizeDuration(Date.now() - foundAfk.createdAt.getTime(), { largest: 2, maxDecimalPoints: 1 })}\`.`);
      
            await ctx.interaction.reply({
               embeds: [successEmbed],
               ephemeral: true
            });

         } catch (error) {
     
            ctx.errorReply('Unexpected Error', 'An error occured while trying to unset you from AFK. The error has been reported to the developer.');
      
            ctx.client.emit('error', error);

         };

         break;

      };

      case 'display': {

         if (!afks.length)
            return void ctx.errorReply('No AFK Found', 'There is no AFK in this server.');

         const baseEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: `AFKs: ${ctx.guild.name} (${afks.length})`, iconURL: ctx.client.customImages.LIST })
            .setThumbnail(ctx.guild.iconURL({ extension: 'png', size: 4096 }));

         afks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

         await ctx.interaction.deferReply({ ephemeral: true });
      
         let afkEmbeds = [];
      
         let afkIndex = 0;
         for (let i = 0; i < (afks.length / 5); i++) {
      
            const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());
      
            for (let j = 0; j < 5; j++) {
      
               const afk = afks[afkIndex];
      
               if (!afk)
                  break;
      
               afkEmbeds[i] = pageEmbed.addFields({
                  name: `AFK #${afkIndex + 1}`,
                  value: `${ctx.client.customEmojis.dot} User: ${await ctx.client.users.fetch(afk.userId) ?? 'Not Found'}\n` +
                         `${ctx.client.customEmojis.dot} Date: ${timestamp(afk.createdAt.getTime(), 'f')} - ${timestamp(afk.createdAt.getTime(), 'R')}\n` +
                         `${ctx.client.customEmojis.dot} Reason: \`${afk.reason}\``
               });
      
               afkIndex++;
      
            };
      
         };
      
         ctx.embedPagination(afkEmbeds, true);

         break;

      };

      default:
         break;

   };

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