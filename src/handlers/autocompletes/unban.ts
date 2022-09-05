import { Autocomplete } from '../../structures/Autocomplete';

export default new Autocomplete('unban', async (client, interaction) => {

   const query = interaction.options.getFocused().toLowerCase();
   const bans = await interaction.guild.bans.fetch();

   if (!bans.size)
      return void interaction.respond([{ name: 'This server has no bans.', value: '' }]);

   const foundBans = bans.filter((b) => b.user.id === query || b.user.tag.toLowerCase() === query || b.user.tag.toLowerCase().includes(query));
   const choices = !foundBans.size
                     ? [{ name: 'No ban found.', value: '' }]
                     : foundBans.map((b) => {
                        return {
                           name: `${b.user.tag} (reason: ${b.reason ?? 'No reason'})`,
                           value: b.user.id
                        };
                     }).slice(0, 11);

   interaction.respond(choices);

});