import { Command } from '../../../structures/Command';
import { CommandContext } from '../../../structures/CommandContext';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { ComponentType, ButtonStyle, ApplicationCommandOptionType } from 'discord.js';
import { shuffleArray } from '../../../functions/shuffleArray';
import { randomElement } from '../../../functions/randomElement';
import { v4 as uuid } from 'uuid';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();

   switch (subCommand) {

      case 'play': {

         await ctx.interaction.deferReply();

         const { bestScore } = await ctx.client.prisma.flagGuesserScore.findUnique({
            where: {
               userId: ctx.executor.id
            }
         }) ?? { bestScore: 0 };

         const flags = shuffleArray(
            require('../../../../data/flags.json')
         );

         let [currentFlagIndex, currentScore, playing] = [0, 0, true];

         while (playing) {

            if (currentFlagIndex === flags.length) {

               playing = false;

               const winEmbed = new EmbedBuilder()
                  .setColor(ctx.client.colors.SUCCESS)
                  .setAuthor({ name: `Flag Guesser | Player: ${ctx.executor.tag}`, iconURL: ctx.client.customImages.FLAG })
                  .setDescription(`> 🎉 Congratulations! You found all the **${flags.length}** flags.`);

               await ctx.interaction.editReply({
                  embeds: [winEmbed],
                  components: []
               });

               await ctx.client.prisma.flagGuesserScore.upsert({
                  create: {
                     userId: ctx.executor.id,
                     bestScore: currentScore
                  },
                  update: {
                     bestScore: currentScore
                  },
                  where: {
                     userId: ctx.executor.id
                  }
               });

               return;

            };

            const currentFlag = flags[currentFlagIndex];

            const guessEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: `Flag Guesser | Player: ${ctx.executor.tag} (best score: ${bestScore})`, iconURL: ctx.client.customImages.FLAG })
               .setDescription(`> Which flag is this ? 👇`)
               .setImage(currentFlag.IMAGE_URL)
               .setFooter({ text: `Current Score: ${currentScore} / ${flags.length}` });

            const buttonIds = {
               'flag.good': uuid(),
               'flag.wrong1': uuid(),
               'flag.wrong2': uuid(),
               'flag.wrong3': uuid()
            };

            const wrongFlags = shuffleArray(flags.filter((f) => f.NAME !== currentFlag.NAME)).slice(3);

            let answerButtons = [
               new ButtonBuilder()
                  .setCustomId(buttonIds['flag.good'])
                  .setStyle(ButtonStyle.Primary)
                  .setLabel(currentFlag.NAME),
               new ButtonBuilder()
                  .setCustomId(buttonIds['flag.wrong1'])
                  .setStyle(ButtonStyle.Primary)
                  .setLabel(wrongFlags[0].NAME),
               new ButtonBuilder()
                  .setCustomId(buttonIds['flag.wrong2'])
                  .setStyle(ButtonStyle.Primary)
                  .setLabel(wrongFlags[1].NAME),
               new ButtonBuilder()
                  .setCustomId(buttonIds['flag.wrong3'])
                  .setStyle(ButtonStyle.Primary)
                  .setLabel(wrongFlags[2].NAME),
            ];

            answerButtons = shuffleArray(answerButtons);

            const answerButtonRows = [{
               type: ComponentType.ActionRow,
               components: [answerButtons[0], answerButtons[1]]
            }, {
               type: ComponentType.ActionRow,
               components: [answerButtons[2], answerButtons[3]]
            }];

            await ctx.interaction.editReply({
               embeds: [guessEmbed],
               components: answerButtonRows
            });

            try {

               const answerInter = await ctx.channel.awaitMessageComponent({
                  filter: (inter) => Object.values(buttonIds).includes(inter.customId) && inter.user.id === ctx.executor.id,
                  componentType: ComponentType.Button,
                  time: (5 * 1000 * 60)
               });
   
               if (answerInter.customId === buttonIds['flag.good']) {

                  await answerInter.reply({
                     content: `${ctx.client.customEmojis.checkmarkCircle} You found **${currentFlag.NAME}**.`,
                     ephemeral: true
                  });

                  currentScore++;
                  currentFlagIndex++;
   
               } else {

                  guessEmbed
                     .setColor(ctx.client.colors.ERROR)
                     .setDescription(`>>> You lose... the right answer was **${currentFlag.NAME}**.\n${currentScore > bestScore ? `🎉 You broke your last best score! You found **${currentScore}** flag(s) (last best score: ${bestScore}).` : `You found **${currentScore}** flag(s).`}`);

                  guessEmbed.data.footer.text = '';

                  await answerInter.update({
                     embeds: [guessEmbed],
                     components: []
                  });

                  playing = false;
   
               };
               
            } catch (_) {

               guessEmbed
                  .setColor(ctx.client.colors.ERROR)
                  .setDescription(`>>> You lose... You did not respond in the 5 given minutes. The answer was **${currentFlag.NAME}**.\n${currentScore > bestScore ? `🎉 You broke your last best score! You found **${currentScore}** flag(s) (last best score: ${bestScore}).` : `You found **${currentScore}** flag(s).`}`);

               guessEmbed.data.footer.text = '';

               await ctx.interaction.editReply({
                  embeds: [guessEmbed],
                  components: []
               });

               playing = false;

            };

         };

         if (currentScore > bestScore) {

            await ctx.client.prisma.flagGuesserScore.upsert({
               create: {
                  userId: ctx.executor.id,
                  bestScore: currentScore
               },
               update: {
                  bestScore: currentScore
               },
               where: {
                  userId: ctx.executor.id
               }
            });

         };

         break;

      };

      case 'reset-score': {

         await ctx.interaction.deferReply({ ephemeral: true });

         const { bestScore } = await ctx.client.prisma.flagGuesserScore.findUnique({
            where: {
               userId: ctx.executor.id
            }
         }) ?? { bestScore: 0 };

         if (!bestScore)
            return void ctx.errorReply('Invalid Score', 'Your best score is already set to 0.');

         const confirmed = await ctx.confirmationRequest(`Are you sure about resetting your current best score (**${bestScore}**) to 0 ?`);

         if (confirmed === undefined)
            return;

         if (confirmed) {

            await ctx.client.prisma.flagGuesserScore.delete({
               where: {
                  userId: ctx.executor.id
               }
            });

            const confirmEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'Score Reset', iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription(`> Your best score has been reset to 0.`);
   
            await ctx.interaction.editReply({
               embeds: [confirmEmbed],
               components: []
            });

         } else {

            const cancelEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: 'Cancellation', iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription('> Your best score reset has been cancelled.');
      
            await ctx.interaction.editReply({
               embeds: [cancelEmbed],
               components: []
            });

         };

         break;

      };

      default:
         break;

   };

}, {
   name: 'flag-guesser',
   aliases: ['flag guesser', 'flag quiz'],
   description: 'Explore your geography skills by playing this flag guesser.',
   category: 'FUN',
   clientPermissions: [],
   memberPermissions: [],
   formats: [
      '/flag-guesser play',
      '/flag-guesser reset-score'
   ],
   examples: [
      '/flag-guesser play',
      '/flag-guesser reset-score'
   ],
   type: 'SLASH',
   slashData: {
      name: 'flag-guesser',
      description: 'Explore your geography skills by playing this flag guesser.',
      options: [{
         name: 'play',
         description: 'Explore your geography skills by playing this flag guesser.',
         type: ApplicationCommandOptionType.Subcommand
      }, {
         name: 'reset-score',
         description: 'Reset your current best score.',
         type: ApplicationCommandOptionType.Subcommand
      }]
   }
});