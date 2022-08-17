require('dotenv').config();

import { LeoClient } from './structures/LeoClient';
import { Logger } from './structures/Logger';

const client = new LeoClient();

client.start();

client.handlers.events
   .prepare()
   .handle()
      .then((events) => Logger.info(`Listening to ${events.size} events`));