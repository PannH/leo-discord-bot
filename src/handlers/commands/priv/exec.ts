import { Command } from '../../../structures/Command';
import { codeBlock } from '../../../functions/codeBlock';
import type { PrivateCommandContext } from '../../../structures/PrivateCommandContext';
import { exec } from 'child_process';

export default new Command(async (ctx: PrivateCommandContext) => {

   const command = ctx.message.content.slice(ctx.args[0].length).trim();

   if (!command)
      return;

   exec(command, (error, stdout, stderr) => {

      ctx.message.reply(`🖥️ Shell Command\n${codeBlock(`>>> ${command}\n${error ? stderr : stdout}`)}`);

   });

   // try {

   //    const output = await eval(code);
   //    ctx.message.reply(`⬇️ Input\n${codeBlock(code, 'js')}\n↗️ Output (\`${typeof output}\`)\n${codeBlock(output)}`);

   // } catch (err) {

   //    ctx.message.reply(`⬇️ Input\n${codeBlock(code, 'js')}\n↗️ Output\n${codeBlock(String(err))}`);

   // };

}, {
   name: 'exec',
   aliases: [],
   description: 'Execute a shell command.',
   formats: [
      '!exec `(command)`'
   ],
   examples: [
      '!exec echo "Hello, World!"'
   ],
   category: 'PRIVATE',
   clientPermissions: [],
   memberPermissions: [],
   type: 'PRIVATE'
});