import { Command } from '../../../structures/Command';
import { codeBlock } from '../../../functions/codeBlock';
import type { PrivateCommandContext } from '../../../structures/PrivateCommandContext';

export default new Command(async (ctx: PrivateCommandContext) => {

   const code = ctx.message.content.slice(ctx.args[0].length).trim();

   if (!code)
      return;

   try {

      const output = await eval(code);
      ctx.message.reply(`⬇️ Input\n${codeBlock(code, 'js')}\n↗️ Output (\`${typeof output}\`)\n${codeBlock(output)}`);

   } catch (err) {

      ctx.message.reply(`⬇️ Input\n${codeBlock(code, 'js')}\n↗️ Output\n${codeBlock(String(err))}`);

   };

}, {
   name: 'eval',
   aliases: [],
   description: 'Evaluate pieces of code.',
   formats: [
      '!eval `(code)`'
   ],
   examples: [
      '!eval console.log("Hello, World!")'
   ],
   category: 'PRIVATE',
   clientPermissions: [],
   memberPermissions: [],
   type: 'PRIVATE'
});