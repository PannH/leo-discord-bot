import { Event } from '../../../structures/Event';
import { Logger } from '../../../structures/Logger';

export default new Event('ready', async (client) => {

   Logger.debug(`Client logged in as '${client.user.tag}'`);

   const activityName = `/commands | ${client.guilds.cache.size} servers | v${client.version}`;

   client.user.setActivity({ name: activityName });

   // Auto-update the activity
   setInterval(() => {

      client.user.setActivity({ name: activityName });

   }, 10 * 1000 * 60);

   // Handle commands
   client.handlers.commands
      .prepare()
      .deploy()
      .then((commands) => Logger.debug(`Deployed ${commands.size} slash commands`));

});