import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { GuildPremiumTier } from 'discord.js';
import { timestamp } from '../../../functions/timestamp';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const { guild } = ctx;

   if (!guild.available)
      return void ctx.errorReply(
         ctx.translate('commands:serverInfo.errorTitles.unavailableServer'),
         ctx.translate('commands:serverInfo.errorTitles.unavailableData')
      );

   const premiumTiers = {
      'Tier1': ctx.translate('commands:serverInfo.tiers[0]'),
      'Tier2': ctx.translate('commands:serverInfo.tiers[1]'),
      'Tier3': ctx.translate('commands:serverInfo.tiers[2]')
   };

   const infoEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:serverInfo.information')}: ${guild.name} [${guild.nameAcronym}]`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(guild.iconURL({ extension: 'png', size: 4096 }))
      .setDescription(guild.description)
      .addFields({
         name: ctx.translate('commands:serverInfo.identifier'),
         value: `\`${guild.id}\``,
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.owner'),
         value: ctx.client.users.cache.get(guild.ownerId).toString(),
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.boostStatus'),
         value: guild.premiumTier === GuildPremiumTier.None ? ctx.translate('common:none') : `${premiumTiers[guild.premiumTier]} (Boosts: ${guild.premiumSubscriptionCount})`,
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.large'),
         value: guild.large ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.verified'),
         value: guild.verified ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.partnered'),
         value: guild.partnered ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.creationDate'),
         value: `${timestamp(guild.createdTimestamp, 'f')} - ${timestamp(guild.createdTimestamp, 'R')}`
      }, {
         name: ctx.translate('commands:serverInfo.channelStats'),
         value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.total')}: ${guild.channels.cache.size}\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.text')}: ${guild.channels.cache.filter((c) => c.isTextBased()).size}\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.voice')}: ${guild.channels.cache.filter((c) => c.isVoiceBased()).size}\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.threads')}: ${guild.channels.cache.filter((c) => c.isThread()).size}`,
         inline: true
      }, {
         name: ctx.translate('commands:serverInfo.memberStats'),
         value: `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.total')}: ${guild.memberCount} (${ctx.translate('commands:serverInfo.max')}: ${guild.maximumMembers})\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.humans')}: ${guild.memberCount - guild.members.cache.filter((m) => m.user.bot).size}\n` +
                `${ctx.client.customEmojis.dot} ${ctx.translate('commands:serverInfo.bots')}: ${guild.members.cache.filter((m) => m.user.bot).size}`,
         inline: true
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'server-info',
   aliases: ['serverinfo', 'server info'],
   description: 'Display information about the server.',
   formats: [
      '/server-info'
   ],
   examples: [
      '/server-info'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'server-info',
      description: 'Display information about the server.'
   }
});