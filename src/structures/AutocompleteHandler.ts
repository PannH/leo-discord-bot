import { Autocomplete } from './Autocomplete';
import { Collection, SnowflakeUtil } from 'discord.js';
import { readdirSync } from 'fs';
import type { Snowflake } from 'discord.js';
import type { LeoClient } from './LeoClient';

export class AutocompleteHandler {

   private cached: boolean = false;
   public client: LeoClient;
   public cache: Collection<Snowflake, Autocomplete>
   
   constructor(client: LeoClient) {

      this.client = client;
      this.cache = new Collection();
      this.cached = false;

   };

   /**
    * @description Cache the autocompletes.
    */
   public prepare(): this {

      if (this.cached)
         throw new Error('The autocomplete handler has already been prepared.');

      for (let fileName of readdirSync(`./dist/handlers/autocompletes`)) {

         const autocomplete: Autocomplete = require(`../handlers/autocompletes/${fileName}`).default;

         autocomplete.id = SnowflakeUtil.generate().toString();

         this.cache.set(autocomplete.id, autocomplete);

      };

      this.cached = true;

      return this;

   };

};