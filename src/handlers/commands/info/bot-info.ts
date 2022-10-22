import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import humanizeDuration from 'humanize-duration';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const infoEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:botInfo.information')}: ${ctx.client.user.username}`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(ctx.client.user.displayAvatarURL())
      .addFields({
         name: ctx.translate('commands:botInfo.createdBy'),
         value: `[\`${ctx.client.owner.tag}\`](${ctx.client.links.LINKTREE})`,
         inline: true
      }, {
         name: ctx.translate('commands:botInfo.version'),
         value: `\`${ctx.client.version}\``,
         inline: true
      }, {
         name: ctx.translate('commands:botInfo.uptime'),
         value: humanizeDuration(ctx.client.uptime, { largest: 2, maxDecimalPoints: 1, language: ctx.language }),
         inline: true
      }, {
         name: ctx.translate('commands:botInfo.links'),
         value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.supportServer')} [${ctx.translate('commands:botInfo.join')}](${ctx.client.links.SUPPORT})\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.githubRepo')}: [${ctx.translate('commands:botInfo.goTo')}](${ctx.client.links.GITHUB_REPO})\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.inviteAsAdmin')}: [${ctx.translate('commands:botInfo.invite')}](${ctx.client.links.ADMIN_INVITE})\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.inviteEditablePerms')}: [${ctx.translate('commands:botInfo.invite')}](${ctx.client.links.EDITABLE_PERMS_INVITE})\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.website')}: [leo.adkynet.eu](${ctx.client.links.WEBSITE})`,
         inline: true
      }, {
         name: ctx.translate('commands:botInfo.stats'),
         value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.servers')}: ${ctx.client.guilds.cache.size}\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:botInfo.users')}: ${ctx.client.users.cache.size}`,
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