import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { TextChannel } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const channel = (ctx.interaction.options.getChannel('channel') ?? ctx.channel) as TextChannel;

   const confirmed = await ctx.confirmationRequest(
      ctx.translate('commands:resetChannel.resetConfirmRequest')
   );

   if (confirmed === undefined)
      return;

   if (confirmed) {
      
      try {
         
         const clonedChannel = await channel.clone();

         await channel.delete();

         await clonedChannel.setPosition(channel.position);

         const confirmEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: ctx.translate('commands:resetChannel.channelReset'), iconURL: ctx.client.customImages.ARROW_ROTATE })
            .setDescription(
               ctx.translate('commands:resetChannel.thisChannelHasBeenReset', { executorMention: ctx.executor.toString() })
            );

         await clonedChannel.send({ embeds: [confirmEmbed] });

         try {
            await ctx.successReply(ctx.translate('commands:resetChannel.channelReset'), ctx.translate('commands:resetChannel.theChannelHasBeenReset'));
         } catch (_) {
            return;
         };

      } catch (error) {
     
         ctx.errorReply(
            ctx.translate('common:unexpectedErrorTitle'),
            ctx.translate('common:unexpectedErrorDescription')
         );
   
         ctx.client.emit('error', error);

      };

   } else {

      const cancelEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: ctx.translate('common:cancellation'), iconURL: ctx.client.customImages.ARROW_ROTATE })
         .setDescription(
            ctx.translate('commands:resetChannel.resetCancel')
         );

      await ctx.interaction.editReply({
         embeds: [cancelEmbed],
         components: []
      });

   };

}, {
   name: 'reset-channel',
   aliases: ['reset channel', 'nuke', 'resetchannel'],
   description: 'Reset a channel, also known as "nuke".',
   formats: [
      '/reset-channel `(channel)`'
   ],
   examples: [
      '/reset-channel',
      '/reset-channel `channel: #general`',
      '/reset-channel `channel: 123456789123456789`'
   ],
   category: 'UTILITY',
   clientPermissions: ['ManageChannels'],
   memberPermissions: ['ManageChannels'],
   type: 'SLASH',
   slashData: {
      name: 'reset-channel',
      description: 'Reset a channel, also known as "nuke".',
      options: [{
         name: 'channel',
         description: 'The text channel to reset.',
         type: ApplicationCommandOptionType.Channel,
         channelTypes: [ChannelType.GuildText]
      }]
   }
});