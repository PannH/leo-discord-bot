import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';

export default new Event('ready', async (client) => {

   Logger.debug(`Client logged in as '${client.user.tag}'`);

   // Handle commands
   client.handlers.commands
      .prepare()
      .deploy()
      .then((commands) => Logger.debug(`Deployed ${commands.size} slash commands`));

});