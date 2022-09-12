import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { User, GuildMember, Guild, GuildTextBasedChannel, ComponentType, ChatInputCommandInteraction, ButtonStyle, ButtonComponent } from 'discord.js';
import type { LeoClient } from './LeoClient';
import type { Command } from './Command';
import type { Embed, ActionRow } from 'discord.js';

export class CommandContext {

   public client: LeoClient;
   public interaction: ChatInputCommandInteraction;

   constructor(client: LeoClient, interaction: ChatInputCommandInteraction) {

      this.client = client;
      this.interaction = interaction;

   };
   
   public get me(): GuildMember {

      return this.interaction.guild.members.me;
      
   };

   public get executor(): User {

      return this.interaction.user;

   };

   public get member(): GuildMember {

      return this.interaction.guild.members.cache.get(this.interaction.user.id);

   };

   public get guild(): Guild {

      return this.interaction.guild;

   };

   public get channel(): GuildTextBasedChannel {

      return this.interaction.channel;

   };

   public get command(): Command {

      return this.client.handlers.commands.cache.find((c) => c.data.name === this.interaction.commandName);

   };

   public get executedTimestamp(): number {

      return this.interaction.createdTimestamp;

   };

   public async errorReply(title: string, message: string): Promise<void> {

      const errorEmbed = new EmbedBuilder()
         .setColor(this.client.colors.ERROR)
         .setAuthor({ name: title })
         .setDescription(`> ${message}`);
         
      if (this.interaction.replied || this.interaction.deferred)
         return void await this.interaction.editReply({ embeds: [errorEmbed], components: [] });
      else 
         return void await this.interaction.reply({ embeds: [errorEmbed], ephemeral: true });

   };

   public async successReply(title: string, message: string): Promise<void> {

      const errorEmbed = new EmbedBuilder()
         .setColor(this.client.colors.SUCCESS)
         .setAuthor({ name: title })
         .setDescription(`> ${message}`);
         
      if (this.interaction.replied || this.interaction.deferred)
         return void await this.interaction.editReply({ embeds: [errorEmbed], components: [] });
      else 
         return void await this.interaction.reply({ embeds: [errorEmbed], ephemeral: true });

   };

   public async confirmationRequest(message: string): Promise<(boolean | undefined)> {

      const confirmEmbed = new EmbedBuilder()
         .setColor(this.client.colors.SECONDARY)
         .setAuthor({ name: 'Confirmation Request', iconURL: this.client.customImages.QUESTION_MARK_CIRCLE })
         .setDescription(`> ${message}`);

      const confirmButtonsRow = {
         type: ComponentType.ActionRow,
         components: [
            new ButtonBuilder()
               .setCustomId('request.confirm')
               .setStyle(ButtonStyle.Primary)
               .setEmoji({ id: this.client.customEmojis.checkmark.id })
               .setLabel('Confirm'),
            new ButtonBuilder()
               .setCustomId('request.cancel')
               .setStyle(ButtonStyle.Secondary)
               .setEmoji({ id: this.client.customEmojis.xmark.id })
               .setLabel('Cancel')
         ]
      };

      if (this.interaction.deferred || this.interaction.replied)
         await this.interaction.editReply({ embeds: [confirmEmbed], components: [confirmButtonsRow] });
      else
         await this.interaction.reply({ embeds: [confirmEmbed], components: [confirmButtonsRow], ephemeral: true });

      try {
         
         const response = await this.channel.awaitMessageComponent({
            filter: (inter) => ['request.confirm', 'request.cancel'].includes(inter.customId) && inter.user.id === this.executor.id,
            componentType: ComponentType.Button,
            time: (10 * 1000 * 60)
         });

         const confirmation = {
            'request.confirm': true,
            'request.cancel': false
         };

         return confirmation[response.customId];

      } catch (error) {

         confirmEmbed.setFooter({ text: '⏱️ No response, request cancelled...' });
         confirmButtonsRow.components.forEach((c) => c.setDisabled(true));

         await this.interaction.editReply({
            embeds: [confirmEmbed],
            components: [confirmButtonsRow]
         });

         return undefined;

      };

   };

   public async embedPagination(embeds: Embed[], ephemeral: boolean): Promise<void> {

      let currentPageIndex = 0;

      const lastPageIndex = embeds.length - 1

      const self = this;
      function generateComponents(currentPageIndex: number, maxPageIndex: number): any {

         return [{
            type: ComponentType.ActionRow,
            components: [
               new ButtonBuilder()
                  .setCustomId('pages.first')
                  .setEmoji({ id: self.client.customEmojis.doubleArrowLeft.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === 0),
               new ButtonBuilder()
                  .setCustomId('pages.previous')
                  .setEmoji({ id: self.client.customEmojis.arrowLeft.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === 0),
               new ButtonBuilder()
                  .setCustomId('pages.count')
                  .setLabel(`${currentPageIndex + 1} / ${maxPageIndex + 1}`)
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
               new ButtonBuilder()
                  .setCustomId('pages.next')
                  .setEmoji({ id: self.client.customEmojis.arrowRight.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === maxPageIndex),
               new ButtonBuilder()
                  .setCustomId('pages.last')
                  .setEmoji({ id: self.client.customEmojis.doubleArrowRight.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === maxPageIndex),
            ]
         }];

      };

      if (this.interaction.deferred || this.interaction.replied)
         await this.interaction.editReply({
            embeds: [embeds[currentPageIndex]],
            components: generateComponents(currentPageIndex, lastPageIndex)
         });
      else 
         await this.interaction.reply({
            embeds: [embeds[currentPageIndex]],
            components: generateComponents(currentPageIndex, lastPageIndex),
            ephemeral
         });

      const buttonCollector = this.interaction.channel.createMessageComponentCollector({
         filter: (inter) => ['pages.first', 'pages.previous', 'pages.next', 'pages.last'].includes(inter.customId) && inter.user.id === this.interaction.user.id,
         componentType: ComponentType.Button,
         time: (30 * 1000 * 60)
      });

      buttonCollector.on('collect', async (buttonInteraction) => {

         if (buttonInteraction.customId === 'pages.first')
            currentPageIndex = 0;
         else if (buttonInteraction.customId === 'pages.previous')
            currentPageIndex--;
         else if (buttonInteraction.customId === 'pages.next')
            currentPageIndex++;
         else if (buttonInteraction.customId === 'pages.last')
            currentPageIndex = lastPageIndex;

         buttonInteraction.update({
            embeds: [embeds[currentPageIndex]],
            components: generateComponents(currentPageIndex, lastPageIndex)
         });

      });

   };
   
};