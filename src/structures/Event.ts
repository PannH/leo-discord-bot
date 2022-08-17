import type { Snowflake } from 'discord.js';
import type { EventRunFn } from '../typings/EventRunFn';

export class Event {

   public name: string;
   public run: EventRunFn;
   public id: Snowflake;

   constructor(name: string, runFn: EventRunFn) {

      this.name = name;
      this.run = runFn;

   };

};