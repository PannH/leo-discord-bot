import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { GuildPremiumTier } from 'discord.js';
import { timestamp } from '../../../functions/timestamp';

export default new Command(async (ctx) => {

   const { guild } = ctx;

   if (!guild.available)
      return void ctx.errorReply('Unavailable Server', 'The server data is not available.');

   enum premiumTiers {
      Tier1 = 'Tier 1',
      Tier2 = 'Tier 2',
      Tier3 = 'Tier 3'
   };

   const infoEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Information: ${guild.name} [${guild.nameAcronym}]`, iconURL: ctx.client.customImages.INFO })
      .setThumbnail(guild.iconURL({ extension: 'png', size: 4096 }))
      .setDescription(guild.description)
      .addFields({
         name: 'Identifier',
         value: `\`${guild.id}\``,
         inline: true
      }, {
         name: 'Owner',
         value: ctx.client.users.cache.get(guild.ownerId).toString(),
         inline: true
      }, {
         name: 'Boost Status',
         value: guild.premiumTier === GuildPremiumTier.None ? 'None' : `${premiumTiers[guild.premiumTier]} (Boosts: ${guild.premiumSubscriptionCount})`,
         inline: true
      }, {
         name: 'Large',
         value: guild.large ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Verified',
         value: guild.verified ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Partnered',
         value: guild.partnered ? ctx.client.customEmojis.checkmarkCircle.toString() : ctx.client.customEmojis.xmarkCircle.toString(),
         inline: true
      }, {
         name: 'Creation Date',
         value: `${timestamp(guild.createdTimestamp, 'f')} - ${timestamp(guild.createdTimestamp, 'R')}`
      }, {
         name: 'Channel Statistics',
         value: `${ctx.client.customEmojis.dot} Total: ${guild.channels.cache.size}\n` +
                `${ctx.client.customEmojis.dot} Text: ${guild.channels.cache.filter((c) => c.isTextBased()).size}\n` +
                `${ctx.client.customEmojis.dot} Voice: ${guild.channels.cache.filter((c) => c.isVoiceBased()).size}\n` +
                `${ctx.client.customEmojis.dot} Threads: ${guild.channels.cache.filter((c) => c.isThread()).size}`,
         inline: true
      }, {
         name: 'Member Statistics',
         value: `${ctx.client.customEmojis.dot} Total: ${guild.memberCount} (max: ${guild.maximumMembers})\n` +
                `${ctx.client.customEmojis.dot} Humans: ${guild.memberCount - guild.members.cache.filter((m) => m.user.bot).size}\n` +
                `${ctx.client.customEmojis.dot} Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`,
         inline: true
      });

   ctx.interaction.reply({ embeds: [infoEmbed] });

}, {
   name: 'server-info',
   aliases: ['serverinfo', 'server info'],
   description: 'Display information about the server.',
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'server-info',
      description: 'Display information about the server.'
   }
});