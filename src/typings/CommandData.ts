import type { PermissionResolvable, ApplicationCommandData } from 'discord.js';

export type CommandData = {
   name: string;
   aliases: string[];
   description: string;
   formats: string[];
   examples: string[];
   category: 'ADMINISTRATION' | 'MODERATION' | 'INFORMATION' | 'UTILITY' | 'FUN' | 'PRIVATE',
   type: 'SLASH' | 'PRIVATE';
   memberPermissions: PermissionResolvable[];
   clientPermissions: PermissionResolvable[];
   note?: string; 
   slashData?: ApplicationCommandData;
};