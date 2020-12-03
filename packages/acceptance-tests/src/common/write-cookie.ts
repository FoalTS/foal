export function writeCookie(name: string, value: string): string[] {
  if (!value) {
    return [];
  }
  return [ `${name}=${value}` ];
}
