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
         return void ctx.errorReply('Unexpected Error', 'An error occured while trying to find the weather. Please, retry later.');

      if (!res.length)
         return void ctx.errorReply('No Weather Found', 'No weather was found from the given location.');
      
      const { location, current } = res[0];

      const weatherEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: `Weather: ${location.name} (${current.day}, ${current.observationtime})`, iconURL: ctx.client.customImages.CLOUD })
         .setThumbnail(current.imageUrl)
         .addFields({
            name: 'Temperature',
            value: `${current.temperature}°${degreeType} (feels like ${current.feelslike}°${degreeType})`,
            inline: true
         }, {
            name: 'Sky',
            value: current.skytext,
            inline: true
         }, {
            name: 'Timezone',
            value: `${location.timezone < 0 ? `UTC${location.timezone}` : `UTC+${location.timezone}`}`,
            inline: true
         }, {
            name: 'Wind Speed',
            value: current.winddisplay,
            inline: true
         }, {
            name: 'Humidity',
            value: `${current.humidity}%`,
            inline: true
         });

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