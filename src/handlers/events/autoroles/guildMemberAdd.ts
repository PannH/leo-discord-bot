import { Event } from '../../../structures/Event';
import type { GuildMember } from 'discord.js';

export default new Event('guildMemberAdd', async (client, member: GuildMember) => {

   const roles = client.prisma.cache.autorole
                        .filter((ar) => ar.guildId === member.guild.id)
                        .map((ar) => ar.roleId);

   if (!roles.length)
      return;

   try {
      await member.roles.add(roles, 'Autorole System');
   } catch (error) {
      console.log(error);
   };

});