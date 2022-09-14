import type { Guild, GuildMember, Message, User } from "discord.js";
import { Command } from "./Command";
import type { LeoClient } from "./LeoClient";

export class PrivateCommandContext {

   public client: LeoClient;
   public message: Message;

   constructor (client: LeoClient, message: Message) {

      this.client = client;
      this.message = message;

   };

   public get args(): string[] {

      return this.message.content.split(/ +/gm);

   };

   public get me(): GuildMember {

      return this.message.guild.members.me;

   };

   public get executor(): User {

      return this.message.author;

   };

   public get member(): GuildMember {

      return this.message.member;

   };

   public get guild(): Guild {

      return this.message.guild;

   };

   public get channel(): typeof this.message.channel {
     
      return this.message.channel;

   };

   public get executedTimestamp(): number {

      return this.message.createdTimestamp;

   };

};