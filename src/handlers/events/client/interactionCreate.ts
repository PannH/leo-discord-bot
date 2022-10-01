import { Event } from '../../../structures/Event';
import { CommandContext } from '../../../structures/CommandContext';
import { AutocompleteInteraction, InteractionType } from 'discord.js';
import { PermissionNames } from '../../../utils/PermissionNames';
import type { ChatInputCommandInteraction, Interaction } from 'discord.js';
import type { Command } from '../../../structures/Command';

export default new Event('interactionCreate', async (client, interaction: Interaction) => {

   switch (interaction.type) {

      case InteractionType.ApplicationCommand: {

         const commandInteraction = interaction as ChatInputCommandInteraction;

         const command: Command = client.handlers.commands.cache.find((c) => c.data.name === commandInteraction.commandName);
         const ctx: CommandContext = new CommandContext(client, commandInteraction);

         const clientMissingPerms = command.data.clientPermissions.filter(
            (perm) => !commandInteraction.guild.members.cache.get(client.user.id).permissions.has(perm)
         );

         if (!!clientMissingPerms.length)
            return void ctx.errorReply('Missing Permission', `I require the following permission(s) to run this command: ${clientMissingPerms.map((p) => `\`${PermissionNames[p.toString()]}\``).join(', ')}`);

         const memberMissingPerms = command.data.memberPermissions.filter(
            (perm) => !commandInteraction.memberPermissions.has(perm)
         );

         if (!!memberMissingPerms.length)
            return void ctx.errorReply('Missing Permission', `You must have the following permission(s) to use this command: ${memberMissingPerms.map((p) => `\`${PermissionNames[p.toString()]}\``).join(', ')}`);

         command.run(ctx);

         break;

      };

      case InteractionType.ApplicationCommandAutocomplete: {

         const autocompleteInteraction = interaction as AutocompleteInteraction;
         
         const autocomplete = client.handlers.autocompletes.cache.find((ac) => ac.commandName === autocompleteInteraction.commandName);

         autocomplete.run(client, autocompleteInteraction);

      };

      default:
         break;

   };

});