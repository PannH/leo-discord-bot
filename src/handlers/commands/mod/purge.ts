import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { Message } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const amount = ctx.interaction.options.getInteger('amount') ?? 100;

   switch (subCommand) {

      case 'user': {

         const user = ctx.interaction.options.getUser('user');

         await ctx.interaction.deferReply({ ephemeral: true });

         const messages = await ctx.channel.messages.fetch();
         const userMessages = [];

         let i = 0;
         messages.forEach((m) => {

            if (i === amount)
               return;

            if (m.author.id === user.id) {

               userMessages.push(m);
               i++;

            }

         });

         if (!userMessages.length)
            return void ctx.errorReply(
               ctx.translate('commands:purge.errorTitles.noMessageFound'),
               ctx.translate('commands:purge.errorDescriptions.noMessageFoundFromUser')
            );

         try {
      
            const purgedMessages = await ctx.channel.bulkDelete(userMessages, true);
      
            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:purge.messagePurge'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:purge.purgedMessages', { messageCount: purgedMessages.size })
               );
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectedErrorTitle'),
               ctx.translate('common:unexpectedErrorDescription')
            );
      
            ctx.client.emit('error', error);

         }       

         break;

      }

      case 'contains': {

         const text = ctx.interaction.options.getString('text');

         await ctx.interaction.deferReply({ ephemeral: true });

         const messages = await ctx.channel.messages.fetch();
         const textMessages = [];

         let i = 0;
         messages.forEach((m) => {

            if (i === amount)
               return;

            if (m.content.toLowerCase().includes(text.toLowerCase())) {

               textMessages.push(m);
               i++;

            }

         });

         if (!textMessages.length)
            return void ctx.errorReply(
               ctx.translate('commands:purge.errorTitles.noMessageFound'),
               ctx.translate('commands:purge.errorDescriptions.noMessageFoundMatchingText')
            );

         try {
      
            const purgedMessages = await ctx.channel.bulkDelete(textMessages, true);
      
            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:purge.messagePurge'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:purge.purgedMessages', { messageCount: purgedMessages.size })
               );
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectedErrorTitle'),
               ctx.translate('common:unexpectedErrorDescription')
            );
      
            ctx.client.emit('error', error);

         }       

         break;

      }

      default: {

         const filters = {
            any: (m: Message) => true,
            bots: (m: Message) => m.author.bot,
            embeds: (m: Message) => !!m.embeds.length,
            images: (m: Message) => !!m.attachments.filter((a) => a.contentType.startsWith('image/')).size,
            files: (m: Message) => !!m.attachments.size,
            links: (m: Message) => !!m.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/)
         };

         const filter = filters[subCommand];

         await ctx.interaction.deferReply({ ephemeral: true });

         const messages = await ctx.channel.messages.fetch();
         const filteredMessages = [];

         let i = 0;
         messages.forEach((m) => {

            if (i === amount)
               return;

            if (filter(m)) {

               filteredMessages.push(m);
               i++;

            }

         });

         if (!filteredMessages.length)
            return void ctx.errorReply(
               ctx.translate('commands:purge.errorTitles.noMessageFound'),
               ctx.translate('commands:purged.errorDescriptions.noMessageFoundMatchingFilter')
            );

         try {
      
            const purgedMessages = await ctx.channel.bulkDelete(filteredMessages, true);
      
            const successEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:purge.messagePurged'), iconURL: ctx.client.customImages.TOOLS })
               .setDescription(
                  ctx.translate('commands:purge.purgedMessages', { messageCount: purgedMessages.size })
               );
      
            await ctx.interaction.editReply({ embeds: [successEmbed] });
            
         } catch (error) {
     
            ctx.errorReply(
               ctx.translate('common:unexpectedErrorTitle'),
               ctx.translate('common:unexpectedErrorDescription')
            );
      
            ctx.client.emit('error', error);

         }       

         break;

      }

   }
   
}, {
   name: 'purge',
   aliases: ['clear', 'prune'],
   description: 'Purge messages.',
   formats: [
      '/purge any `(amount)`',
      '/purge user `[user]` `(amount)`',
      '/purge bots `(amount)`',
      '/purge embeds `(amount)`',
      '/purge images `(amount)`',
      '/purge files `(amount)`',
      '/purge links `(amount)`',
      '/purge contains `[text]` `(amount)`'
   ],
   examples: [
      '/purge any `amount: 20`',
      '/purge user `user: @User`',
      '/purge user `user: 123456789123456789` `amount: 10`',
      '/purge files',
      '/purge links `amount: 10`',
      '/purge contains `text: Some content`'
   ],
   category: 'MODERATION',
   clientPermissions: ['ReadMessageHistory', 'ManageMessages'],
   memberPermissions: ['ReadMessageHistory', 'ManageMessages'],
   type: 'SLASH',
   slashData: {
      name: 'purge',
      description: 'Purge messages.',
      options: [{
         name: 'any',
         description: 'Purge messages.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'user',
         description: 'Purge messages from a specific user.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'user',
            description: 'The member you want to purge messages from.',
            type: ApplicationCommandOptionType.User,
            required: true
         }, {
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'bots',
         description: 'Purge messages sent by bots.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'embeds',
         description: 'Purge messages that has embeds.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'images',
         description: 'Purge messages that has images.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'files',
         description: 'Purge messages that has files.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'links',
         description: 'Purge messages that contains links.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }, {
         name: 'contains',
         description: 'Purge messages that contains a specific text.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'text',
            description: 'The text the messages must contain to be purged (not case-sensitive).',
            type: ApplicationCommandOptionType.String,
            maxLength: 2000,
            required: true
         }, {
            name: 'amount',
            description: 'The amount of messages to purge.',
            type: ApplicationCommandOptionType.Integer,
            minValue: 2,
            maxValue: 100
         }]
      }]
   }
});

// '/purge any `(amount)`',
// '/purge user `[user]` `(amount)`',
// '/purge bots `(amount)`',
// '/purge embeds `(amount)`',
// '/purge images `(amount)`',
// '/purge files `(amount)`',
// '/purge links `(amount)`',
// '/purge contains `[text]` `(amount)`'