import { Autocomplete } from '../../structures/Autocomplete';

export default new Autocomplete('timeout', async (client, interaction) => {

   const input = Number(interaction.options.getFocused());

   if (isNaN(input))
      return void interaction.respond([{ name: 'You must provide a number.', value: 0 }]);

   const defaultChoices = [{
      name: '60 seconds',
      value: 60 * 1000
   }, {
      name: '5 minutes',
      value: 5 * 1000 * 60
   }, {
      name: '10 minutes',
      value: 10 * 1000 * 60
   }, {
      name: '1 hour',
      value: 1 * 1000 * 60 * 60
   }, {
      name: '1 day',
      value: 1 * 1000 * 60 * 60 * 24
   }, {
      name: '1 week',
      value: 1 * 1000 * 60 * 60 * 24 * 7
   }];

   const choices = !input 
                     ? defaultChoices
                     : [{
                        name: `${input} ${input > 1 ? 'seconds' : 'second'}`,
                        value: input * 1000
                     }, {
                        name: `${input} ${input > 1 ? 'minutes' : 'minute'}`,
                        value: input * 1000 * 60
                     }, {
                        name: `${input} ${input > 1 ? 'hours' : 'hour'}`,
                        value: input * 1000 * 60 * 60
                     }, {
                        name: `${input} ${input > 1 ? 'days' : 'day'}`,
                        value: input * 1000 * 60 * 60 * 24
                     }, {
                        name: `${input} ${input > 1 ? 'weeks' : 'week'}`,
                        value: input * 1000 * 60 * 60 * 24 * 7
                     }];

   interaction.respond(choices);

});