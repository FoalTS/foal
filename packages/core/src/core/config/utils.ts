export function dotToUnderscore(str: string): string {
  return str
    .replace(/([A-Z])/g, letter => `_${letter}`)
    .replace(/\./g, '_')
    .toUpperCase();
}
