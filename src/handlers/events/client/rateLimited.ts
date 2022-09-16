import { RESTEvent } from '../../../structures/RESTEvent';
import { Logger } from '../../../structures/Logger';
import type { RateLimitData } from 'discord.js';

export default new RESTEvent('rateLimited', async (client, data: RateLimitData) => {

   Logger.warn(`The client is being rate limited. Route: '${data.route}', Method: '${data.method}', Timeout: ${data.timeToReset / 1000}s`);

});