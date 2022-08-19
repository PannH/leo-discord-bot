import { LeoClient } from './LeoClient';
import { readdirSync } from 'fs';
import { Collection, SnowflakeUtil } from 'discord.js';
import type { Snowflake } from 'discord.js';
import type { Command } from './Command';

export class CommandHandler {

   private cached: boolean = false;
   public client: LeoClient;
   public cache: Collection<Snowflake, Command>;

   constructor(client: LeoClient) {

      this.client = client;
      this.cache = new Collection();

   };

   /**
    * @description Cache the commands.
    */
   prepare(): this {

      if (this.cached)
         throw new Error('The command handler has already been prepared.');

      for (let dir of readdirSync(`./dist/commands`)) {

         for (let fileName of readdirSync(`./dist/commands/${dir}`)) {

            const command: Command = require(`../commands/${dir}/${fileName}`).default;

            command.id = SnowflakeUtil.generate().toString();

            this.cache.set(command.id, command);

         };

      };

      this.cached = true;

      return this;

   };

   /**
    * @description Deploy the cached slash commands to client's guilds.
    */
   async deploy(): Promise<typeof this.cache> {

      if (!this.cached)
         throw new Error('The command handler must be prepared.');

      this.client.guilds.cache
         .filter((g) => g.id !== process.env.SUPPORT_GUILD_ID)
         .forEach((g) => {

            g.commands.set(
               this.cache
                  .filter((cmd) => cmd.data.category !== 'PRIVATE')
                  .map((cmd) => cmd.data.slashData)
            );

         });

      return this.cache;

   };

};