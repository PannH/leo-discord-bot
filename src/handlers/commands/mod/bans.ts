import { Command } from '../../../structures/Command';
import { timestamp } from '../../../functions/timestamp';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   await ctx.interaction.deferReply({ ephemeral: true });

   const bans = await ctx.guild.bans.fetch();

   if (!bans.size)
      return void ctx.errorReply('No Ban Found', 'This server does not have any ban.');

   const baseEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Bans: ${ctx.guild.name} (${bans.size})`, iconURL: ctx.client.customImages.LIST })
      .setThumbnail(ctx.guild.iconURL({ extension: 'png', size: 4096 }));

   let banEmbeds = [];

   let banIndex = 0;
   for (let i = 0; i < (bans.size / 5); i++) {

      const pageEmbed = new EmbedBuilder(baseEmbed.toJSON());

      for (let j = 0; j < 5; j++) {

         const ban = bans.at(banIndex);

         if (!ban)
            break;

         banEmbeds[i] = pageEmbed.addFields({
            name: `Ban #${banIndex + 1}`,
            value: `${ctx.client.customEmojis.dot} User: **${ban.user.tag}** (\`${ban.user.id}\`)\n` +
                   `${ctx.client.customEmojis.dot} Reason: \`${ban.reason ?? 'No reason'}\``
         });

         banIndex++;

      };

   };

   ctx.embedPagination(banEmbeds, true);

}, {
   name: 'bans',
   aliases: ['bannings'],
   description: 'Explore the server bans.',
   formats: [
      '/bans'
   ],
   examples: [
      '/bans'
   ],
   category: 'MODERATION',
   clientPermissions: ['BanMembers'],
   memberPermissions: ['BanMembers'],
   type: 'SLASH',
   slashData: {
      name: 'bans',
      description: 'Explore the server bans.'
   }
});