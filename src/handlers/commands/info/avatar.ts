import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from 'discord.js';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';

export default new Command(async (ctx) => {

   const user = ctx.interaction.options.getUser('user') ?? ctx.executor;
   const avatarURL = user.displayAvatarURL({ extension: 'png', size: 4096 });

   const avatarEmbed = new EmbedBuilder()
      .setColor(ctx.client.colors.SECONDARY)
      .setAuthor({ name: `Avatar: ${user.tag}`, iconURL: ctx.client.customImages.IMAGE })
      .setImage(avatarURL);

   const avatarButtonRow = {
      type: ComponentType.ActionRow,
      components: [
         new ButtonBuilder()
            .setLabel('Avatar URL')
            .setStyle(ButtonStyle.Link)
            .setURL(avatarURL)
      ]
   };

   ctx.interaction.reply({
      embeds: [avatarEmbed],
      components: [avatarButtonRow]
   })

}, {
   name: 'avatar',
   aliases: ['pp', 'pfp'],
   description: 'Display someone\'s avatar or yours.',
   category: 'INFORMATION',
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'avatar',
      description: 'Display someone\'s avatar or yours.',
      options: [{
         name: 'user',
         description: 'The user you want to display the avatar of.',
         type: ApplicationCommandOptionType.User,
         required: false
      }]
   }
})