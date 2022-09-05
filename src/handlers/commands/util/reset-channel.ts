import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { TextChannel } from 'discord.js';

export default new Command(async (ctx) => {

   const channel = (ctx.interaction.options.getChannel('channel') ?? ctx.channel) as TextChannel;

   const confirmed = await ctx.confirmationRequest(`You're about to reset the channel ${channel} and delete all its messages. Are you sure about it ?`);

   if (confirmed === undefined)
      return;

   if (confirmed) {
      
      try {
         
         const clonedChannel = await channel.clone();

         await channel.delete();

         await clonedChannel.setPosition(channel.position);

         const confirmEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: 'Channel Reset', iconURL: ctx.client.customImages.ARROW_ROTATE })
            .setDescription(`> This channel has been reset by ${ctx.executor}.`);

         await clonedChannel.send({ embeds: [confirmEmbed] });

         try {
            await ctx.successReply('Channel Reset', 'The channel has successfully been reset.');
         } catch (_) {
            return;
         };

      } catch (error) {
     
         ctx.errorReply('Unexpected Error', 'An error occured while trying to reset the channel. The error has been reported to the developer.');
   
         ctx.client.emit('error', error);

      };

   } else {

      const cancelEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Cancellation', iconURL: ctx.client.customImages.ARROW_ROTATE })
         .setDescription('> The channel reset has been cancelled.');

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