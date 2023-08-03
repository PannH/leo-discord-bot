import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionType } from 'discord.js';
import { timestamp } from '../../../functions/timestamp';
import axios from 'axios';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const movieTitle = ctx.interaction.options.getString('title');

   await ctx.interaction.deferReply();

   try {
     
      const { data } = await axios.get('https://api.popcat.xyz/imdb', { params: { q: movieTitle } });

      if (data['error'])
         return void ctx.errorReply(
            ctx.translate('commands:movie.errorTitles.invalidTitle'),
            ctx.translate('commands:movie.errorDescriptions.noMovieFound')
         );

      const releaseTimestamp = new Date(data['released']).getTime();

      const movieEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `${ctx.translate('commands:movie.movieSeries')}: ${data['title']}`, iconURL: ctx.client.customImages.FILM })
         .setThumbnail(data['poster'])
         .setDescription(`> ${data['plot']}`)
         .addFields({
            name: ctx.translate('commands:movie.mainActors'),
            value: data['actors'],
            inline: true
         }, {
            name: ctx.translate('commands:movie.director'),
            value: data['director'],
            inline: true
         }, {
            name: ctx.translate('commands:movie.writers'),
            value: data['writer'],
            inline: true
         }, {
            name: ctx.translate('commands:movie.rating'),
            value: `${data['rating']}/10`,
            inline: true
         }, {
            name: ctx.translate('commands:movie.genres'),
            value: data['genres'],
            inline: true
         }, {
            name: ctx.translate('commands:movie.country'),
            value: data['country'],
            inline: true
         }, {
            name: ctx.translate('commands:movie.release'),
            value: `${timestamp(releaseTimestamp, 'f')} - ${timestamp(releaseTimestamp, 'R')}`
         });

      if (ctx.language === 'fr')
         movieEmbed.setFooter({ text: 'Les données ne sont pas disponibles en français.' });

      await ctx.interaction.editReply({ embeds: [movieEmbed] });

   } catch (error) {
     
      ctx.errorReply(
         ctx.translate('common:unexpectedErrorTitle'),
         ctx.translate('common:unexpectedErrorDescription')
      );

   }

}, {
   name: 'movie',
   aliases: ['movies', 'films'],
   description: 'Display information about a specific movie/series.',
   category: 'INFORMATION',
   formats: [
      '/movie `[title]`'
   ],
   examples: [
      '/movie `title: Breaking Bad`'
   ],
   clientPermissions: [],
   memberPermissions: [],
   type: 'SLASH',
   slashData: {
      name: 'movie',
      description: 'Display information about a specific movie/series.',
      options: [{
         name: 'title',
         description: 'The movie/series title.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }
});