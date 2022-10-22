import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, ChannelType, ComponentType, TextChannel, TextInputStyle } from 'discord.js';
import { EmbedBuilder} from '@discordjs/builders';
import { Constants } from '../../../utils/Constants';
import { v4 as uuid } from 'uuid';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const channel = (ctx.interaction.options.getChannel('channel') ?? ctx.channel) as TextChannel;
   const attachment = ctx.interaction.options.getAttachment('attachment');

   const modalId = uuid();

   const modalComponents = [{
      type: ComponentType.ActionRow,
      components: [{
         type: ComponentType.TextInput,
         customId: 'message.content',
         label: ctx.translate('commands:say.messageContent'),
         placeholder: ctx.translate('commands:say.modalPlaceholder'),
         maxLength: 2000,
         style: TextInputStyle.Paragraph,
         required: true
      }]
   }];

   const messageContentModal = {
      customId: modalId,
      title: ctx.translate('commands:say.sayMessageContent'),
      components: modalComponents
   };

   await ctx.interaction.showModal(messageContentModal as any);

   ctx.interaction.awaitModalSubmit({
      filter: (inter) => inter.customId === modalId && inter.user.id === ctx.executor.id,
      time: Constants.LARGEST_32BIT_INTEGER
   }).then(async (submitInter) => {

      const messageContent = submitInter.fields.getTextInputValue('message.content');

      const sendingEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setDescription(
            ctx.translate('commands:say.sendingMessage')
         );

      await submitInter.reply({
         embeds: [sendingEmbed],
         ephemeral: true
      });

      try {
        
         await channel.send({
            content: messageContent,
            files: attachment ? [attachment] : null
         });

         const successEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: 'Say', iconURL: ctx.client.customImages.TOOLS })
            .setDescription(
               ctx.translate('commands:say.theMessageHasBeenSent', { channelMention: channel.toString() })
            );
   
         await submitInter.editReply({ embeds: [successEmbed] });

      } catch (error) {
     
         ctx.errorReply(
            ctx.translate('common:unexpectedErrorTitle'),
            ctx.translate('common:unexpectedErrorDescription')
         );
   
         ctx.client.emit('error', error);

      };

   }).catch(() => {});

}, {
   name: 'say',
   aliases: ['tell', 'repeat', 'echo', 'send'],
   description: 'Make the bot send a custom message in a channel.',
   note: 'Once the command typed, a modal will pop up on you screen asking you to provide the message content.',
   category: 'UTILITY',
   clientPermissions: ['SendMessages', 'AttachFiles'],
   memberPermissions: ['ManageMessages', 'SendMessages', 'AttachFiles'],
   formats: [
      '/say `(channel)` `(attachment)`'
   ],
   examples: [
      '/say',
      '/say `channel: #general`',
      '/say `attachment: image.jpeg`'
   ],
   type: 'SLASH',
   slashData: {
      name: 'say',
      description: 'Make the bot send a custom message in a channel.',
      options: [{
         name: 'channel',
         description: 'The channel you want the message to be sent in.',
         type: ApplicationCommandOptionType.Channel,
         channelTypes: [ChannelType.GuildText]
      }, {
         name: 'attachment',
         description: 'An attachment you want to send with the message.',
         type: ApplicationCommandOptionType.Attachment
      }]
   }
});