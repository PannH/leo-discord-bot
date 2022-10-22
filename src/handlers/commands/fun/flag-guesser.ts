import { Command } from '../../../structures/Command';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { ComponentType, ButtonStyle, ApplicationCommandOptionType } from 'discord.js';
import { shuffleArray } from '../../../functions/shuffleArray';
import { v4 as uuid } from 'uuid';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();

   switch (subCommand) {

      case 'play': {

         await ctx.interaction.deferReply();

         const { bestScore } = ctx.client.prisma.cache.flagGuesserScore.find((x) => x.userId === ctx.executor.id) ?? { bestScore: 0 };

         const flags = shuffleArray(
            require('../../../../data/flags.json')
         );

         let [currentFlagIndex, currentScore, playing] = [0, 0, true];

         while (playing) {

            if (currentFlagIndex === flags.length) {

               playing = false;

               const winEmbed = new EmbedBuilder()
                  .setColor(ctx.client.colors.SUCCESS)
                  .setAuthor({ name: `Flag Guesser | ${ctx.translate('commands:flagGuesser.player')}: ${ctx.executor.tag}`, iconURL: ctx.client.customImages.FLAG })
                  .setDescription(
                     ctx.translate('commands:flagGuesser.winDescription', { flagCount: flags.length })
                  );

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

               await ctx.client.prisma.cache.update('flagGuesserScore');

               return;

            };

            const currentFlag = flags[currentFlagIndex];

            const guessEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: `Flag Guesser | ${ctx.translate('commands:flagGuesser.player')}: ${ctx.executor.tag} (${ctx.translate('commands:flagGuesser.bestScore')}: ${bestScore})`, iconURL: ctx.client.customImages.FLAG })
               .setDescription(
                  ctx.translate('commands:flagGuesser.whichFlag')
               )
               .setImage(currentFlag.IMAGE_URL)
               .setFooter({ text: `${ctx.translate('commands:flagGuesser.currentScore')}: ${currentScore} / ${flags.length}` });

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
                     content: `${ctx.client.customEmojis.checkmarkCircle} ${ctx.translate('commands:flagGuesser.foundFlag', { flagName: currentFlag.NAME })}`,
                     ephemeral: true
                  });

                  currentScore++;
                  currentFlagIndex++;
   
               } else {

                  guessEmbed
                     .setColor(ctx.client.colors.ERROR)
                     .setDescription(`${ctx.translate('commands:flagGuesser.loseDescription', { rightAnswer: currentFlag.NAME })}\n${currentScore > bestScore ? ctx.translate('commands:flagGuesser.bestScoreBreak', { lastBestScore: bestScore, score: currentScore }) : ctx.translate('commands:flagGuesser.foundFlags', { score: currentScore })}`);

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
                  .setDescription(`${ctx.translate('commands:flagGuesser.loseByTimeDescription', { answer: currentFlag.NAME })}\n${currentScore > bestScore ? ctx.translate('commands:flagGuesser.bestScoreBreak', { lastBestScore: bestScore, score: currentScore }) : ctx.translate('commands:flagGuesser.foundFlags', { score: currentScore })}`);

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

            await ctx.client.prisma.cache.update('flagGuesserScore');

         };

         break;

      };

      case 'reset-score': {

         await ctx.interaction.deferReply({ ephemeral: true });

         const { bestScore } = ctx.client.prisma.cache.flagGuesserScore.find((x) => x.userId === ctx.executor.id) ?? { bestScore: 0 };

         if (!bestScore)
            return void ctx.errorReply(
               ctx.translate('commands:flagGuesser.errorTitles.invalidScore'),
               ctx.translate('commands:flagGuesser.errorDescriptions.invalidScore')
            );

         const confirmed = await ctx.confirmationRequest(
            ctx.translate('commands:flagGuesser.resetConfirmRequest', { currentBestScore: bestScore })
         );

         if (confirmed === undefined)
            return;

         if (confirmed) {

            await ctx.client.prisma.flagGuesserScore.delete({
               where: {
                  userId: ctx.executor.id
               }
            });

            await ctx.client.prisma.cache.update('flagGuesserScore');

            const confirmEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('commands:flagGuesser.scoreReset'), iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription(
                  ctx.translate('commands:flagGuesser.bestScoreReset')
               );
   
            await ctx.interaction.editReply({
               embeds: [confirmEmbed],
               components: []
            });

         } else {

            const cancelEmbed = new EmbedBuilder()
               .setColor(ctx.client.colors.SECONDARY)
               .setAuthor({ name: ctx.translate('common:cancellation'), iconURL: ctx.client.customImages.ARROW_ROTATE })
               .setDescription(
                  ctx.translate('commands:flagGuesser.bestScoreResetCancel')
               );
      
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
         description: 'Reset your current best score to 0.',
         type: ApplicationCommandOptionType.Subcommand
      }]
   }
});