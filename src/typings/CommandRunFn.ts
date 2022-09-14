import type { CommandContext } from '../structures/CommandContext';
import type { PrivateCommandContext } from '../structures/PrivateCommandContext';

export type CommandRunFn = {
   (ctx: (CommandContext | PrivateCommandContext)): Promise<void>;
};