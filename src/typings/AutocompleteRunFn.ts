import type { LeoClient } from '../structures/LeoClient';
import type { AutocompleteInteraction } from 'discord.js';

export type AutocompleteRunFn = {
   (client: LeoClient, interaction: AutocompleteInteraction): Promise<void>;
};