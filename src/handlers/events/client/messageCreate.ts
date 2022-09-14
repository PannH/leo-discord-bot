import { Event } from '../../../structures/Event';
import type { Message } from 'discord.js';
import { PrivateCommandContext } from '../../../structures/PrivateCommandContext';

export default new Event('messageCreate', async (client, message: Message) => {

   if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot || !message.guild)
      return;

   const commandContext = new PrivateCommandContext(client, message);

   const commandName = commandContext.args[0].substring(process.env.COMMAND_PREFIX.length);
   
   const command = client.handlers.commands.cache.find((c) => c.data.type === 'PRIVATE' && c.data.name === commandName.toLowerCase());

   if (!command)
      return;

   command.run(commandContext);

});