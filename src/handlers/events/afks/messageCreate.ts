import { Event } from '../../../structures/Event';
import { EmbedBuilder } from '@discordjs/builders';
import humanizeDuration from 'humanize-duration';
import type { Message, User } from 'discord.js';
import { timestamp } from '../../../functions/timestamp';
import { Afk } from '@prisma/client';

export default new Event('messageCreate', async (client, message: Message) => {

   if (message.author.bot || !message.guild)
      return;

   const guildAfks = client.prisma.cache.afk.filter((afk) => afk.guildId === message.guild.id);
   const authorAfk = guildAfks.find((afk) => afk.userId === message.author.id);

   if (authorAfk) {

      try {
         
         await client.prisma.afk.delete({
            where: {
               id: authorAfk.id
            }
         });

         await client.prisma.cache.update('afk');

         const embed = new EmbedBuilder()
            .setColor(client.colors.SECONDARY)
            .setDescription(`You are not AFK anymore. You have been AFK for \`${humanizeDuration(Date.now() - authorAfk.createdAt.getTime(), { largest: 2, maxDecimalPoints: 1 })}\`.`);

         await message.reply({
            embeds: [embed],
            allowedMentions: { repliedUser: false }
         });

      } catch (error) {
        
         client.emit('error', error);

      };

   };

   const mentionedAfks: Afk[] = [];
   for (const afk of guildAfks.filter((afk) => afk.userId !== message.author.id)) {

      if (message.mentions.users.get(afk.userId)) {

         mentionedAfks.push(afk);

      }

   };

   for (const afk of mentionedAfks) {

      const user = await client.users.fetch(afk.userId);

      const afkEmbed = new EmbedBuilder()
         .setColor(client.colors.SECONDARY)
         .setDescription(`${user} is AFK since ${timestamp(afk.createdAt.getTime(), 'f')} with reason: \`${afk.reason}\`.`);

      await message.reply({
         embeds: [afkEmbed],
         allowedMentions: { repliedUser: false }
      });

   };

});