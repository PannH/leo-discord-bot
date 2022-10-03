import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { TextChannel } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const question = ctx.interaction.options.getString('question');
   const description = ctx.interaction.options.getString('description');
   const options = ctx.interaction.options.data
                     .filter((opt) => opt.name.startsWith('option'))
                     .map((opt) => opt.value);
   const channel = (ctx.interaction.options.getChannel('channel') ?? ctx.channel) as TextChannel;

   const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
   const voteEmojis = [
      ctx.client.customEmojis.votePlus,
      ctx.client.customEmojis.voteNeutral,
      ctx.client.customEmojis.voteMinus
   ];

   const sendingEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setDescription(`Sending the poll...`);

   await ctx.interaction.reply({
      embeds: [sendingEmbed],
      ephemeral: true
   });

   let pollEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: question, iconURL: ctx.client.customImages.GRAPH })

   if (description)
      pollEmbed.setDescription(`> ${description}`);

   if (!!options.length) {

      pollEmbed.setDescription(
         `${pollEmbed.data.description ?? ''}\n\n` +
         options
            .map((opt, i) => `${numberEmojis[i]} - ${opt}`)
            .join('\n')
      );

   };

   try {

      const message = await channel.send({ embeds: [pollEmbed] })

      if (!!options.length) {

         for (let i=0; i<options.length; i++) {

            await message.react(numberEmojis[i]);

         };

      } else {

         for (let emoji of voteEmojis) {

            await message.react(emoji);

         };

      };

      const confirmEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Poll Create', iconURL: ctx.client.customImages.GRAPH })
         .setDescription(`> The [poll](${message.url}) has been sent in the ${channel} channel.`);

      await ctx.interaction.editReply({ embeds: [confirmEmbed] });

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to send the poll. The error has been reported to the developer.');

      ctx.client.emit('error', error);

   };

}, {
   name: 'poll',
   aliases: ['survey'],
   description: 'Create a poll.',
   category: 'UTILITY',
   formats: [
      '/poll `[question]` `(option1)` `(option2)` ... `(option10)` `(description)` `(channel)`'
   ],
   examples: [
      '/poll `question: Do you like cats?`',
      '/poll `question: Do you like cats?` `channel: #general`',
      '/poll `question: Do you like cats?` `description: You like them? Because I do!`',
      '/poll `question: Which color do you prefer?` `option1: Red` `option2: Green` `option3: Blue`'
   ],
   clientPermissions: [],
   memberPermissions: ['ManageMessages', 'SendMessages'],
   type: 'SLASH',
   slashData: {
      name: 'poll',
      description: 'Create a poll.',
      options: [{
         name: 'question',
         description: 'Your poll\'s question.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256,
         required: true
      }, {
         name: 'option1',
         description: 'The option n°1.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option2',
         description: 'The option n°2.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option3',
         description: 'The option n°3.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option4',
         description: 'The option n°4.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option5',
         description: 'The option n°5.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option6',
         description: 'The option n°6.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option7',
         description: 'The option n°7.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option8',
         description: 'The option n°8.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option9',
         description: 'The option n°9.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'option10',
         description: 'The option n°10.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'description',
         description: 'Your poll\'s description.',
         type: ApplicationCommandOptionType.String,
         maxLength: 256
      }, {
         name: 'channel',
         description: 'The channel you want to poll to be sent in.',
         type: ApplicationCommandOptionType.Channel,
         channelTypes: [ChannelType.GuildText]
      }]
   }
});