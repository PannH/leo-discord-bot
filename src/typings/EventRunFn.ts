import type { LeoClient } from "../structures/LeoClient";

export type EventRunFn = {
   (client: LeoClient, ...params: any[]): Promise<void>;
};