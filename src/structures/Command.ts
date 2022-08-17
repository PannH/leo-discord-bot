import type { Snowflake } from 'discord.js';
import type { CommandRunFn } from '../typings/CommandRunFn';
import type { CommandData } from '../typings/CommandData';

export class Command {

   public run: CommandRunFn;
   public data: CommandData;
   public id: Snowflake;

   constructor(runFn: CommandRunFn, data: CommandData) {

      this.run = runFn;
      this.data = data;

   };

};