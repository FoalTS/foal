export function readCookie(cookies: string[], cookieName: string): { value: string } {
  const cookie = cookies.find(cookie => cookie.includes(`${cookieName}=`));
  if (!cookie) {
    throw new Error(`Cookie ${cookieName} not found.`);
  }

  return { value: cookie.split(`${cookieName}=`)[1].split(';')[0] };
}
