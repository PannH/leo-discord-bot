import { Command } from '../../../structures/Command';
import { ButtonStyle, ComponentType, TextInputStyle } from 'discord.js';
import { EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder } from '@discordjs/builders';
import { v4 as uuid } from 'uuid';
import { Constants } from '../../../utils/Constants';
import type { SelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const fonts = require('../../../../data/text_fonts.json');
   
   let currentText = ctx.translate('commands:fontConverter.exampleText');
   let currentFontIndex = 4;

   function convertText(text: string, fontIndex: number) {

      const normalFont = fonts[0];
      const font = fonts[fontIndex];
      
      let convertedText = '';

      for (const char of [...text]) {

         convertedText += font[normalFont.indexOf(char)] ?? char;

      }

      return convertedText;

   }

   const converterEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: ctx.translate('commands:fontConverter.fontConverter'), iconURL: ctx.client.customImages.ARROW_ROTATE })
      .setDescription(ctx.translate('commands:fontConverter.converterDescription'))
      .addFields({
         name: ctx.translate('commands:fontConverter.text'),
         value: currentText
      }, {
         name: ctx.translate('commands:fontConverter.convertedText'),
         value: convertText(currentText, currentFontIndex)
      });

   const componentIds = {
      'font.change': uuid(),
      'text.edit': uuid()
   };

   const componentRows = [{
      type: ComponentType.ActionRow,
      components: [
         new SelectMenuBuilder()
            .setCustomId(componentIds['font.change'])
            .setPlaceholder(ctx.translate('commands:fontConverter.selectAFont'))
            .setOptions(
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 1))
                  .setValue('1'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 2))
                  .setValue('2'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 3))
                  .setValue('3'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 4))
                  .setValue('4'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 5))
                  .setValue('5'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 6))
                  .setValue('6'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 7))
                  .setValue('7'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 8))
                  .setValue('8'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 9))
                  .setValue('9'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 10))
                  .setValue('10'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 11))
                  .setValue('11'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 12))
                  .setValue('12'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 13))
                  .setValue('13'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 14))
                  .setValue('14'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 15))
                  .setValue('15'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 16))
                  .setValue('16'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 17))
                  .setValue('17'),
               new SelectMenuOptionBuilder()
                  .setLabel(convertText('Aa Bb Cc 123', 18))
                  .setValue('18')
            )
      ]
   }, {
      type: ComponentType.ActionRow,
      components: [
         new ButtonBuilder()
            .setCustomId(componentIds['text.edit'])
            .setStyle(ButtonStyle.Primary)
            .setLabel(ctx.translate('commands:fontConverter.editText'))
      ]
   }]

   await ctx.interaction.reply({
      embeds: [converterEmbed],
      components: componentRows,
      ephemeral: true
   });

   const componentCollector = ctx.channel.createMessageComponentCollector({
      filter: (inter) => Object.values(componentIds).includes(inter.customId) && inter.user.id === ctx.executor.id,
      time: (15 * 1000 * 60)
   });

   componentCollector.on('collect', async (inter) => {
      
      if (inter.customId === componentIds['font.change']) {

         inter = inter as SelectMenuInteraction;

         currentFontIndex = Number(inter.values[0]);

         converterEmbed.data.fields[1].value = convertText(currentText, currentFontIndex);

         await inter.update({ embeds: [converterEmbed] });

      } else if (inter.customId === componentIds['text.edit']) {

         inter = inter as ButtonInteraction;

         const modalId = uuid();
      
         const modalComponents = [{
            type: ComponentType.ActionRow,
            components: [{
               type: ComponentType.TextInput,
               customId: 'text',
               label: ctx.translate('commands:fontConverter.text'),
               placeholder: ctx.translate('commands:fontConverter.exampleText'),
               maxLength: 1024,
               style: TextInputStyle.Short,
               required: true
            }]
         }];
      
         const messageContentModal = {
            customId: modalId,
            title: ctx.translate('commands:fontConverter.fontConverterText'),
            components: modalComponents
         };
      
         await inter.showModal(messageContentModal as any);
      
         ctx.interaction.awaitModalSubmit({
            filter: (inter) => inter.customId === modalId && inter.user.id === ctx.executor.id,
            time: Constants.LARGEST_32BIT_INTEGER
         }).then(async (submitInter: any) => {
      
            currentText = submitInter.fields.getTextInputValue('text');

            converterEmbed.data.fields[0].value = currentText;
            converterEmbed.data.fields[1].value = convertText(currentText, currentFontIndex);
      
            await submitInter.update({
               embeds: [converterEmbed]
            });
      
         }).catch(() => {});

      }

   });

   componentCollector.on('end', async () => {

      const buttonRow = {
         type: ComponentType.ActionRow,
         components: [
            new ButtonBuilder()
               .setCustomId('.')
               .setStyle(ButtonStyle.Secondary)
               .setLabel(
                  ctx.translate('commands:fontConverter.theButtonsHaveExpired')
               )
               .setDisabled(true)
         ]
      };

      await ctx.interaction.editReply({ components: [buttonRow] });

   });

}, {
   name: 'font-converter',
   aliases: ['font converter', 'font conversion'],
   description: 'Open a font converter.',
   category: 'UTILITY',
   clientPermissions: [],
   memberPermissions: [],
   formats: [
      '/font-converter'
   ],
   examples: [
      '/font-converter'
   ],
   type: 'SLASH',
   slashData: {
      name: 'font-converter',
      description: 'Open a font converter.'
   }
})