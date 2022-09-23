import { Event } from '../../../structures/Event';
import type { Role } from 'discord.js';

export default new Event('roleDelete', async (client, role: Role) => {

   const foundAutorole = client.prisma.cache.autorole.find((ar) => ar.guildId === role.guild.id && ar.roleId === role.id);

   if (!foundAutorole)
      return;

   await client.prisma.autorole.delete({
      where: {
         id: foundAutorole.id
      }
   });

   await client.prisma.cache.update('autorole');

});