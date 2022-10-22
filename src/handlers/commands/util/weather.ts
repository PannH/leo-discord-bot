import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import weather from 'weather-js';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   await ctx.interaction.deferReply();

   const locationQuery = ctx.interaction.options.getString('location');
   const degreeType = ctx.interaction.options.getString('degree-type') ?? 'C';

   weather.find({ search: locationQuery, degreeType }, async (err, res) => {

      if (err)
         return void ctx.errorReply(
            ctx.translate('common:unexpectedErrorTitle'),
            ctx.translate('common:unexpectedErrorDescription')
         );

      if (!res.length)
         return void ctx.errorReply(
            ctx.translate('commands:weather.errorTitles.noWeatherFound'),
            ctx.translate('commands:weather.errorDescriptions.noWeatherFound')
         );
      
      const { location, current } = res[0];

      const weatherEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `${ctx.translate('commands:weather.weather')}: ${location.name} (${current.day}, ${current.observationtime})`, iconURL: ctx.client.customImages.CLOUD })
         .setThumbnail(current.imageUrl)
         .addFields({
            name: ctx.translate('commands:weather.temperature'),
            value: `${current.temperature}°${degreeType} (${ctx.translate('commands:weather.feelsLike')} ${current.feelslike}°${degreeType})`,
            inline: true
         }, {
            name: ctx.translate('commands:weather.sky'),
            value: current.skytext,
            inline: true
         }, {
            name: ctx.translate('commands:weather.timezone'),
            value: `${location.timezone < 0 ? `UTC${location.timezone}` : `UTC+${location.timezone}`}`,
            inline: true
         }, {
            name: ctx.translate('commands:weather.windSpeed'),
            value: current.winddisplay,
            inline: true
         }, {
            name: ctx.translate('commands:weather.humidity'),
            value: `${current.humidity}%`,
            inline: true
         });

      if (ctx.language === 'fr')
         weatherEmbed.setFooter({ text: 'Les données ne sont pas disponibles en français.' });

      await ctx.interaction.editReply({ embeds: [weatherEmbed] });

   });

}, {
   name: 'weather',
   aliases: ['meteo'],
   description: 'Get the current weather from a location.',
   category: 'UTILITY',
   clientPermissions: [],
   memberPermissions: [],
   formats: [
      '/weather `[location]` `(degree-type)`'
   ],
   examples: [
      '/weather `location: Belgium, Brussels`',
      '/weather `location: UK, London` `degree-type: Fahrenheit`'
   ],
   type: 'SLASH',
   slashData: {
      name: 'weather',
      description: 'Get the current weather from a location.',
      options: [{
         name: 'location',
         description: 'The location you want the weather from.',
         type: ApplicationCommandOptionType.String,
         required: true
      }, {
         name: 'degree-type',
         description: 'The degree type you want the temperatures to be displayed in.',
         type: ApplicationCommandOptionType.String,
         choices: [{
            name: 'Celsius',
            value: 'C'
         }, {
            name: 'Fahrenheit',
            value: 'F'
         }]
      }]
   }
});