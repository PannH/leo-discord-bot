import type { PermissionResolvable, ApplicationCommandData } from 'discord.js';

export type CommandData = {
   name: string;
   aliases: string[];
   description: string;
   formats: string[];
   examples: string[];
   category: 'ADMINISTRATION' | 'MODERATION' | 'INFORMATION' | 'UTILITY' | 'PRIVATE'
   type: 'SLASH' | 'PRIVATE';
   memberPermissions: PermissionResolvable[];
   clientPermissions: PermissionResolvable[];
   slashData?: ApplicationCommandData;
};