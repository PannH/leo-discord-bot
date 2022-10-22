import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { HandlerManager } from './HandlerManager';
import { PrismaDatabase } from './PrismaDatabase';
import { Locales } from './Locales';
import type { Colors } from '../typings/Colors';
import type { CustomEmojis } from '../typings/CustomEmojis';
import type { CustomImages } from '../typings/CustomImages';
import type { Links } from '../typings/Links';
import type { User } from 'discord.js';
import type { TOptions } from 'i18next';
import { CustomChannels } from '../typings/CustomChannels';

export class LeoClient extends Client {

   public handlers: HandlerManager;
   public prisma: PrismaDatabase;
   public locales: Locales;

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
      this.locales = new Locales();

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
         xmarkCircle: this.emojis.cache.get(process.env.EMOJI_XMARK_CIRCLE),
         bell: this.emojis.cache.get(process.env.EMOJI_BELL),
         arrowLeft: this.emojis.cache.get(process.env.EMOJI_ARROW_LEFT),
         arrowRight: this.emojis.cache.get(process.env.EMOJI_ARROW_RIGHT),
         doubleArrowLeft: this.emojis.cache.get(process.env.EMOJI_DOUBLE_ARROW_LEFT),
         doubleArrowRight: this.emojis.cache.get(process.env.EMOJI_DOUBLE_ARROW_RIGHT),
         checkmark: this.emojis.cache.get(process.env.EMOJI_CHECKMARK),
         xmark: this.emojis.cache.get(process.env.EMOJI_XMARK),
         votePlus: this.emojis.cache.get(process.env.EMOJI_VOTE_PLUS),
         voteMinus: this.emojis.cache.get(process.env.EMOJI_VOTE_MINUS),
         voteNeutral: this.emojis.cache.get(process.env.EMOJI_VOTE_NEUTRAL)
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
         QUESTION_MARK: process.env.IMAGE_QUESTION_MARK,
         TOOLS: process.env.IMAGE_TOOLS,
         QUESTION_MARK_CIRCLE: process.env.IMAGE_QUESTION_MARK_CIRCLE,
         ARROW_ROTATE: process.env.IMAGE_ARROW_ROTATE,
         FLAG: process.env.IMAGE_FLAG,
         CLOUD: process.env.IMAGE_CLOUD,
         GRAPH: process.env.IMAGE_GRAPH,
         FILM: process.env.IMAGE_FILM
      }
   };

   public get customChannels(): CustomChannels {
      return {
         errors: this.channels.cache.get(process.env.CHANNEL_ERRORS) as TextChannel,
         guildLogs: this.channels.cache.get(process.env.CHANNEL_GUILD_LOGS) as TextChannel
      }
   };

   public get version(): string {

      return require('../../package.json').version;
      
   };

   public translate(key, options?: TOptions): string {

      return this.locales.t(key, options);

   };

};