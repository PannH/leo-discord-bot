import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';
import { EmbedBuilder } from '@discordjs/builders';
import { timestamp } from '../../../functions/timestamp';
import type { Guild } from 'discord.js';

export default new Event('guildCreate', async (client, guild: Guild) => {

   Logger.info(`Guild Create: '${guild.name}' (${guild.id})`);

   const logEmbed = new EmbedBuilder()
      .setColor(client.colors.SUCCESS)
      .setAuthor({ name: `Guild Create: ${guild.name} (${guild.id})` })
      .setThumbnail(guild.iconURL({ extension: 'png', size: 4096 }))
      .addFields({
         name: 'Owner',
         value: `[\`${(await client.users.fetch(guild.ownerId)).tag}\`](https://discord.com/users/${guild.ownerId})`,
         inline: true
      }, {
         name: 'Members',
         value: `${guild.memberCount} (${guild.members.cache.filter((m) => m.user.bot).size} bot(s))`,
         inline: true
      }, {
         name: 'Creation Date',
         value: `${timestamp(guild.createdTimestamp, 'f')} - ${timestamp(guild.createdTimestamp, 'R')}`
      })
      .setTimestamp();

   client.customChannels.guildLogs.send({ embeds: [logEmbed] });

});