// std
import { strictEqual } from 'assert';
import { createHmac } from 'crypto';

// FoalTS
import { convertBase64ToBase64url, Session } from './session';

describe('convertBase64ToBase64url', () => {
  it('should convert base64-encode strings to base64url-encoded ones.', () => {
    const expected = 'hello-hi-_how_arfA';
    const actual = convertBase64ToBase64url('hello+hi+/how/arfA==');
    strictEqual(actual, expected);
  });
});

describe('Session', () => {

  describe('when it is instanciated', () => {

    it('should throw an error if the sessionId includes a dot.', () => {
      try {
        // tslint:disable-next-line:no-unused-expression
        new Session('xxx.yyy', {}, 0);
        throw new Error('An error should have been thrown during instanciation.');
      } catch (error) {
        strictEqual(error.message, 'A session ID cannot include dots.');
      }
    });

    it('should set two readonly properties "sessionId" and "maxAge" from the given arguments.', () => {
      const session = new Session('xxx', {}, 0);
      strictEqual(session.sessionId, 'xxx');
      strictEqual(session.maxAge, 0);
    });

    it('should not be "modified".', () => {
      const session = new Session('xxx', {}, 0);
      strictEqual(session.isModified, false);
    });

  });

  describe('has a "get" method that', () => {

    it('should return the value of the key given in the param "sessionContent" during instantiation.', () => {
      const session = new Session('', { foo: 'bar' }, 0);
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the default value if the key does not exist.', () => {
      const session = new Session('', { foo: 'bar' }, 0);
      strictEqual(session.get<string>('foobar', 'barfoo'), 'barfoo');
    });

    it('should return undefined if there is no default value and if the key does not exist.', () => {
      const session = new Session('', { foo: 'bar' }, 0);
      strictEqual(session.get('foobar'), undefined);
    });

  });

  describe('has a "set" method that', () => {

    it('should modify the session content...', () => {
      const session = new Session('', {}, 0);
      session.set('foo', 'bar');
      strictEqual(session.get('foo'), 'bar');
    });

    it('...and mark it as modified.', () => {
      const session = new Session('', {}, 0);
      strictEqual(session.isModified, false);

      session.set('foo', 'bar');
      strictEqual(session.isModified, true);
    });

  });

  describe('has a "getToken" method that', () => {

    afterEach(() => delete process.env.SETTINGS_SESSION_SECRET);

    it('should throw an Error is the configuration key `settings.session.secret` is not defined.', () => {
      const session = new Session('aaa', {}, 0);
      try {
        session.getToken();
        throw new Error('Session.getToken should have thrown an Error.');
      } catch (error) {
        strictEqual(
          error.message,
          'You must provide a secret with the configuration key settings.session.secret.'
        );
      }
    });

    it('should return the session ID along with its signature (encoded in base64url).', () => {
      const secretBuffer = Buffer.from([
        0xFB, 0xF0, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
        0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
        0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
        0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      ]); // 32 bytes (256 bits)
      const sessionIdBuffer = Buffer.from([
        0xFB, 0xF0, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
        0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      ]); // 16 bytes (128 bits)

      // Base64 value: +/BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY=
      const secret = secretBuffer.toString('base64').replace('+', '-').replace('/', '_').replace('=', '');
      strictEqual(secret, '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY');

      // Base64 value: +/BmZmZmZmZmZmZmZmZmZg==
      const sessionId = sessionIdBuffer.toString('base64').replace('+', '-').replace('/', '_').replace('==', '');
      strictEqual(sessionId, '-_BmZmZmZmZmZmZmZmZmZg');

      // Base64 value: rD1LLZl5sr+IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk=
      const signature = createHmac('sha256', secretBuffer)
        .update(sessionIdBuffer)
        .digest('base64')
        .replace('+', '-')
        .replace('=', '');
      strictEqual(signature, 'rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk');

      process.env.SETTINGS_SESSION_SECRET = secret;

      const session = new Session(sessionId, {}, 0);
      const token = session.getToken();

      strictEqual(
        token,
        `${sessionId}.${signature}`
      );
    });

  });

  describe('has a static "verifyTokenAndGetId" method that', () => {

    afterEach(() => delete process.env.SETTINGS_SESSION_SECRET);

    it('should throw an Error is the configuration key `settings.session.secret` is not defined.', () => {
      try {
        Session.verifyTokenAndGetId('xxx.yyy');
        throw new Error('Session.getToken should have thrown an Error.');
      } catch (error) {
        strictEqual(
          error.message,
          'You must provide a secret with the configuration key settings.session.secret.'
        );
      }
    });

    it('should return false if the token is not a string.', () => {
      process.env.SETTINGS_SESSION_SECRET = 'a';
      strictEqual(Session.verifyTokenAndGetId(3 as any), false);
    });

    it('should return false if the token format is invalid.', () => {
      process.env.SETTINGS_SESSION_SECRET = 'a';
      strictEqual(Session.verifyTokenAndGetId('xxx'), false);
      strictEqual(Session.verifyTokenAndGetId('.xxx'), false);
      strictEqual(Session.verifyTokenAndGetId('xxx.'), false);
      strictEqual(Session.verifyTokenAndGetId('.'), false);
    });

    it('should verify the token and return false if the signature is incorrect.', () => {
      process.env.SETTINGS_SESSION_SECRET = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
      const token = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZOaaaHS9VepB5dyhJiUIPaa2wfk';

      strictEqual(Session.verifyTokenAndGetId(token), false);
    });

    it('should verify the token and return the session ID if the signature is correct.', () => {
      process.env.SETTINGS_SESSION_SECRET = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
      const token = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk';

      strictEqual(Session.verifyTokenAndGetId(token), '-_BmZmZmZmZmZmZmZmZmZg');
    });

  });

});
