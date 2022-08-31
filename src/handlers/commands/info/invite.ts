import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default new Command(async (ctx) => {

   const inviteEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Invite Links: ${ctx.client.user.username}`, iconURL: ctx.client.customImages.LINK })
      .setDescription(
         `${ctx.client.customEmojis.dot} Admin Permission: ${ctx.client.links.ADMIN_INVITE}\n` +
         `${ctx.client.customEmojis.dot} Editable Permissions: ${ctx.client.links.EDITABLE_PERMS_INVITE}`
      );

   ctx.interaction.reply({ embeds: [inviteEmbed] });

}, {
   name: 'invite',
   aliases: ['link', 'invite link', 'invite url'],
   description: 'Get an invite link to invite the bot.',
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'invite',
      description: 'Get an invite link to invite the bot.'
   }
});