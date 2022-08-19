import { Command } from '../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default new Command(async (ctx) => {

   const pingEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: 'Average Latency', iconURL: ctx.client.customImages.SIGNAL })
      .setDescription(
         `${ctx.client.customEmojis.dot} Web Socket: *${(ctx.client.ws.ping / 1000).toFixed(2)}s*\n` +
         `${ctx.client.customEmojis.dot} Reaction Time: *${((Date.now() - ctx.executedTimestamp) / 1000).toFixed(2)}s*`
      );

   ctx.interaction.reply({
      embeds: [pingEmbed],
      ephemeral: true
   });

}, {
   name: 'ping',
   description: 'Display the average latency.',
   category: 'INFORMATION',
   type: 'SLASH',
   memberPermissions: [],
   clientPermissions: [],
   slashData: {
      name: 'ping',
      description: 'Display the average latency.'
   }
});