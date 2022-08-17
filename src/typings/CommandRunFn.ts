import type { CommandContext } from '../structures/CommandContext';

export type CommandRunFn = {
   (ctx: CommandContext): Promise<void>;
};