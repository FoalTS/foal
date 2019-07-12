import { Config, generateSignedToken, Session } from '@foal/core';

export async function getCsrfToken(session?: Session): Promise<string> {
  if (!Config.get('settings.csrf.enabled', true)) {
    return 'CSRF protection disabled';
  }

  if (session) {
    const csrfToken = session.get<string>('csrfToken');
    if (!csrfToken) {
      throw new Error('CSRF token is missing in the session.');
    }
    return csrfToken;
  }

  const secret = Config.get<string|undefined>('settings.csrf.secret');
  if (!secret) {
    throw new Error(
      '[CONFIG] You must provide a secret with the configuration key settings.csrf.secret.'
    );
  }
  return generateSignedToken(secret);
}
