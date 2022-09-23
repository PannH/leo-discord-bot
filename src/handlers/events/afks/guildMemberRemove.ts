import { Event } from '../../../structures/Event';
import type { GuildMember } from 'discord.js';

export default new Event('guildMemberRemove', async (client, member: GuildMember) => {

   const foundAfk = client.prisma.cache.afk.find((afk) => afk.guildId === member.guild.id && afk.userId === member.user.id);

   if (!foundAfk)
      return;

   await client.prisma.afk.delete({
      where: {
         id: foundAfk.id
      }
   });

   await client.prisma.cache.update('afk');

});