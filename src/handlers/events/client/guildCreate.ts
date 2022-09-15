import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';
import type { Guild } from 'discord.js';

export default new Event('guildCreate', async (client, guild: Guild) => {

   Logger.info(`Guild Create: ${guild.name} (${guild.id})`);

});