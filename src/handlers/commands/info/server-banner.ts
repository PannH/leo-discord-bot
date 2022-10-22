import { Command } from '../../../structures/Command';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { ComponentType, ButtonStyle } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const bannerURL = ctx.guild.bannerURL({ extension: 'png', size: 4096 });

   if (!bannerURL)
      return void ctx.errorReply(
         ctx.translate('commands:serverBanner.errorTitles.invalidServer'),
         ctx.translate('commands:serverBanner.errorDescriptions.noBanner')
      );

   const bannerEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `${ctx.translate('commands:serverBanner.banner')}: ${ctx.guild.name}`, iconURL: ctx.client.customImages.IMAGE })
      .setImage(bannerURL);

   const bannerButtonRow = {
      type: ComponentType.ActionRow,
      components: [
         new ButtonBuilder()
            .setLabel(
               ctx.translate('commands:serverBanner.bannerURL')
            )
            .setStyle(ButtonStyle.Link)
            .setURL(bannerURL)
      ]
   };
   
   ctx.interaction.reply({
      embeds: [bannerEmbed],
      components: [bannerButtonRow]
   });

}, {
   name: 'server-banner',
   aliases: ['serverbanner', 'server banner'],
   description: 'Display the server\'s banner.',
   formats: [
      '/server-banner'
   ],
   examples: [
      '/server-banner'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'server-banner',
      description: 'Display the server\'s banner.'
   }
});