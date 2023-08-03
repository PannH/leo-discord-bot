import { EventHandler } from './EventHandler';
import { CommandHandler } from './CommandHandler';
import { AutocompleteHandler } from './AutocompleteHandler';
import type { LeoClient } from './LeoClient';

export class HandlerManager {

   public client: LeoClient;
   public events: EventHandler;
   public commands: CommandHandler;
   public autocompletes: AutocompleteHandler;

   constructor(client: LeoClient) {

      this.client = client;
      this.events = new EventHandler(client);
      this.commands = new CommandHandler(client);
      this.autocompletes = new AutocompleteHandler(client);

   }

}