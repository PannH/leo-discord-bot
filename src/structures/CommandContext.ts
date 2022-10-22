import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { User, GuildMember, Guild, GuildTextBasedChannel, ComponentType, ChatInputCommandInteraction, ButtonStyle } from 'discord.js';
import { v4 as uuid } from 'uuid';
import type { LeoClient } from './LeoClient';
import type { Command } from './Command';
import type { Embed } from 'discord.js';
import type { TOptions } from 'i18next';

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

   public get language(): string {

      return this.client.prisma.cache.language.find((lang) => lang.guildId === this.guild.id)?.lang ?? 'en';

   };

   public translate(key: string, options?: TOptions): string {

      options = options ?? {};

      options.lng = this.language;

      return this.client.locales.t(key, options);

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
         .setAuthor({ name: this.translate('common:confirmRequest'), iconURL: this.client.customImages.QUESTION_MARK_CIRCLE })
         .setDescription(`> ${message}`);

      const componentIds = {
         'request.confirm': uuid(),
         'request.cancel': uuid()
      };

      const confirmButtonsRow = {
         type: ComponentType.ActionRow,
         components: [
            new ButtonBuilder()
               .setCustomId(componentIds['request.confirm'])
               .setStyle(ButtonStyle.Primary)
               .setEmoji({ id: this.client.customEmojis.checkmark.id })
               .setLabel(
                  this.translate('common:confirm')
               ),
            new ButtonBuilder()
               .setCustomId(componentIds['request.cancel'])
               .setStyle(ButtonStyle.Secondary)
               .setEmoji({ id: this.client.customEmojis.xmark.id })
               .setLabel(
                  this.translate('common:cancel')
               )
         ]
      };

      if (this.interaction.deferred || this.interaction.replied)
         await this.interaction.editReply({ embeds: [confirmEmbed], components: [confirmButtonsRow] });
      else
         await this.interaction.reply({ embeds: [confirmEmbed], components: [confirmButtonsRow], ephemeral: true });

      try {
         
         const response = await this.channel.awaitMessageComponent({
            filter: (inter) => Object.values(componentIds).includes(inter.customId) && inter.user.id === this.executor.id,
            componentType: ComponentType.Button,
            time: (10 * 1000 * 60)
         });

         return response.customId === componentIds['request.confirm'] ? true : false;

      } catch (error) {

         confirmEmbed.setFooter({ text: `⏱️ ${this.translate('common:noResponseRequestCancelled')}` });
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

      const lastPageIndex = embeds.length - 1;

      const componentIds = {
         'pages.first': uuid(),
         'pages.previous': uuid(),
         'pages.next': uuid(),
         'pages.last': uuid()
      };

      const self = this;
      
      function generateComponents(currentPageIndex: number, maxPageIndex: number): any {

         return [{
            type: ComponentType.ActionRow,
            components: [
               new ButtonBuilder()
                  .setCustomId(componentIds['pages.first'])
                  .setEmoji({ id: self.client.customEmojis.doubleArrowLeft.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === 0),
               new ButtonBuilder()
                  .setCustomId(componentIds['pages.previous'])
                  .setEmoji({ id: self.client.customEmojis.arrowLeft.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === 0),
               new ButtonBuilder()
                  .setCustomId('pages.count')
                  .setLabel(`${currentPageIndex + 1} / ${maxPageIndex + 1}`)
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
               new ButtonBuilder()
                  .setCustomId(componentIds['pages.next'])
                  .setEmoji({ id: self.client.customEmojis.arrowRight.id })
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPageIndex === maxPageIndex),
               new ButtonBuilder()
                  .setCustomId(componentIds['pages.last'])
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
         filter: (inter) => Object.values(componentIds).includes(inter.customId) && inter.user.id === this.interaction.user.id,
         componentType: ComponentType.Button,
         time: (30 * 1000 * 60)
      });

      buttonCollector.on('collect', async (buttonInteraction) => {

         if (buttonInteraction.customId === componentIds['pages.first'])
            currentPageIndex = 0;
         else if (buttonInteraction.customId === componentIds['pages.previous'])
            currentPageIndex--;
         else if (buttonInteraction.customId === componentIds['pages.next'])
            currentPageIndex++;
         else if (buttonInteraction.customId === componentIds['pages.last'])
            currentPageIndex = lastPageIndex;

         await buttonInteraction.update({
            embeds: [embeds[currentPageIndex]],
            components: generateComponents(currentPageIndex, lastPageIndex)
         });

      });

   };
   
};