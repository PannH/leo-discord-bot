import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, ComponentType, ButtonStyle } from 'discord.js';
import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const user = await ctx.client.users.fetch(ctx.interaction.options.getUser('user') ?? ctx.executor, { force: true });
   const bannerURL = user.bannerURL({ extension: 'png', size: 4096 });

   if (!bannerURL)
      return void ctx.errorReply('Invalid User', `The specified user does not have a banner.`);

   const bannerEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Banner: ${user.tag}`, iconURL: ctx.client.customImages.IMAGE })
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
   })

}, {
   name: 'banner',
   aliases: ['user-banner', 'user banner', 'userbanner'],
   description: 'Display someone\'s banner or yours.',
   formats: [
      '/banner `(user)`'
   ],
   examples: [
      '/banner',
      '/banner `user: @User`',
      '/banner `user: 123456789123456789`'
   ],
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'banner',
      description: 'Display someone\'s banner or yours.',
      options: [{
         name: 'user',
         description: 'The user you want to display the banner of.',
         type: ApplicationCommandOptionType.User,
         required: false
      }]
   }
});