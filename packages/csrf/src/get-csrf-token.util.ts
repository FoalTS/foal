import { Config, generateSignedToken, Session } from '@foal/core';

export async function getCsrfToken(session?: Session): Promise<string> {
  if (!Config.get2('settings.csrf.enabled', 'boolean', true)) {
    return 'CSRF protection disabled';
  }

  if (session) {
    const csrfToken = session.get<string>('csrfToken');
    if (!csrfToken) {
      throw new Error('CSRF token is missing in the session.');
    }
    return csrfToken;
  }

  const secret = Config.getOrThrow(
    'settings.csrf.secret',
    'string',
    'You must provide a secret when using the function "getCsrfToken".'
  );
  return generateSignedToken(secret);
}
