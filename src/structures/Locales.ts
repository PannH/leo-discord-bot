import i18next from 'i18next';

export class Locales {

   public t: typeof i18next.t;

   constructor() {};

   /**
    * @description Initialize locales.
    */
   public async initialize() {

      this.t = await i18next.init({
         interpolation: {
            escapeValue: false
         },
         resources: {
            en: {
               commands: require('../../locales/en/commands.json'),
               events: require('../../locales/en/events.json'),
               common: require('../../locales/en/common.json')
            },
            fr: {
               commands: require('../../locales/fr/commands.json'),
               events: require('../../locales/fr/events.json'),
               common: require('../../locales/fr/common.json')
            }
         }
      });

   };

};