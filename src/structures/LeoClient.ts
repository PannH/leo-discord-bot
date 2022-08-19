import { Client, GatewayIntentBits } from 'discord.js';
import { HandlerManager } from './HandlerManager';
import { PrismaDatabase } from './PrismaDatabase';
import type { Colors } from '../typings/Colors';
import type { CustomEmojis } from '../typings/CustomEmojis';
import type { CustomImages } from '../typings/CustomImages';

export class LeoClient extends Client {

   public handlers: HandlerManager;
   public prisma: PrismaDatabase;

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
      this.prisma = new PrismaDatabase();

   };

   /**
    * @description Login the client to Discord.
    */
   public async start(): Promise<this> {

      await this.login(process.env.CLIENT_TOKEN);
      return this;

   };
   
   public get colors(): Colors {
      return {
         PRIMARY: 0x2776ff,
         SECONDARY: 0x141415,
         ERROR: 0xdd2e44,
         SUCCESS: 0x77b255
      };
   };

   public get customEmojis(): CustomEmojis {
      return {
         dot: this.emojis.cache.get(process.env.EMOJI_DOT)
      }
   };

   public get customImages(): CustomImages {
      return {
         SIGNAL: process.env.IMAGE_SIGNAL,
         ERROR: process.env.IMAGE_ERROR
      }
   };

};