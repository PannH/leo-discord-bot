import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';
import type { Guild } from 'discord.js';

export default new Event('guildDelete', async (client, guild: Guild) => {

   const { count: deleteCount } = await client.prisma.afk.deleteMany({
      where: {
         guildId: guild.id
      }
   });

   await client.prisma.cache.update('afk');

   Logger.info(`Deleted ${deleteCount} line(s) from afks table.`);

});