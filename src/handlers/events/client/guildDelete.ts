import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';
import type { Guild } from 'discord.js';

export default new Event('guildDelete', async (client, guild: Guild) => {

   Logger.info(`Guild Delete: ${guild.name} (${guild.id})`);

});