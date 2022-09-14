import { Command } from '../../../structures/Command';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { ComponentType, ButtonStyle } from 'discord.js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const iconURL = ctx.guild.iconURL({ extension: 'png', size: 4096 });

   if (!iconURL)
      return void ctx.errorReply('Invalid Server', 'The server does not have an icon.');

   const iconEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Icon: ${ctx.guild.name}`, iconURL: ctx.client.customImages.IMAGE })
      .setImage(iconURL);

   const iconButtonRow = {
      type: ComponentType.ActionRow,
      components: [
         new ButtonBuilder()
            .setLabel('Icon URL')
            .setStyle(ButtonStyle.Link)
            .setURL(iconURL)
      ]
   };
   
   ctx.interaction.reply({
      embeds: [iconEmbed],
      components: [iconButtonRow]
   });

}, {
   name: 'server-icon',
   aliases: ['servericon', 'server icon'],
   description: 'Display the server\'s icon.',
   formats: [
      '/server-icon'
   ],
   examples: [
      '/server-icon'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'server-icon',
      description: 'Display the server\'s icon.'
   }
});