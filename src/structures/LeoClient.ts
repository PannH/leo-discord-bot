import { Client, GatewayIntentBits } from 'discord.js';
import { HandlerManager } from './HandlerManager';
import type { Colors } from '../typings/Colors';
import type { CustomEmojis } from '../typings/CustomEmojis';
import type { CustomImages } from '../typings/CustomImages';

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
         SECONDARY: 0x141415,
         ERROR: 0xdd2e44,
         SUCCESS: 0x77b255
      };
   };

   get customEmojis(): CustomEmojis {
      return {
         dot: this.emojis.cache.get(process.env.EMOJI_DOT),
         signal: this.emojis.cache.get(process.env.EMOJI_SIGNAL)
      }
   };

   get customImages(): CustomImages {
      return {
         ERROR: 'https://media.discordapp.net/attachments/1009558939001696296/1009606047314477086/error.png'
      }
   };

};