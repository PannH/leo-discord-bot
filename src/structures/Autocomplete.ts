import type { AutocompleteRunFn } from '../typings/AutocompleteRunFn';
import type { Snowflake } from 'discord.js';

export class Autocomplete {

   public commandName: string;
   public run: AutocompleteRunFn;
   public id: Snowflake;

   constructor(commandName: string, runFn: AutocompleteRunFn) {

      this.commandName = commandName;
      this.run = runFn;

   }

}