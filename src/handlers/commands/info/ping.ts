import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const pingEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: ctx.translate('commands:ping.averageLatency'), iconURL: ctx.client.customImages.SIGNAL })
      .setDescription(
         `${ctx.client.customEmojis.dot} ${ctx.translate('commands:ping.webSocket')}: ${(ctx.client.ws.ping / 1000).toFixed(2)}s\n` +
         `${ctx.client.customEmojis.dot} ${ctx.translate('commands:ping.responseTime')}: ${((Date.now() - ctx.executedTimestamp) / 1000).toFixed(2)}s`
      );

   ctx.interaction.reply({
      embeds: [pingEmbed],
      ephemeral: true
   });

}, {
   name: 'ping',
   aliases: ['latence', 'latency'],
   description: 'Display the bot\'s average latency.',
   formats: [
      '/ping'
   ],
   examples: [
      '/ping'
   ],
   category: 'INFORMATION',
   type: 'SLASH',
   memberPermissions: [],
   clientPermissions: [],
   slashData: {
      name: 'ping',
      description: 'Display the average latency.'
   }
});