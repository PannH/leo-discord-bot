import { Client, GatewayIntentBits } from 'discord.js';
import { HandlerManager } from './HandlerManager';
import type { Colors } from '../typings/Colors';
import type { CustomEmojis } from '../typings/CustomEmojis';

export class LeoClient extends Client {

   public handlers: HandlerManager;

   constructor() {

      super({
         intents: [
            GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
      });

      this.handlers = new HandlerManager(this);

   };

   /**
    * @description Login the client to Discord.
    */
   async start(): Promise<this> {

      await this.login(process.env.CLIENT_TOKEN);
      return this;

   };
   
   get colors(): Colors {
      return {
         PRIMARY: 0x2776ff,
         SECONDARY: 0x141415
      };
   };

   get customEmojis(): CustomEmojis {
      return {
         dot: this.emojis.cache.get(process.env.EMOJI_DOT),
         signal: this.emojis.cache.get(process.env.EMOJI_SIGNAL)
      }
   };

};