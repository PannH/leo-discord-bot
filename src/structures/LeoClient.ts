import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { HandlerManager } from './HandlerManager';
import { PrismaDatabase } from './PrismaDatabase';
import type { Colors } from '../typings/Colors';
import type { CustomEmojis } from '../typings/CustomEmojis';
import type { CustomImages } from '../typings/CustomImages';
import type { Links } from '../typings/Links';
import type { User } from 'discord.js';
import { CustomChannels } from '../typings/CustomChannels';

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
            GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent
         ]
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

   public get owner(): User {
      return this.users.cache.get(process.env.OWNER_ID);
   };

   public get links(): Links {
      return {
         WEBSITE: process.env.LINK_WEBSITE,
         SUPPORT: process.env.LINK_SUPPORT,
         ADMIN_INVITE: process.env.LINK_ADMIN_INVITE,
         EDITABLE_PERMS_INVITE: process.env.LINK_EDITABLE_PERMS_INVITE,
         GITHUB_REPO: process.env.LINK_GITHUB_REPO,
         LINKTREE: process.env.LINK_LINKTREE
      };
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
         dot: this.emojis.cache.get(process.env.EMOJI_DOT),
         checkmarkCircle: this.emojis.cache.get(process.env.EMOJI_CHECKMARK_CIRCLE),
         xmarkCircle: this.emojis.cache.get(process.env.EMOJI_XMARK_CIRCLE)
      }
   };

   public get customImages(): CustomImages {
      return {
         ERROR: process.env.IMAGE_ERROR,
         SIGNAL: process.env.IMAGE_SIGNAL,
         IMAGE: process.env.IMAGE_IMAGE,
         INFO: process.env.IMAGE_INFO,
         LINK: process.env.IMAGE_LINK,
         LIST: process.env.IMAGE_LIST,
         QUESTION_MARK: process.env.IMAGE_QUESTION_MARK
      }
   };

   public get customChannels(): CustomChannels {
      return {
         errors: this.channels.cache.get(process.env.CHANNEL_ERRORS) as TextChannel
      }
   };

};