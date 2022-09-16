import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import humanizeDuration from 'humanize-duration';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const infoEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Information: ${ctx.client.user.username}`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(ctx.client.user.displayAvatarURL())
      .addFields({
         name: 'Created by',
         value: `[\`${ctx.client.owner.tag}\`](${ctx.client.links.LINKTREE})`,
         inline: true
      }, {
         name: 'Version',
         value: `\`${require('../../../../package.json').version}\``,
         inline: true
      }, {
         name: 'Uptime',
         value: humanizeDuration(ctx.client.uptime, { largest: 2, maxDecimalPoints: 1 }),
         inline: true
      }, {
         name: 'Links',
         value: `${ctx.client.customEmojis.dot} Support Server: [Join](${ctx.client.links.SUPPORT})\n` +
                `${ctx.client.customEmojis.dot} GitHub Repository: [Go To](${ctx.client.links.GITHUB_REPO})\n` +
                `${ctx.client.customEmojis.dot} Invite (As Admin): [Invite](${ctx.client.links.ADMIN_INVITE})\n` +
                `${ctx.client.customEmojis.dot} Invite (Editable Perms): [Invite](${ctx.client.links.EDITABLE_PERMS_INVITE})\n` +
                `${ctx.client.customEmojis.dot} Website: [leo.adkynet.eu](${ctx.client.links.WEBSITE})`,
         inline: true
      }, {
         name: 'Statistics',
         value: `${ctx.client.customEmojis.dot} Servers: ${ctx.client.guilds.cache.size}\n` +
                `${ctx.client.customEmojis.dot} Users: ${ctx.client.users.cache.size}`,
         inline: true
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'bot-info',
   aliases: ['botinfo', 'bot info'],
   description: 'Display information about the bot.',
   formats: [
      '/bot-info`'
   ],
   examples: [
      '/bot-info'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'bot-info',
      description: 'Display information about the bot.'
   }
});