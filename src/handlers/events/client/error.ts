import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';
import { EmbedBuilder } from '@discordjs/builders';
import { codeBlock } from 'discord.js';

export default new Event('error', async (client, error: Error) => {

   Logger.error(error.message);

   const errorEmbed = new EmbedBuilder()
      .setColor(client.colors.ERROR)
      .setAuthor({ name: error.message })
      .setDescription(
         codeBlock(error.stack ?? 'No stack')
      )
      .setTimestamp();

   client.customChannels.errors.send({ embeds: [errorEmbed] });

});