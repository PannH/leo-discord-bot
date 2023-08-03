import type { Snowflake } from 'discord.js';
import type { CommandRunFn } from '../typings/CommandRunFn';
import type { CommandData } from '../typings/CommandData';
import type { Guild } from 'discord.js';

export class Command {

   public run: CommandRunFn;
   public data: CommandData;
   public id: Snowflake;

   constructor(runFn: CommandRunFn, data: CommandData) {

      this.run = runFn;
      this.data = data;

   }

   public mention(guild?: Guild): string {

      const command = !guild 
                        ? { name: this.data.name, id: 0 }
                        : guild.commands.cache.find((c) => c.name === this.data.name);
      
      return `</${command.name}:${command.id}>`;

   }

}