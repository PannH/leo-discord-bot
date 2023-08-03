import { Command } from '../../../structures/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';

export default new Command(async (ctx: CommandContext) => {

   const subCommand = ctx.interaction.options.getSubcommand();
   const language = ctx.interaction.options.getString('lang');
      
   const languageNames = {
      get en() {
         return `🇬🇧 ${ctx.translate('commands:language.languageNames.english')}`;
      },
      get fr() {
         return `🇫🇷 ${ctx.translate('commands:language.languageNames.french')}`;
      },
   };

   switch (subCommand) {

      case 'set': {
      
         if (language === ctx.language)
            return void ctx.errorReply(
               ctx.translate('commands:language.errorTitles.invalidLanguage'),
               ctx.translate('commands:language.errorDescriptions.invalidLanguage')
            );
      
         await ctx.interaction.deferReply({ ephemeral: true });
      
         await ctx.client.prisma.language.upsert({
            create: {
               guildId: ctx.guild.id,
               lang: language
            },
            update: {
               lang: language
            },
            where: {
               guildId: ctx.guild.id
            }
         });
      
         await ctx.client.prisma.cache.update('language');
      
         const confirmEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: ctx.translate('commands:language.languageSetTitle'), iconURL: ctx.client.customImages.TOOLS })
            .setDescription(
               ctx.translate('commands:language.languageSetDescription', { languageName: languageNames[language] })
            );
      
         ctx.interaction.editReply({ embeds: [confirmEmbed] });

         break;

      }

      case 'display': {

         const languageEmbed = new EmbedBuilder()
            .setColor(ctx.client.colors.SECONDARY)
            .setAuthor({ name: ctx.translate('commands:language.currentLanguageTitle'), iconURL: ctx.client.customImages.TOOLS })
            .setDescription(
               ctx.translate('commands:language.currentLanguageDescription', { languageName: languageNames[ctx.language] })
            );

         ctx.interaction.reply({
            embeds: [languageEmbed],
            ephemeral: true
         });

         break;

      }

      default:
         break;

   }

}, {
   name: 'language',
   aliases: [],
   description: 'Configure the bot\'s language for this server.',
   category: 'ADMINISTRATION',
   formats: [
      '/language set `[lang]`'
   ],
   examples: [
      '/language set `lang: French / Français`'
   ],
   clientPermissions: [],
   memberPermissions: ['Administrator'],
   type: 'SLASH',
   slashData: {
      name: 'language',
      description: 'Configure the bot\'s language for this server.',
      options: [{
         name: 'set',
         description: 'Set the bot\'s language for this server.',
         type: ApplicationCommandOptionType.Subcommand,
         options: [{
            name: 'lang',
            description: 'The language you want to set.',
            type: ApplicationCommandOptionType.String,
            choices: [{
               name: 'English / Anglais',
               value: 'en'
            }, {
               name: 'French / Français',
               value: 'fr'
            }]
         }]
      }, {
         name: 'display',
         description: 'Display the current bot\'s language for this server.',
         type: ApplicationCommandOptionType.Subcommand
      }]
   }
});