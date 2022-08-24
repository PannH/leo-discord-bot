import type { TimestampStylesString } from "discord.js";

export function timestamp(ts: number, style: TimestampStylesString): string {

   return `<t:${parseInt(String(ts / 1000))}:${style}>`;

};