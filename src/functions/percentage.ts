export function percentage(x: number, y: number, decimals?: number): string {

   return ((x * 100) / y).toFixed(decimals ?? 0);
   
};