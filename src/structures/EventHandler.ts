import { Event } from './Event';
import { RESTEvent } from './RESTEvent';
import { Collection, SnowflakeUtil } from 'discord.js';
import { readdirSync } from 'fs';
import type { Snowflake } from 'discord.js';
import type { LeoClient } from './LeoClient';

export class EventHandler {

   private cached: boolean;
   public client: LeoClient;
   public cache: Collection<Snowflake, (Event | RESTEvent)>;

   constructor(client: LeoClient) {

      this.client = client;
      this.cache = new Collection();
      this.cached = false;

   };

   /**
    * @description Cache the events.
    */
   public prepare(): this {

      if (this.cached)
         throw new Error('The event handler has already been prepared.');

      const EVENT_DIRS = ['client'];

      for (let dir of EVENT_DIRS) {

         for (let fileName of readdirSync(`./dist/handlers/events/${dir}`)) {

            let event: (Event | RESTEvent) = require(`../handlers/events/${dir}/${fileName}`).default;

            event.id = SnowflakeUtil.generate().toString();

            this.cache.set(event.id, event);

         };

      };

      this.cached = true;

      return this;

   };

   /**
    * @description Listen to the cached events.
    */
   public async handle(): Promise<typeof this.cache> {

      if (!this.cached)
         throw new Error('The event handler must be prepared.');

      this.cache.forEach((event: any) => {

         if (event.rest)
            this.client.rest.addListener(event.name, event.run.bind(null, this.client));
         else
            this.client.addListener(event.name, event.run.bind(null, this.client));

      });

      return this.cache;

   };

};