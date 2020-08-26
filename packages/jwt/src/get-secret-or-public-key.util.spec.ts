import { ConfigTypeError } from '@foal/core';
import { deepStrictEqual, rejects, strictEqual } from 'assert';
import { getSecretOrPublicKey } from './get-secret-or-public-key.util';

describe('getSecretOrPublicKey', () => {

  context('given the config value settings.jwt.secret is defined', () => {

    const secret = 'secretX';

    beforeEach(() => process.env.SETTINGS_JWT_SECRET = secret);

    afterEach(() => delete process.env.SETTINGS_JWT_SECRET);

    xit('should throw a ConfigTypeError if the value is not a string.', async () => {
      process.env.SETTINGS_JWT_SECRET = 2 as any;
      return rejects(
        () => getSecretOrPublicKey(),
        new ConfigTypeError('settings.jwt.secret', 'string', 'number'),
      );
    });

    context('given the config value settings.jwt.secretEncoding is not defined', () => {

      it('should return the secret.', async () => {
        const actual = await getSecretOrPublicKey();
        strictEqual(actual, secret);
      });

    });

    context('given the config value settings.jwt.secretEncoding is defined', () => {

      const encoding = 'base64';

      beforeEach(() => process.env.SETTINGS_JWT_SECRET_ENCODING = 'base64');

      afterEach(() => delete process.env.SETTINGS_JWT_SECRET_ENCODING);

      xit('should throw a ConfigTypeError if the value is not a string.', () => {
        process.env.SETTINGS_JWT_SECRET_ENCODING = 2 as any;
        return rejects(
          () => getSecretOrPublicKey(),
          new ConfigTypeError('settings.jwt.secretEncoding', 'string', 'number'),
        );
      });

      it('should return the buffered secret.', async () => {
        const actual = await getSecretOrPublicKey();
        if (typeof actual === 'string') {
          throw new Error('The returned value should be a buffer.');
        }

        deepStrictEqual(actual, Buffer.from(secret, encoding));
      });

    });

  });

  context('given the config value settings.jwt.publicKey is defined', () => {

    const publicKey = 'publicKeyX';

    beforeEach(() => process.env.SETTINGS_JWT_PUBLIC_KEY = publicKey);

    afterEach(() => delete process.env.SETTINGS_JWT_PUBLIC_KEY);

    xit('should throw a ConfigTypeError if the value is not a string.', () => {
      process.env.SETTINGS_JWT_PUBLIC_KEY = 2 as any;
      return rejects(
        () => getSecretOrPublicKey(),
        new ConfigTypeError('settings.jwt.publicKey', 'string', 'number'),
      );
    });

    it('should return the RSA public key.', async () => {
      const actual = await getSecretOrPublicKey();
      strictEqual(actual, publicKey);
    });

  });

  context('given the two config values settings.jwt.secret and settings.jwt.publicKey not defined', () => {

    it('should throw an error.', () => {
      return rejects(
        () => getSecretOrPublicKey(),
        {
          message: '[CONFIG] You must provide at least one of these configuration keys: '
            + 'settings.jwt.secret or settings.jwt.publicKey.'
        }
      );
    });

  });

});
