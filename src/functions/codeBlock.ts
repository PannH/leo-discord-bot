export function codeBlock(content: string, language?: string): string {

   return `\`\`\`${language ?? ''}\n${content}\n\`\`\``;

};