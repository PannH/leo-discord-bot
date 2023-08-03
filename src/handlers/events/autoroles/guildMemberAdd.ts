import { Event } from '../../../structures/Event';
import type { GuildMember } from 'discord.js';

export default new Event('guildMemberAdd', async (client, member: GuildMember) => {

   const { lang: lng } = client.prisma.cache.language.find((language) => language.guildId === member.guild.id) ?? { lang: 'en' };

   const roles = client.prisma.cache.autorole
                        .filter((ar) => ar.guildId === member.guild.id)
                        .map((ar) => ar.roleId);

   if (!roles.length)
      return;

   try {
      await member.roles.add(roles, client.translate('events:autoroles.guildMemberAdd.autoroleSystem', { lng }));
   } catch (error) {
      console.log(error);
   }

});