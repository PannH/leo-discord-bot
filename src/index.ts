require('dotenv').config();

import { LeoClient } from './structures/LeoClient';
import { Logger } from './structures/Logger';

const client = new LeoClient();

client.start();

client.handlers.events
   .prepare()
   .handle()
   .then((events) => Logger.debug(`Listening to ${events.size} events`));

client.handlers.autocompletes.prepare();

client.prisma.cache
   .initialize()
   .then(() => Logger.debug('Initialized the database\'s cache'));

client.locales
   .initialize()
   .then(() => Logger.debug('Initialized the locales'));