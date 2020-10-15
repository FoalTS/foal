export function writeCookie(name: string, value: string): string[] {
  return [ `${name}=${value}` ];
}
