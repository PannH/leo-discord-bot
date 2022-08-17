import { Event } from '../../structures/Event';
import { CommandContext } from '../../structures/CommandContext';
import { InteractionType } from 'discord.js';
import type { CommandInteraction } from 'discord.js';

export default new Event('interactionCreate', async (client, interaction: CommandInteraction) => {

   switch (interaction.type) {

      case InteractionType.ApplicationCommand: {

         const command = client.handlers.commands.cache.find((c) => c.data.name === interaction.commandName);
         const ctx = new CommandContext(client, interaction);

         command.run(ctx);

      };

      default:
         break;

   };

});