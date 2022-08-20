import { EmbedBuilder } from '@discordjs/builders';
import type { User, GuildMember, Guild, GuildTextBasedChannel } from 'discord.js';
import type { LeoClient } from './LeoClient';
import type { CommandInteraction } from 'discord.js';
import type { Command } from './Command';

export class CommandContext {

   public client: LeoClient;
   public interaction: CommandInteraction;

   constructor(client: LeoClient, interaction: CommandInteraction) {

      this.client = client;
      this.interaction = interaction;

   };
   
   public get me(): GuildMember {

      return this.interaction.guild.members.cache.get(this.client.user.id);
      
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

      return void await this.interaction.reply({
         embeds: [errorEmbed],
         ephemeral: true
      });

   };
   
};