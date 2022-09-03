import { Command } from '../../../structures/Command';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { ComponentType, ButtonStyle } from 'discord.js';

export default new Command(async (ctx) => {

   const bannerURL = ctx.guild.bannerURL({ extension: 'png', size: 4096 });

   if (!bannerURL)
      return void ctx.errorReply('Invalid Server', 'The server does not have a banner.');

   const bannerEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Banner: ${ctx.guild.name}`, iconURL: ctx.client.customImages.IMAGE })
      .setImage(bannerURL);

   const bannerButtonRow = {
      type: ComponentType.ActionRow,
      components: [
         new ButtonBuilder()
            .setLabel('Banner URL')
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