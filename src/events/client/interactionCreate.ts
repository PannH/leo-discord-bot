import { Event } from '../../structures/Event';
import { CommandContext } from '../../structures/CommandContext';
import { InteractionType } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../../structures/Command';

export default new Event('interactionCreate', async (client, interaction: ChatInputCommandInteraction) => {

   switch (interaction.type) {

      case InteractionType.ApplicationCommand: {

         const command: Command = client.handlers.commands.cache.find((c) => c.data.name === interaction.commandName);
         const ctx: CommandContext = new CommandContext(client, interaction);

         const perms = require('../../../data/permissions.json');

         const clientMissingPerms = command.data.clientPermissions.filter(
            (perm) => !interaction.guild.members.cache.get(client.user.id).permissions.has(perm)
         );

         if (!!clientMissingPerms.length)
            return void ctx.errorReply('Missing Permission', `I require the following permission(s) to run this command: ${clientMissingPerms.map((p) => `\`${perms[p.toString()].name}\``).join(', ')}`);

         const memberMissingPerms = command.data.memberPermissions.filter(
            (perm) => !interaction.memberPermissions.has(perm)
         );

         if (!!memberMissingPerms.length)
            return void ctx.errorReply('Missing Permission', `You must have the following permission(s) to use this command: ${memberMissingPerms.map((p) => `\`${perms[p.toString()].name}\``).join(', ')}`);

         command.run(ctx);

         break;

      };

      default:
         break;

   };

});