// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigNotFoundError, Session, verifySignedToken } from '@foal/core';
import { getCsrfToken } from './get-csrf-token.util';

describe('getCsrfToken', () => {

  afterEach(() => delete process.env.SETTINGS_CSRF_ENABLED);

  it('should return "CSRF protection disabled" if settings.csrf.enabled is false.', async () => {
    process.env.SETTINGS_CSRF_ENABLED = 'false';
    const token = await getCsrfToken();
    strictEqual(token, 'CSRF protection disabled');
  });

  describe('given session is undefined.', () => {

    afterEach(() => delete process.env.SETTINGS_CSRF_SECRET);

    it('should throw an error if the configuration key settings.csrf.secret is empty.', async () => {
      try {
        await getCsrfToken();
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.csrf.secret');
        strictEqual(error.msg, 'You must provide a secret when using the function "getCsrfToken".');
      }
    });

    it('should generate a signed token.', async () => {
      const secret = 'csrf-secret';
      process.env.SETTINGS_CSRF_SECRET = secret;
      const signedToken = await getCsrfToken();
      strictEqual(typeof verifySignedToken(signedToken, secret), 'string');
    });

  });

  describe('given session is defined.', () => {

    it('should throw an error if the session key "csrfToken" is empty.', async () => {
      const session = new Session({ store: {} as any, id: 'a', content: {}, createdAt: 0 });
      try {
        await getCsrfToken(session);
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'CSRF token is missing in the session.'
        );
      }
    });

    it('should return the value of the session key "csrfToken".', async () => {
      const session = new Session({ store: {} as any, id: 'a', content: { csrfToken: 'xxx' }, createdAt: 0 });
      const csrfToken = await getCsrfToken(session);
      strictEqual(csrfToken, 'xxx');
    });

  });

});
