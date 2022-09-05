import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { User, GuildMember, Guild, GuildTextBasedChannel, ComponentType, ChatInputCommandInteraction, ButtonStyle } from 'discord.js';
import type { LeoClient } from './LeoClient';
import type { Command } from './Command';

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
               .setLabel('Confirm'),
            new ButtonBuilder()
               .setCustomId('request.cancel')
               .setStyle(ButtonStyle.Secondary)
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
   
};