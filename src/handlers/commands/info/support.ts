import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const inviteEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Support Server: ${ctx.client.user.username}`, iconURL: ctx.client.customImages.LINK })
      .setDescription(`${ctx.client.customEmojis.dot} Invite: ${ctx.client.links.SUPPORT}`);

   ctx.interaction.reply({
      embeds: [inviteEmbed],
      ephemeral: true
   });

}, {
   name: 'support',
   aliases: ['support server', 'support', 'support invite', 'support link'],
   description: 'Get an invite link to the support server.',
   formats: [
      '/support'
   ],
   examples: [
      '/support'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'support',
      description: 'Get an invite link to the support server.'
   }
});