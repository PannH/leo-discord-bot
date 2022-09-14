import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const inviteEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Invite Links: ${ctx.client.user.username}`, iconURL: ctx.client.customImages.LINK })
      .setDescription(
         `${ctx.client.customEmojis.dot} Admin Permission: ${ctx.client.links.ADMIN_INVITE}\n` +
         `${ctx.client.customEmojis.dot} Editable Permissions: ${ctx.client.links.EDITABLE_PERMS_INVITE}`
      );

   ctx.interaction.reply({
      embeds: [inviteEmbed],
      ephemeral: true
   });

}, {
   name: 'invite',
   aliases: ['link', 'invite link', 'invite url'],
   description: 'Get an invite link to invite the bot.',
   formats: [
      '/invite'
   ],
   examples: [
      '/invite'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'invite',
      description: 'Get an invite link to invite the bot.'
   }
});