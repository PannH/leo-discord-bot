import { ApplicationCommandOptionType, SnowflakeUtil } from 'discord.js';
import { Command } from '../../../structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { CommandContext } from '../../../structures/CommandContext';
import type { GuildMember } from 'discord.js';

export default new Command(async (ctx: CommandContext) => {

   const member = ctx.interaction.options.getMember('user') as GuildMember;
   const reason = ctx.interaction.options.getString('reason');

   if (!member)
      return void ctx.errorReply('Member Not Found', 'The specified member was not found in the server.');

   if (member.user.bot)
      return void ctx.errorReply('Invalid Member', 'You cannot warn a bot.');

   if (member.user.id === ctx.executor.id)
      return void ctx.errorReply('Invalid Member', 'You cannot warn yourself.');

   if ((ctx.member.roles.highest.position <= member.roles.highest.position) && (ctx.guild.ownerId !== ctx.executor.id))
      return void ctx.errorReply('Invalid Member', 'The provided member is hierarchically superior or equal to you.');

   await ctx.interaction.deferReply();

   try {
      
      await ctx.client.prisma.warn.create({
         data: {
            id: SnowflakeUtil.generate().toString(),
            userId: member.user.id,
            guildId: ctx.guild.id,
            moderatorId: ctx.executor.id,
            reason: reason ?? 'None'
         }
      });

      await ctx.client.prisma.cache.update('warn');

      const successEmbed = new EmbedBuilder()
         .setColor(ctx.client.colors.SECONDARY)
         .setAuthor({ name: 'Member Warn', iconURL: ctx.client.customImages.TOOLS })
         .setDescription(`> ${member} has been warned with reason: \`${reason ?? 'No reason'}\`.`);

      await ctx.interaction.editReply({ embeds: [successEmbed] });
   
      try {
         await member.send({ content: `${ctx.client.customEmojis.bell} You have been warned in the server \`${ctx.guild.name}\` with reason: \`${reason ?? 'No reason'}\`.` });
      } catch (_) {
         return;
      };

   } catch (error) {
     
      ctx.errorReply('Unexpected Error', 'An error occured while trying to warn the member. The error has been reported to the developer.');

      ctx.client.emit('error', error);

   };

}, {
   name: 'warn',
   aliases: ['warnings'],
   description: 'Add a warning to a member.',
   formats: [
      '/warn `[user]` `(reason)`'
   ],
   examples: [
      '/warn `user: @User`',
      '/warn `user: 123456789123456789` `reason: Not respecting the rules`'
   ],
   category: 'MODERATION',
   clientPermissions: [],
   memberPermissions: ['KickMembers'],
   type: 'SLASH',
   slashData: {
      name: 'warn',
      description: 'Add a warning to a member.',
      options: [{
         name: 'user',
         description: 'The member you want to warn.',
         type: ApplicationCommandOptionType.User,
         required: true
      }, {
         name: 'reason',
         description: 'The reason for the warn.',
         type: ApplicationCommandOptionType.String,
         maxLength: 512
      }]
   }
});